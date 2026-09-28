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

export interface AIAnalysisRequest {
  content: NormalizedSocialContent;
  focusArea?: 'risk' | 'audience' | 'trends' | 'all';
  additionalContext?: string;
}

export interface SentimentAnalysisOutput {
  sentiment: SentimentResult;
  languages_detected: string[];
  code_mixing_intensity: string;
}

export interface RiskAnalysisOutput {
  risk: RiskResult;
  ai_synthesis_notes: string;
}

export interface AudienceAnalysisOutput {
  audience: AudienceResult;
  demographic_insights: string;
}

export interface TrendAnalysisOutput {
  trends: TrendResult;
  narrative_acceleration: string;
}

export interface FullAnalysisAIOutput {
  ai_engine: string;
  risk: RiskResult;
  sentiment: SentimentResult;
  audience: AudienceResult;
  trends: TrendResult;
  network: NetworkResult;
  timeline: TimelineResult;
  cross_platform: CrossPlatformResult;
  answers: {
    what_is_happening: string;
    who_is_driving_it: string;
    how_is_it_spreading: string;
    what_are_people_feeling: string;
    what_are_the_main_narratives: string;
  };
}

export interface AIServiceProvider {
  name: string;
  isAvailable(): boolean;
  analyzeFullContent(req: AIAnalysisRequest): Promise<FullAnalysisAIOutput>;
  analyzeTopic(topicQuery: string): Promise<FullAnalysisAIOutput>;
  analyzeAccount(accountQuery: string): Promise<FullAnalysisAIOutput>;
}
