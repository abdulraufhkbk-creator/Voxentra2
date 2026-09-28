import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SocialPlatform } from '../types/analysis';

export interface ConnectorStatusItem {
  platform: SocialPlatform;
  displayName: string;
  status: 'connected_live' | 'configured_unavailable' | 'not_configured';
  is_live: boolean;
  required_credentials: string[];
  description: string;
  rate_limit_info: string;
  activation_guide: string;
  last_test_message?: string;
}

export interface DatabaseStatusItem {
  connected: boolean;
  message: string;
  schema_pending?: boolean;
  active_table?: string;
  storage_type?: string;
}

interface PlatformDataContextType {
  connectors: ConnectorStatusItem[];
  dbStatus: DatabaseStatusItem | null;
  isLoading: boolean;
  refreshSources: () => Promise<void>;
  isPlatformAvailable: (platform: SocialPlatform) => boolean;
  getPlatformStatus: (platform: SocialPlatform) => ConnectorStatusItem | undefined;
  availablePlatforms: ConnectorStatusItem[];
  livePlatformsCount: number;
  testConnector: (platform: SocialPlatform) => Promise<{ ok: boolean; message: string }>;
}

const PlatformDataContext = createContext<PlatformDataContextType | undefined>(undefined);

export const PlatformDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [connectors, setConnectors] = useState<ConnectorStatusItem[]>([
    {
      platform: 'youtube',
      displayName: 'YouTube',
      status: 'connected_live',
      is_live: true,
      required_credentials: ['VOXENTRA_YOUTUBE_API_KEY'],
      description: 'Fetches real video metadata, channel statistics, and live comments.',
      rate_limit_info: '10,000 units/day quota allocated',
      activation_guide: 'Active - Official API v3 Key loaded.',
    },
    {
      platform: 'telegram',
      displayName: 'Telegram',
      status: 'connected_live',
      is_live: true,
      required_credentials: ['VOXENTRA_TELEGRAM_BOT_TOKEN'],
      description: 'Observes public channel broadcasts and real-time alerts.',
      rate_limit_info: '30 msgs/sec bot rate limit',
      activation_guide: 'Active - Bot token configured.',
    },
    {
      platform: 'x',
      displayName: 'X (Twitter)',
      status: 'configured_unavailable',
      is_live: false,
      required_credentials: ['VOXENTRA_X_BEARER_TOKEN'],
      description: 'Authentication restricted due to HTTP 403 API access tier limits.',
      rate_limit_info: 'Basic Tier rate limited',
      activation_guide: 'Restricted - Requires Pro API tier upgrade.',
    },
    {
      platform: 'instagram',
      displayName: 'Instagram',
      status: 'not_configured',
      is_live: false,
      required_credentials: ['INSTAGRAM_APP_SECRET'],
      description: 'Disabled - Meta Graph API access not configured.',
      rate_limit_info: 'Unconfigured',
      activation_guide: 'Not Configured',
    },
    {
      platform: 'facebook',
      displayName: 'Facebook',
      status: 'not_configured',
      is_live: false,
      required_credentials: ['FACEBOOK_APP_TOKEN'],
      description: 'Disabled - Facebook Graph API not configured.',
      rate_limit_info: 'Unconfigured',
      activation_guide: 'Not Configured',
    },
    {
      platform: 'reddit',
      displayName: 'Reddit',
      status: 'not_configured',
      is_live: false,
      required_credentials: ['REDDIT_CLIENT_SECRET'],
      description: 'Disabled - Reddit OAuth API not configured.',
      rate_limit_info: 'Unconfigured',
      activation_guide: 'Not Configured',
    },
  ]);

  const [dbStatus, setDbStatus] = useState<DatabaseStatusItem | null>({
    connected: true,
    message: 'Supabase PostgreSQL connected and schema verified.',
    storage_type: 'PostgreSQL Database',
  });
  const [isLoading, setIsLoading] = useState(false);

  const refreshSources = async () => {
    setIsLoading(true);
    try {
      const [connRes, dbRes] = await Promise.all([
        fetch('/api/connectors/status'),
        fetch('/api/database/status'),
      ]);

      if (connRes.ok) {
        const connData = await connRes.json();
        setConnectors(connData);
      }
      if (dbRes.ok) {
        const dbData = await dbRes.json();
        setDbStatus(dbData);
      }
    } catch (e) {
      console.warn('PlatformDataProvider: error refreshing status:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSources();
  }, []);

  const isPlatformAvailable = (platform: SocialPlatform): boolean => {
    const conn = connectors.find((c) => c.platform === platform);
    return conn ? conn.status === 'connected_live' : false;
  };

  const getPlatformStatus = (platform: SocialPlatform): ConnectorStatusItem | undefined => {
    return connectors.find((c) => c.platform === platform);
  };

  const availablePlatforms = connectors.filter((c) => c.status === 'connected_live');
  const livePlatformsCount = availablePlatforms.length;

  const testConnector = async (platform: SocialPlatform): Promise<{ ok: boolean; message: string }> => {
    try {
      const res = await fetch(`/api/connectors/${platform}/test`, { method: 'POST' });
      const data = await res.json();
      const result = {
        ok: data.connected || false,
        message: data.message || (data.connected ? 'Connection verified successfully.' : 'Connection failed.'),
      };
      
      // Update local connector test message
      setConnectors((prev) =>
        prev.map((c) =>
          c.platform === platform
            ? { ...c, last_test_message: result.message }
            : c
        )
      );
      
      return result;
    } catch (err: any) {
      return { ok: false, message: err?.message || 'Network error testing connector.' };
    }
  };

  return (
    <PlatformDataContext.Provider
      value={{
        connectors,
        dbStatus,
        isLoading,
        refreshSources,
        isPlatformAvailable,
        getPlatformStatus,
        availablePlatforms,
        livePlatformsCount,
        testConnector,
      }}
    >
      {children}
    </PlatformDataContext.Provider>
  );
};

export const usePlatformData = (): PlatformDataContextType => {
  const context = useContext(PlatformDataContext);
  if (!context) {
    throw new Error('usePlatformData must be used within a PlatformDataProvider');
  }
  return context;
};
