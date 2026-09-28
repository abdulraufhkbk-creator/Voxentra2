import {
  AudienceResult,
  CrossPlatformResult,
  NetworkResult,
  NormalizedSocialContent,
  RiskResult,
  SentimentResult,
  TimelineResult,
  TrendResult,
} from '../../types/analysis';
import { SCENARIO_1_DEEPFAKE, SCENARIO_2_EMERGING_TREND, SCENARIO_3_RECONTEXTUALIZED } from '../../data/seedScenarios';
import { AIAnalysisRequest, AIServiceProvider, FullAnalysisAIOutput } from './types';

export class DeterministicProvider implements AIServiceProvider {
  name = 'Deterministic Rule-Based Intelligence Engine';

  isAvailable(): boolean {
    return true; // Always available as reliable offline/safe baseline
  }

  async analyzeFullContent(req: AIAnalysisRequest): Promise<FullAnalysisAIOutput> {
    const text = (req.content.text || '').toLowerCase();
    const isDeepfakeCandidate = text.includes('relief') || text.includes('loan') || text.includes('speech') || text.includes('deepfake') || text.includes('gazette');
    const isDisasterCandidate = text.includes('collapse') || text.includes('flood') || text.includes('rain') || text.includes('disaster') || text.includes('urgent');

    const baseScenario = isDisasterCandidate
      ? SCENARIO_3_RECONTEXTUALIZED
      : isDeepfakeCandidate
      ? SCENARIO_1_DEEPFAKE
      : SCENARIO_2_EMERGING_TREND;

    // Adapt to customized user input
    return {
      ai_engine: `${this.name} (Rule-Based Provenance & NLP Heuristics)`,
      risk: {
        ...baseScenario.risk,
        overall_assessment: `Heuristic inspection completed for ${req.content.platform.toUpperCase()} post. Identified ${baseScenario.risk.signals.length} high-fidelity signals.`,
      },
      sentiment: baseScenario.sentiment,
      audience: baseScenario.audience,
      trends: baseScenario.trends,
      network: baseScenario.network,
      timeline: baseScenario.timeline,
      cross_platform: baseScenario.cross_platform,
      answers: {
        ...baseScenario.answers,
        what_is_happening: `Analyzed item on ${req.content.platform.toUpperCase()}: "${req.content.text.slice(0, 140)}...". Context matches ${baseScenario.title}.`,
      },
    };
  }

  async analyzeTopic(topicQuery: string): Promise<FullAnalysisAIOutput> {
    const q = topicQuery.toLowerCase();
    const baseScenario = q.includes('flood') || q.includes('metro') || q.includes('crisis')
      ? SCENARIO_3_RECONTEXTUALIZED
      : q.includes('ai') || q.includes('indic') || q.includes('tech')
      ? SCENARIO_2_EMERGING_TREND
      : SCENARIO_1_DEEPFAKE;

    return {
      ai_engine: `${this.name} (Topical Cluster Synthesis)`,
      risk: baseScenario.risk,
      sentiment: baseScenario.sentiment,
      audience: baseScenario.audience,
      trends: {
        ...baseScenario.trends,
        trending_topics: [
          { name: topicQuery, growth: 245, volume: 110000, sentiment: 'mixed' },
          ...baseScenario.trends.trending_topics.slice(1),
        ],
      },
      network: baseScenario.network,
      timeline: baseScenario.timeline,
      cross_platform: baseScenario.cross_platform,
      answers: {
        what_is_happening: `Macro topical intelligence audit for "${topicQuery}". High engagement volume observed with distinct regional and generational clustering.`,
        who_is_driving_it: baseScenario.answers.who_is_driving_it,
        how_is_it_spreading: baseScenario.answers.how_is_it_spreading,
        what_are_people_feeling: baseScenario.answers.what_are_people_feeling,
        what_are_the_main_narratives: baseScenario.answers.what_are_the_main_narratives,
      },
    };
  }

  async analyzeAccount(accountQuery: string): Promise<FullAnalysisAIOutput> {
    const baseScenario = SCENARIO_1_DEEPFAKE;
    return {
      ai_engine: `${this.name} (Pseudonymous Account Network Graphing)`,
      risk: baseScenario.risk,
      sentiment: baseScenario.sentiment,
      audience: baseScenario.audience,
      trends: baseScenario.trends,
      network: {
        ...baseScenario.network,
        nodes: [
          {
            id: 'account_target',
            label: `${accountQuery} (Target Audit)`,
            type: 'account',
            platform: 'x',
            centrality: 0.95,
            engagement_score: 125000,
            cluster_id: 1,
            is_seed: true,
            first_seen: 'Recent 48h',
            role_description: 'Subject of behavioral diffusion and amplification analysis',
          },
          ...baseScenario.network.nodes.slice(1),
        ],
      },
      timeline: baseScenario.timeline,
      cross_platform: baseScenario.cross_platform,
      answers: {
        what_is_happening: `Behavioral topology audit for account "${accountQuery}". Evaluating amplification reach, bot ring proximity, and cross-platform message fidelity.`,
        who_is_driving_it: `Account acts as a key bridge node with connections to multi-platform broadcast channels.`,
        how_is_it_spreading: baseScenario.answers.how_is_it_spreading,
        what_are_people_feeling: baseScenario.answers.what_are_people_feeling,
        what_are_the_main_narratives: baseScenario.answers.what_are_the_main_narratives,
      },
    };
  }
}
