export type SocialPlatform = 'instagram' | 'x' | 'telegram' | 'facebook' | 'youtube' | 'reddit';

export type SocialContentType = 'video' | 'post' | 'thread' | 'reel' | 'channel_broadcast' | 'comment_cluster';

export interface NormalizedSocialContent {
  platform: SocialPlatform;
  content_id: string;
  parent_content_id?: string;
  author_pseudonym: string;
  author_avatar?: string;
  content_type: SocialContentType;
  text: string;
  media_reference?: {
    type: 'video' | 'image' | 'audio' | 'none';
    url?: string;
    thumbnail?: string;
    duration_seconds?: number;
    mime_type?: string;
  };
  timestamp: string;
  engagement: {
    views: number;
    likes: number;
    shares: number;
    reposts: number;
    comments: number;
    velocity_rate: string; // e.g. "8.4k interactions / hour"
  };
  language: {
    primary: string;
    code_mixed: string[];
    script: string;
  };
  location_signal: {
    region: 'North India' | 'South India' | 'West India' | 'East India' | 'Northeast India' | 'Other/Unknown';
    inferred_city?: string;
    confidence: number;
  };
  topic: string;
  hashtags: string[];
  mentions: string[];
  relationships: string[];
  source_reference: string;
}

export type RiskLevel = 'LOW' | 'CAUTION' | 'HIGH';

export interface RiskSignal {
  id: string;
  category: 'synthetic_media' | 'provenance' | 'context' | 'propagation';
  title: string;
  severity: 'low' | 'caution' | 'high';
  description: string;
  evidence: string[];
  technical_details: string;
}

export interface RiskResult {
  risk_level: RiskLevel;
  confidence: 'Low' | 'Moderate' | 'High';
  overall_assessment: string;
  disclaimer: string;
  signals: RiskSignal[];
  c2pa_metadata: {
    has_credentials: boolean;
    issuer?: string;
    edits_detected: string[];
    signing_time?: string;
    platform_ai_label: boolean;
    platform_label_text?: string;
  };
  synthetic_indicators: {
    detected: boolean;
    visual_artifacts: string[];
    audio_spectral_anomalies: string[];
    face_consistency_score: number; // 0-100
    temporal_coherence: string;
  };
  context_audit: {
    original_context_date?: string;
    current_caption: string;
    drift_detected: boolean;
    reused_footage_origin?: string;
    mismatch_summary: string;
  };
  propagation_anomaly: {
    abnormal_spike: boolean;
    bot_cluster_likelihood: 'Low' | 'Moderate' | 'Elevated';
    cross_platform_velocity: string;
  };
}

export interface SentimentResult {
  overall: {
    positive: number;
    neutral: number;
    negative: number;
  };
  emotions: {
    anger: number;
    anxiety: number;
    fear: number;
    excitement: number;
    joy: number;
    surprise: number;
  };
  stance: {
    supportive: number;
    opposing: number;
    neutral: number;
  };
  sarcasm_indicators: {
    detected: boolean;
    confidence: number;
    count: number;
    sample_patterns: string[];
  };
  by_language: Record<string, {
    positive: number;
    neutral: number;
    negative: number;
    count: number;
  }>;
  by_audience_segment: Record<string, {
    supportive: number;
    opposing: number;
    neutral: number;
  }>;
  sentiment_timeline: Array<{
    timestamp: string;
    positive: number;
    neutral: number;
    negative: number;
    volume: number;
  }>;
}

export interface AudienceSegment {
  id: string;
  name: string;
  age_band: '18–24' | '25–34' | '35–44' | '45–54' | '55+';
  languages: string[];
  top_interests: string[];
  share_percentage: number;
  engagement_rate: string;
  dominant_stance: 'supportive' | 'opposing' | 'skeptical' | 'inquisitive';
  support_percentage: number;
  oppose_percentage: number;
  sample_size: number;
  key_drivers: string;
}

export interface AudienceResult {
  sample_size: number;
  audience_coverage: string;
  inference_confidence: 'High' | 'Moderate' | 'Low';
  privacy_guarantee: string;
  age_bands: Record<'18–24' | '25–34' | '35–44' | '45–54' | '55+', number>;
  regions: Record<'North India' | 'South India' | 'West India' | 'East India' | 'Northeast India' | 'Other/Unknown', number>;
  interests: Record<string, number>;
  segments: AudienceSegment[];
  insufficient_data_notice?: string;
}

export interface NarrativeEvolution {
  from: string;
  to: string;
  trigger_timestamp: string;
  explanation: string;
}

export interface NarrativeItem {
  id: string;
  title: string;
  status: 'emerging' | 'rising' | 'declining' | 'shifted';
  acceleration: string;
  shift_evolution?: NarrativeEvolution;
  origin_platform: SocialPlatform;
  dominant_emotion: string;
  volume: number;
  sample_quote: string;
}

export interface TrendResult {
  acceleration_percentage: number;
  acceleration_period: string;
  velocity_label: string;
  trending_topics: Array<{
    name: string;
    growth: number;
    volume: number;
    sentiment: 'positive' | 'negative' | 'mixed';
  }>;
  viral_keywords: Array<{
    keyword: string;
    weight: number;
    trajectory: 'rising' | 'declining' | 'peak';
    category: string;
  }>;
  narratives: NarrativeItem[];
}

export interface NetworkNode {
  id: string;
  label: string;
  type: 'account' | 'community' | 'channel' | 'content_cluster';
  platform: SocialPlatform;
  centrality: number; // 0 to 1
  engagement_score: number;
  cluster_id: number;
  is_seed?: boolean;
  first_seen: string;
  role_description?: string;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  type: 'repost' | 'reply' | 'mention' | 'shared_content' | 'cross_platform_propagation';
  timestamp: string;
  weight: number;
}

export interface NetworkResult {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  propagation_metrics: {
    total_reach: number;
    cross_platform_hops: number;
    amplification_factor: string;
    propagation_velocity: string;
    primary_hubs: string[];
    cluster_breakdown: Array<{ name: string; size: number; role: string }>;
  };
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  relative_time: string;
  platform: SocialPlatform;
  phase: 'origin' | 'early_reaction' | 'amplification' | 'cross_platform' | 'narrative_shift' | 'peak' | 'stabilization';
  title: string;
  description: string;
  engagement_snapshot: {
    views: number;
    interactions: number;
  };
  sentiment_snapshot: string;
  risk_indicator?: string;
  actor_pseudonym: string;
}

export interface TimelineResult {
  start_time: string;
  peak_time: string;
  events: TimelineEvent[];
}

export interface PlatformObservation {
  platform: SocialPlatform;
  first_appeared: string;
  propagation_delay: string;
  post_count: number;
  total_engagement: number;
  primary_narrative: string;
  sentiment_tone: string;
  sample_content: string;
  risk_signal_alignment: string;
  amplification_vector: string;
}

export interface CrossPlatformResult {
  primary_platform: SocialPlatform;
  total_platforms_detected: number;
  earliest_origin: string;
  propagation_pattern: string;
  platforms: PlatformObservation[];
}

export interface AnalysisAnswers {
  what_is_happening: string;
  who_is_driving_it: string;
  how_is_it_spreading: string;
  what_are_people_feeling: string;
  what_are_the_main_narratives: string;
}

export interface PrivacySummary {
  data_points_analyzed: number;
  anonymization_method: string;
  personal_identifiers_retained: 0;
  inference_type: string;
  raw_storage_policy: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  input_type: 'content' | 'topic' | 'account';
  target_platform: SocialPlatform;
  target_query: string;
  title: string;
  data_source_type: 'LIVE/CONNECTED DATA' | 'SIMULATED DATA' | 'USER-PROVIDED DATA' | 'AI-INFERRED DATA';
  ai_engine: string;
  content: NormalizedSocialContent;
  risk: RiskResult;
  sentiment: SentimentResult;
  audience: AudienceResult;
  trends: TrendResult;
  network: NetworkResult;
  timeline: TimelineResult;
  cross_platform: CrossPlatformResult;
  answers: AnalysisAnswers;
  privacy: PrivacySummary;
}

export interface AnalysisScenario {
  id: string;
  title: string;
  category: 'deepfake' | 'emerging_trend' | 'recontextualized';
  subtitle: string;
  risk_badge: RiskLevel;
  platform: SocialPlatform;
  preview_text: string;
  data: AnalysisResult;
}
