import fs from 'fs';
import path from 'path';
import { AnalysisResult } from '../../types/analysis';
import { SCENARIO_1_DEEPFAKE, SCENARIO_2_EMERGING_TREND, SCENARIO_3_RECONTEXTUALIZED } from '../../data/seedScenarios';
import { supabaseService } from './supabaseClient';

export interface ReportItem {
  id: string;
  analysis_id: string;
  title: string;
  created_at: string;
  summary: string;
  risk_level: string;
  pdf_ready: boolean;
}

export class VoxentraStore {
  private dataDir: string;
  private filePath: string;
  private analyses: Map<string, AnalysisResult> = new Map();
  private reports: Map<string, ReportItem> = new Map();

  constructor() {
    this.dataDir = path.resolve(process.cwd(), 'data');
    this.filePath = path.join(this.dataDir, 'voxentra_store.json');
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }

      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.analyses && Array.isArray(parsed.analyses)) {
          parsed.analyses.forEach((a: AnalysisResult) => this.analyses.set(a.id, a));
        }
        if (parsed.reports && Array.isArray(parsed.reports)) {
          parsed.reports.forEach((r: ReportItem) => this.reports.set(r.id, r));
        }
      }
    } catch (e) {
      console.warn('Could not read existing voxentra_store.json, creating initial store:', e);
    }

    // Seed default scenarios if empty so the app is immediately populated on launch
    if (this.analyses.size === 0) {
      this.saveAnalysis(SCENARIO_1_DEEPFAKE);
      this.saveAnalysis(SCENARIO_2_EMERGING_TREND);
      this.saveAnalysis(SCENARIO_3_RECONTEXTUALIZED);

      this.saveReport({
        id: 'rep-01',
        analysis_id: SCENARIO_1_DEEPFAKE.id,
        title: 'Executive Intelligence Brief: Synthetic Speech & Phishing Campaign',
        created_at: new Date().toISOString(),
        summary: 'Forensic evaluation of high-risk synthetic video featuring fabricated government debt relief speech.',
        risk_level: 'HIGH',
        pdf_ready: true,
      });
      this.saveReport({
        id: 'rep-02',
        analysis_id: SCENARIO_2_EMERGING_TREND.id,
        title: 'Topical Momentum Brief: BhashaTech Multilingual Open Model',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        summary: 'Analysis of organic student & developer engagement following open weights foundation model release.',
        risk_level: 'LOW',
        pdf_ready: true,
      });
    }

    // If Supabase is connected, attempt background sync of seeded items
    if (supabaseService.isConfigured()) {
      this.syncToSupabase();
    }
  }

  private async syncToSupabase() {
    for (const a of this.analyses.values()) {
      await supabaseService.saveAnalysis(a);
    }
  }

  private persist() {
    try {
      const data = {
        analyses: Array.from(this.analyses.values()),
        reports: Array.from(this.reports.values()),
        updated_at: new Date().toISOString(),
      };
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write voxentra_store.json:', err);
    }
  }

  saveAnalysis(analysis: AnalysisResult): AnalysisResult {
    this.analyses.set(analysis.id, analysis);
    this.persist();

    // Asynchronously push to Supabase if configured and schema is ready
    if (supabaseService.isConfigured() && !supabaseService.isSchemaPending()) {
      supabaseService.saveAnalysis(analysis).catch(() => {});
    }

    return analysis;
  }

  getAnalysis(id: string): AnalysisResult | undefined {
    return this.analyses.get(id);
  }

  getAllAnalyses(): AnalysisResult[] {
    return Array.from(this.analyses.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  deleteAnalysis(id: string): boolean {
    const deleted = this.analyses.delete(id);
    if (deleted) {
      this.persist();
      if (supabaseService.isConfigured()) {
        supabaseService.deleteAnalysis(id).catch(() => {});
      }
    }
    return deleted;
  }

  clearAllAnalyses(): void {
    this.analyses.clear();
    this.reports.clear();
    this.persist();
  }

  saveReport(report: ReportItem): ReportItem {
    this.reports.set(report.id, report);
    this.persist();

    if (supabaseService.isConfigured()) {
      const a = this.getAnalysis(report.analysis_id) || SCENARIO_1_DEEPFAKE;
      supabaseService.saveReport(report, a).catch(() => {});
    }

    return report;
  }

  getAllReports(): ReportItem[] {
    return Array.from(this.reports.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
}

export const dbStore = new VoxentraStore();
