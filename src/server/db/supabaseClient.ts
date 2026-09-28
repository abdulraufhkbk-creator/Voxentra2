import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AnalysisResult } from '../../types/analysis';
import { ReportItem } from './store';

class SupabaseService {
  private client: SupabaseClient | null = null;
  private url: string | undefined;
  private key: string | undefined;
  private schemaPending: boolean = false;
  private warnedOnce: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    this.url = process.env.SUPABASE_URL?.trim();
    // Support either SUPABASE_SECRET_KEY or SUPABASE_SERVICE_KEY
    this.key = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY)?.trim();

    if (this.url && this.key && this.url.startsWith('http') && this.key.length > 20) {
      try {
        this.client = createClient(this.url, this.key, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        });
        console.log('[VOXENTRA Supabase] Client initialized with endpoint:', this.url);
      } catch (err) {
        console.warn('[VOXENTRA Supabase] Initialization warning:', err);
        this.client = null;
      }
    } else {
      this.client = null;
    }
  }

  private isTableMissingError(error: any): boolean {
    if (!error) return false;
    const msg = (error.message || '').toLowerCase();
    const code = error.code || '';
    return (
      code === '42P01' ||
      code === 'PGRST205' ||
      code === 'PGRST204' ||
      msg.includes('could not find the table') ||
      msg.includes('relation "public.analyses" does not exist') ||
      msg.includes('relation "analyses" does not exist') ||
      msg.includes('schema cache')
    );
  }

  isConfigured(): boolean {
    return this.client !== null;
  }

  isSchemaPending(): boolean {
    return this.schemaPending;
  }

  getClient(): SupabaseClient | null {
    if (!this.client && this.url && this.key) {
      this.init();
    }
    return this.client;
  }

  async testConnection(): Promise<{ connected: boolean; message: string; schema_pending?: boolean }> {
    if (!this.client) {
      return {
        connected: false,
        message: 'Supabase credentials (SUPABASE_URL and SUPABASE_SECRET_KEY) not found in server environment. Local persistent storage is active.',
        schema_pending: false,
      };
    }

    try {
      // Test querying the analyses table or server health
      const { data, error } = await this.client.from('analyses').select('id').limit(1);
      if (error) {
        if (this.isTableMissingError(error)) {
          this.schemaPending = true;
          return {
            connected: true,
            schema_pending: true,
            message: `Supabase authenticated successfully at ${this.url}! Note: 'public.analyses' table is not yet created in PostgreSQL schema. Run supabase/schema.sql in Supabase SQL Editor. Local storage ('data/voxentra_store.json') is fully active.`,
          };
        }
        return {
          connected: false,
          schema_pending: false,
          message: `Supabase query returned: ${error.message} (${error.code || 'unknown'})`,
        };
      }
      this.schemaPending = false;
      return {
        connected: true,
        schema_pending: false,
        message: `Supabase PostgreSQL active & healthy. Connected to ${this.url}.`,
      };
    } catch (err: any) {
      return {
        connected: false,
        schema_pending: false,
        message: `Network error connecting to Supabase: ${err?.message || 'timeout'}`,
      };
    }
  }

  async saveAnalysis(analysis: AnalysisResult): Promise<boolean> {
    if (!this.client || this.schemaPending) return false;

    try {
      const payload = {
        id: analysis.id,
        created_at: analysis.timestamp,
        input_type: analysis.input_type,
        target_platform: analysis.target_platform,
        target_query: analysis.target_query,
        title: analysis.title,
        data_source_type: analysis.data_source_type,
        ai_engine: analysis.ai_engine,
        risk_level: analysis.risk.risk_level,
        risk_confidence: analysis.risk.confidence,
        what_is_happening: analysis.answers.what_is_happening,
        who_is_driving_it: analysis.answers.who_is_driving_it,
        how_is_it_spreading: analysis.answers.how_is_it_spreading,
        what_are_people_feeling: analysis.answers.what_are_people_feeling,
        what_are_the_main_narratives: analysis.answers.what_are_the_main_narratives,
        raw_payload: analysis,
      };

      const { error } = await this.client.from('analyses').upsert(payload);
      if (error) {
        if (this.isTableMissingError(error)) {
          this.schemaPending = true;
          if (!this.warnedOnce) {
            this.warnedOnce = true;
            console.log(
              `[VOXENTRA Supabase] Notice: 'public.analyses' table not yet initialized in Supabase project. Using local persistent storage ('data/voxentra_store.json'). Execute 'supabase/schema.sql' in your Supabase SQL Editor if you want to sync with Supabase PostgreSQL.`
            );
          }
          return false;
        }
        console.warn('[VOXENTRA Supabase] Save analysis error:', error.message);
        return false;
      }
      this.schemaPending = false;
      return true;
    } catch (e: any) {
      if (this.isTableMissingError(e)) {
        this.schemaPending = true;
      } else {
        console.warn('[VOXENTRA Supabase] Exception saving analysis:', e);
      }
      return false;
    }
  }

  async getAnalysis(id: string): Promise<AnalysisResult | null> {
    if (!this.client || this.schemaPending) return null;

    try {
      const { data, error } = await this.client
        .from('analyses')
        .select('raw_payload')
        .eq('id', id)
        .single();

      if (error) {
        if (this.isTableMissingError(error)) {
          this.schemaPending = true;
        }
        return null;
      }
      if (!data) return null;
      return data.raw_payload as AnalysisResult;
    } catch (e) {
      return null;
    }
  }

  async getAllAnalyses(): Promise<AnalysisResult[] | null> {
    if (!this.client || this.schemaPending) return null;

    try {
      const { data, error } = await this.client
        .from('analyses')
        .select('raw_payload')
        .order('created_at', { ascending: false });

      if (error) {
        if (this.isTableMissingError(error)) {
          this.schemaPending = true;
        }
        return null;
      }
      if (!data) return null;
      return data.map((d: any) => d.raw_payload as AnalysisResult);
    } catch (e) {
      return null;
    }
  }

  async deleteAnalysis(id: string): Promise<boolean> {
    if (!this.client || this.schemaPending) return false;

    try {
      const { error } = await this.client.from('analyses').delete().eq('id', id);
      if (error && this.isTableMissingError(error)) {
        this.schemaPending = true;
        return false;
      }
      return !error;
    } catch (e) {
      return false;
    }
  }

  async saveReport(report: ReportItem, analysis: AnalysisResult): Promise<boolean> {
    if (!this.client || this.schemaPending) return false;

    try {
      const payload = {
        id: report.id,
        analysis_id: report.analysis_id,
        title: report.title,
        created_at: report.created_at,
        summary: report.summary,
        risk_level: report.risk_level,
        report_data: { report, analysis },
      };

      const { error } = await this.client.from('reports').upsert(payload);
      if (error && this.isTableMissingError(error)) {
        this.schemaPending = true;
        return false;
      }
      return !error;
    } catch (e) {
      return false;
    }
  }

  async getAllReports(): Promise<ReportItem[] | null> {
    if (!this.client || this.schemaPending) return null;

    try {
      const { data, error } = await this.client
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (this.isTableMissingError(error)) {
          this.schemaPending = true;
        }
        return null;
      }
      if (!data) return null;
      return data.map((d: any) => ({
        id: d.id,
        analysis_id: d.analysis_id,
        title: d.title,
        created_at: d.created_at,
        summary: d.summary,
        risk_level: d.risk_level,
        pdf_ready: true,
      }));
    } catch (e) {
      return null;
    }
  }
}

export const supabaseService = new SupabaseService();
