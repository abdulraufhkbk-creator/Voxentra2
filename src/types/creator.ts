import { SocialPlatform } from './analysis';

export type CreatorContentFormat =
  | 'Short video / Reel / Short'
  | 'Long-form YouTube video'
  | 'Carousel / Slides'
  | 'X / Threads Post Sequence'
  | 'Explainer Breakdown'
  | 'News Analysis & Debunk'
  | 'Educational Walkthrough'
  | 'FAQ / Q&A Spotlight'
  | 'Infographic / Visual Summary';

export type CreatorTone =
  | 'Educational & Objective'
  | 'Forensic & Analytical'
  | 'Conversational & Engaging'
  | 'Authoritative & Investigative'
  | 'Concise & Fast-Paced'
  | 'Empathetic & Clarifying';

export type CreatorObjective =
  | 'Demystify Misleading Claims'
  | 'Answer Top Audience Questions'
  | 'Fill an Unaddressed Information Gap'
  | 'Explain Technical / Complex Concepts'
  | 'Provide Actionable Verification Checklist'
  | 'Highlight Emerging Innovations';

export interface EmergingTopicItem {
  id: string;
  name: string;
  discussion_volume: string;
  growth_rate: string;
  velocity: 'High' | 'Surging' | 'Moderate' | 'Steady';
  platforms: SocialPlatform[];
  sentiment: 'positive' | 'negative' | 'mixed' | 'skeptical';
  audience_interest: 'Very High' | 'High' | 'Moderate';
  why_notable: string;
  why_it_matters: string;
  signal_summary: string;
}

export interface AudienceQuestionItem {
  id: string;
  question: string;
  frequency: string;
  platforms: SocialPlatform[];
  related_topic: string;
  discussion_volume: string;
  context_sample: string;
  urgency: 'Immediate Need' | 'High Interest' | 'Background Query';
}

export interface ConversationGapItem {
  id: string;
  title: string;
  gap: string;
  evidence: string;
  audience_signal: string;
  opportunity: string;
  related_topic: string;
  platforms: SocialPlatform[];
  suggested_formats: CreatorContentFormat[];
}

export interface CreatorOpportunityItem {
  id: string;
  topic: string;
  opportunity_title: string;
  why_it_matters: string;
  audience_need: string;
  supporting_evidence: string;
  relevant_platforms: SocialPlatform[];
  suggested_format: CreatorContentFormat;
  possible_angle: string;
}

export interface IdeaForgeConfig {
  topic: string;
  platform: SocialPlatform | 'all';
  audience: string;
  content_format: CreatorContentFormat;
  tone: CreatorTone;
  objective: CreatorObjective;
  custom_angle?: string;
  selected_gap_id?: string;
}

export interface IdeaForgeGeneratedConcept {
  id: string;
  title: string;
  hook: string;
  audience: string;
  problem_or_question: string;
  core_angle: string;
  format: CreatorContentFormat;
  platform: string;
  why_now: string;
  evidence: string;
  related_conversation_gap: string;
  related_trend: string;
  outline_bullets: string[];
  suggested_tags: string[];
  call_to_action: string;
}

export interface CreatorInsightReportData {
  report_id: string;
  generated_at: string;
  topic: string;
  velocity_summary: {
    acceleration_percentage: number;
    acceleration_period: string;
    velocity_label: string;
    total_platforms_count: number;
    total_views: number;
    velocity_rate: string;
  };
  executive_brief: string;
  emerging_topics: EmergingTopicItem[];
  narrative_signals: Array<{
    id: string;
    title: string;
    status: 'emerging' | 'rising' | 'declining' | 'shifted';
    origin_platform: SocialPlatform;
    dominant_emotion: string;
    sample_quote: string;
    volume: number;
    shift?: {
      from: string;
      to: string;
      trigger_timestamp: string;
      explanation: string;
    };
  }>;
  audience_questions: AudienceQuestionItem[];
  conversation_gaps: ConversationGapItem[];
  sentiment_intelligence: {
    dominant_tone: string;
    breakdown: { positive: number; neutral: number; negative: number };
    top_emotions: Array<{ emotion: string; percentage: number }>;
    language_signals: Array<{ language: string; sentiment_label: string; count: number }>;
  };
  platform_strategy: Array<{
    platform: SocialPlatform;
    activity_level: string;
    recommended_format: CreatorContentFormat;
    best_timing_signal: string;
    audience_focus: string;
    engagement_share: string;
  }>;
  content_roadmap: CreatorOpportunityItem[];
  featured_idea_concept: IdeaForgeGeneratedConcept;
}

