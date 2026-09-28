import { NormalizedSocialContent, SocialPlatform } from '../../types/analysis';

export type ConnectorMode = 'connected_live' | 'configured_unavailable' | 'not_configured';

export interface ConnectorStatus {
  platform: SocialPlatform;
  displayName: string;
  status: ConnectorMode;
  is_live: boolean;
  required_credentials: string[];
  optional_credentials: string[];
  api_endpoint_configured: boolean;
  description: string;
  rate_limit_info: string;
  activation_guide: string;
  last_test_message?: string;
  last_tested_at?: string;
  records_retrieved?: number;
}

export interface PlatformConnector {
  platform: SocialPlatform;
  displayName: string;
  isConfigured(): boolean;
  fetchContent(queryOrId: string): Promise<NormalizedSocialContent>;
  fetchRelatedContent(contentId: string): Promise<NormalizedSocialContent[]>;
  fetchComments(contentId: string, limit?: number): Promise<Array<{ id: string; author_pseudonym: string; text: string; timestamp: string; likes: number; language?: string }>>;
  fetchEngagement(contentId: string): Promise<{ views: number; likes: number; shares: number; comments: number; velocity: string }>;
  fetchMetadata(contentId: string): Promise<{ source_url: string; original_timestamp: string; c2pa_headers: boolean; raw_headers_hash: string }>;
  testConnection(): Promise<{ connected: boolean; message: string; mode: 'CONNECTED' | 'UNAVAILABLE' | 'NOT_CONFIGURED' }>;
  getStatus(): ConnectorStatus;
}
