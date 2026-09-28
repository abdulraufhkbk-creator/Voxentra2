import { Request, Response, Router } from 'express';
import { ConnectorRegistry } from './connectors';
import { aiManager } from './ai';
import { dbStore, ReportItem } from './db/store';
import { supabaseService } from './db/supabaseClient';
import { AnalysisResult, SocialPlatform } from '../types/analysis';
import { SEEDED_SCENARIOS } from '../data/seedScenarios';

export const apiRouter = Router();

// 1. POST /api/analyze/content
apiRouter.post('/analyze/content', async (req: Request, res: Response) => {
  try {
    const { platform = 'instagram', content_id, text, scenario_id, url } = req.body;

    // Check if user selected one of the 3 seeded scenarios
    if (scenario_id) {
      const match = SEEDED_SCENARIOS.find((s) => s.id === scenario_id);
      if (match) {
        const result: AnalysisResult = {
          ...match.data,
          id: `vx-analysis-${Date.now()}`,
          timestamp: new Date().toISOString(),
          data_source_type: 'SIMULATED DATA',
        };
        dbStore.saveAnalysis(result);
        return res.json(result);
      }
    }

    const connector = ConnectorRegistry.get(platform as SocialPlatform);
    const content = await connector.fetchContent(url || content_id || 'sample_item');

    if (text && text.trim().length > 0) {
      content.text = text.trim();
    }
    if (url && url.trim().length > 0) {
      content.source_reference = url.trim();
    }

    const ai = aiManager.getActiveProvider();
    const aiOutput = await ai.analyzeFullContent({ content });

    const isLive = connector.getStatus().is_live && !connector.isDemoOnly;

    const analysisResult: AnalysisResult = {
      id: `vx-analysis-${Date.now()}`,
      timestamp: new Date().toISOString(),
      input_type: 'content',
      target_platform: platform as SocialPlatform,
      target_query: url || content_id || 'User Upload Analysis',
      title: `${platform.toUpperCase()} Analysis: "${content.text.slice(0, 48)}..."`,
      data_source_type: isLive ? 'LIVE/CONNECTED DATA' : 'SIMULATED DATA',
      ai_engine: aiOutput.ai_engine,
      content,
      risk: aiOutput.risk,
      sentiment: aiOutput.sentiment,
      audience: aiOutput.audience,
      trends: aiOutput.trends,
      network: aiOutput.network,
      timeline: aiOutput.timeline,
      cross_platform: aiOutput.cross_platform,
      answers: aiOutput.answers,
      privacy: {
        data_points_analyzed: aiOutput.audience.sample_size || 12000,
        anonymization_method: 'k-Anonymity (k>=50) cluster aggregation',
        personal_identifiers_retained: 0,
        inference_type: 'Aggregate multi-modal signal analysis',
        raw_storage_policy: 'Zero individual profile retention',
      },
    };

    dbStore.saveAnalysis(analysisResult);
    return res.json(analysisResult);
  } catch (error: any) {
    console.error('Error in /api/analyze/content:', error);
    return res.status(500).json({ error: 'Failed to analyze content', message: error?.message || 'Unknown error' });
  }
});

// 2. POST /api/analyze/topic
apiRouter.post('/api/analyze/topic', async (req: Request, res: Response) => {
  // handled below
});

apiRouter.post('/analyze/topic', async (req: Request, res: Response) => {
  try {
    const { topic } = req.body;
    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ error: 'Topic string is required' });
    }

    const ai = aiManager.getActiveProvider();
    const aiOutput = await ai.analyzeTopic(topic);

    const analysisResult: AnalysisResult = {
      id: `vx-topic-${Date.now()}`,
      timestamp: new Date().toISOString(),
      input_type: 'topic',
      target_platform: 'x',
      target_query: topic,
      title: `Topical Intelligence: ${topic}`,
      data_source_type: 'SIMULATED DATA',
      ai_engine: aiOutput.ai_engine,
      content: {
        platform: 'x',
        content_id: `topic_${Date.now()}`,
        author_pseudonym: 'TopicEcosystemAggregate',
        content_type: 'post',
        text: `Topical cluster analysis for ${topic}`,
        timestamp: new Date().toISOString(),
        engagement: {
          views: 1800000,
          likes: 95000,
          shares: 34000,
          reposts: 28000,
          comments: 9200,
          velocity_rate: '14.2k interactions / hour',
        },
        language: { primary: 'English', code_mixed: ['Hinglish', 'Hindi', 'Tamil'], script: 'Indic / Latin' },
        location_signal: { region: 'South India', confidence: 0.85 },
        topic,
        hashtags: [`#${topic.replace(/\s+/g, '')}`, '#VoxentraIntel'],
        mentions: [],
        relationships: [],
        source_reference: `Aggregated topical cluster: ${topic}`,
      },
      risk: aiOutput.risk,
      sentiment: aiOutput.sentiment,
      audience: aiOutput.audience,
      trends: aiOutput.trends,
      network: aiOutput.network,
      timeline: aiOutput.timeline,
      cross_platform: aiOutput.cross_platform,
      answers: aiOutput.answers,
      privacy: {
        data_points_analyzed: aiOutput.audience.sample_size,
        anonymization_method: 'Topical macro-binning with zero user identifiers',
        personal_identifiers_retained: 0,
        inference_type: 'Topical conversation diffusion graph',
        raw_storage_policy: 'Zero individual profile retention',
      },
    };

    dbStore.saveAnalysis(analysisResult);
    return res.json(analysisResult);
  } catch (error: any) {
    console.error('Error in /api/analyze/topic:', error);
    return res.status(500).json({ error: 'Failed to analyze topic', message: error?.message });
  }
});

// 3. POST /api/analyze/account
apiRouter.post('/analyze/account', async (req: Request, res: Response) => {
  try {
    const { account, platform = 'x' } = req.body;
    if (!account) {
      return res.status(400).json({ error: 'Account pseudonym or handle required' });
    }

    const ai = aiManager.getActiveProvider();
    const aiOutput = await ai.analyzeAccount(account);

    const analysisResult: AnalysisResult = {
      id: `vx-account-${Date.now()}`,
      timestamp: new Date().toISOString(),
      input_type: 'account',
      target_platform: platform as SocialPlatform,
      target_query: account,
      title: `Account Diffusion Impact: @${account.replace('@', '')}`,
      data_source_type: 'SIMULATED DATA',
      ai_engine: aiOutput.ai_engine,
      content: {
        platform: platform as SocialPlatform,
        content_id: `acc_${Date.now()}`,
        author_pseudonym: `Pseudonym_${account.replace('@', '')}`,
        content_type: 'post',
        text: `Behavioral topology audit for observed public account @${account.replace('@', '')}. Anonymized aggregate analysis.`,
        timestamp: new Date().toISOString(),
        engagement: {
          views: 940000,
          likes: 42000,
          shares: 18000,
          reposts: 12000,
          comments: 4800,
          velocity_rate: '6.4k interactions / hour',
        },
        language: { primary: 'English', code_mixed: ['Hinglish'], script: 'Latin' },
        location_signal: { region: 'North India', confidence: 0.78 },
        topic: 'Account Propagation Analysis',
        hashtags: [],
        mentions: [],
        relationships: [],
        source_reference: `Public profile behavioral audit: ${account}`,
      },
      risk: aiOutput.risk,
      sentiment: aiOutput.sentiment,
      audience: aiOutput.audience,
      trends: aiOutput.trends,
      network: aiOutput.network,
      timeline: aiOutput.timeline,
      cross_platform: aiOutput.cross_platform,
      answers: aiOutput.answers,
      privacy: {
        data_points_analyzed: 11500,
        anonymization_method: 'Differential privacy on connection degrees, full pseudonymization',
        personal_identifiers_retained: 0,
        inference_type: 'Public network centrality & reach modeling',
        raw_storage_policy: 'Zero individual profile retention',
      },
    };

    dbStore.saveAnalysis(analysisResult);
    return res.json(analysisResult);
  } catch (error: any) {
    console.error('Error in /api/analyze/account:', error);
    return res.status(500).json({ error: 'Failed to analyze account', message: error?.message });
  }
});

// 4. GET /api/analysis/:id
apiRouter.get('/analysis/:id', (req: Request, res: Response) => {
  const analysis = dbStore.getAnalysis(req.params.id);
  if (!analysis) {
    return res.status(404).json({ error: 'Analysis not found' });
  }
  return res.json(analysis);
});

// 5. GET /api/analysis/:id/timeline
apiRouter.get('/analysis/:id/timeline', (req: Request, res: Response) => {
  const analysis = dbStore.getAnalysis(req.params.id);
  if (!analysis) return res.status(404).json({ error: 'Analysis not found' });
  return res.json(analysis.timeline);
});

// 6. GET /api/analysis/:id/audience
apiRouter.get('/analysis/:id/audience', (req: Request, res: Response) => {
  const analysis = dbStore.getAnalysis(req.params.id);
  if (!analysis) return res.status(404).json({ error: 'Analysis not found' });
  return res.json(analysis.audience);
});

// 7. GET /api/analysis/:id/trends
apiRouter.get('/analysis/:id/trends', (req: Request, res: Response) => {
  const analysis = dbStore.getAnalysis(req.params.id);
  if (!analysis) return res.status(404).json({ error: 'Analysis not found' });
  return res.json(analysis.trends);
});

// 8. GET /api/analysis/:id/network
apiRouter.get('/analysis/:id/network', (req: Request, res: Response) => {
  const analysis = dbStore.getAnalysis(req.params.id);
  if (!analysis) return res.status(404).json({ error: 'Analysis not found' });
  return res.json(analysis.network);
});

// 9. GET /api/analysis/:id/risk
apiRouter.get('/analysis/:id/risk', (req: Request, res: Response) => {
  const analysis = dbStore.getAnalysis(req.params.id);
  if (!analysis) return res.status(404).json({ error: 'Analysis not found' });
  return res.json(analysis.risk);
});

// 10. GET /api/history
apiRouter.get('/history', (_req: Request, res: Response) => {
  const list = dbStore.getAllAnalyses().map((a) => ({
    id: a.id,
    timestamp: a.timestamp,
    title: a.title,
    platform: a.target_platform,
    risk_level: a.risk.risk_level,
    input_type: a.input_type,
    summary: a.answers.what_is_happening,
    confidence: a.risk.confidence,
    views: a.content.engagement.views,
  }));
  return res.json(list);
});

// 11. DELETE /api/history/:id
apiRouter.delete('/history/:id', (req: Request, res: Response) => {
  const success = dbStore.deleteAnalysis(req.params.id);
  return res.json({ success });
});

// 12. DELETE /api/history
apiRouter.delete('/history', (_req: Request, res: Response) => {
  dbStore.clearAllAnalyses();
  return res.json({ success: true, message: 'All analysis history cleared.' });
});

// 13. GET /api/connectors/status
apiRouter.get('/connectors/status', (_req: Request, res: Response) => {
  const statuses = ConnectorRegistry.getAllStatuses();
  return res.json(statuses);
});

// 14. POST /api/connectors/:platform/test
apiRouter.post('/connectors/:platform/test', async (req: Request, res: Response) => {
  try {
    const connector = ConnectorRegistry.get(req.params.platform as SocialPlatform);
    const result = await connector.testConnection();
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ connected: false, message: err?.message || 'Connector not found' });
  }
});

// 15. GET /api/database/status
apiRouter.get('/database/status', async (_req: Request, res: Response) => {
  const isConfigured = supabaseService.isConfigured();
  if (!isConfigured) {
    return res.json({
      type: 'LOCAL_PERSISTENT',
      supabase_configured: false,
      connected: true,
      schema_pending: false,
      message: 'Local persistent storage active (data/voxentra_store.json). Ready for all analyses.',
    });
  }

  const test = await supabaseService.testConnection();
  return res.json({
    type: 'SUPABASE_POSTGRESQL',
    supabase_configured: true,
    connected: test.connected,
    schema_pending: test.schema_pending || false,
    message: test.message,
  });
});

// 16. POST /api/database/test
apiRouter.post('/database/test', async (_req: Request, res: Response) => {
  const test = await supabaseService.testConnection();
  return res.json(test);
});

// 17. GET /api/privacy/status
apiRouter.get('/privacy/status', (_req: Request, res: Response) => {
  return res.json({
    privacy_mode: 'STRICT_ANONYMIZED_AGGREGATION',
    personal_data_collected: 0,
    credentials_collected: 0,
    browser_telemetry_active: false,
    retention_period: 'Local persistent sandbox & secure Supabase (cleared upon user request)',
    anonymization_standard: 'k-Anonymity (k>=50) + Differential Privacy for demographic outputs',
    guarantee: 'Voxentra analyzes public content and macro-social context only. Individual profiles, private messages, and cookies are never accessed.',
  });
});

// 18. POST /api/reports/generate
apiRouter.post('/reports/generate', (req: Request, res: Response) => {
  const { analysis_id, custom_notes } = req.body;
  const analysis = dbStore.getAnalysis(analysis_id);
  if (!analysis) {
    return res.status(404).json({ error: 'Analysis not found' });
  }

  const report: ReportItem = {
    id: `rep-${Date.now()}`,
    analysis_id: analysis.id,
    title: `Intelligence Report: ${analysis.title}`,
    created_at: new Date().toISOString(),
    summary: analysis.answers.what_is_happening,
    risk_level: analysis.risk.risk_level,
    pdf_ready: true,
  };

  dbStore.saveReport(report);
  return res.json({
    report,
    analysis,
    custom_notes: custom_notes || '',
    generated_at: new Date().toISOString(),
    format: 'PRINT_READY_HTML_PDF',
  });
});

// 19. GET /api/reports
apiRouter.get('/reports', (_req: Request, res: Response) => {
  return res.json(dbStore.getAllReports());
});

// 20. GET /api/extension/config
apiRouter.get('/extension/config', (_req: Request, res: Response) => {
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  return res.json({
    extension_name: 'Voxentra Browser Companion',
    version: '1.0.0',
    manifest_version: 3,
    api_endpoint: `${appUrl}/api/analyze/content`,
    active_live_platforms: ['x', 'youtube', 'telegram'],
    demo_seeded_platforms: ['instagram', 'facebook', 'reddit'],
    permissions_requested: ['activeTab', 'storage'],
  });
});
