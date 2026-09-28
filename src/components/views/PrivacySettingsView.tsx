import React, { useState, useEffect } from 'react';
import { ConnectorStatus } from '../../server/connectors/types';
import { PlatformIcon, getPlatformName } from '../common/PlatformIcon';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  Radio,
  Key,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Server,
  Layers,
} from 'lucide-react';

export const PrivacySettingsView: React.FC = () => {
  const [connectors, setConnectors] = useState<ConnectorStatus[]>([]);
  const [testingPlatform, setTestingPlatform] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ platform: string; message: string; connected: boolean } | null>(null);
  const [dbStatus, setDbStatus] = useState<{ type: string; supabase_configured: boolean; connected: boolean; message: string; schema_pending?: boolean } | null>(null);
  const [isTestingDb, setIsTestingDb] = useState(false);

  useEffect(() => {
    fetchConnectors();
    fetchDbStatus();
  }, []);

  const fetchConnectors = async () => {
    try {
      const res = await fetch('/api/connectors/status');
      if (res.ok) {
        const data = await res.json();
        setConnectors(data);
      }
    } catch (e) {
      console.warn('Failed to load connector statuses:', e);
    }
  };

  const fetchDbStatus = async () => {
    try {
      const res = await fetch('/api/database/status');
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      }
    } catch (e) {
      console.warn('Failed to load database status:', e);
    }
  };

  const handleTestConnection = async (platform: string) => {
    setTestingPlatform(platform);
    setTestResult(null);
    try {
      const res = await fetch(`/api/connectors/${platform}/test`, { method: 'POST' });
      const data = await res.json();
      setTestResult({
        platform,
        message: data.message,
        connected: data.connected,
      });
      fetchConnectors();
    } catch (e: any) {
      setTestResult({
        platform,
        message: 'Could not connect to testing endpoint.',
        connected: false,
      });
    } finally {
      setTestingPlatform(null);
    }
  };

  const handleTestDatabase = async () => {
    setIsTestingDb(true);
    try {
      const res = await fetch('/api/database/test', { method: 'POST' });
      const data = await res.json();
      setDbStatus((prev) => (prev ? { ...prev, connected: data.connected, message: data.message, schema_pending: data.schema_pending } : null));
    } catch (e) {
      console.warn(e);
    } finally {
      setIsTestingDb(false);
    }
  };

  const liveConnectors = connectors.filter((c) => !c.is_demo_only);
  const demoConnectors = connectors.filter((c) => c.is_demo_only);

  return (
    <div className="p-4 sm:p-6 lg:p-9 max-w-7xl mx-auto space-y-8 text-[#111111]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#111111] mb-1">
          <span>GOVERNANCE & TRUST</span>
          <span className="text-[#A39989]">/</span>
          <span>ANALYZE CONTENT, NOT PERSONS</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight">
          Privacy Center & Integrations
        </h1>
        <p className="text-xs sm:text-sm text-[#5E5A54] mt-1.5 max-w-2xl leading-relaxed">
          Voxentra enforces strict zero-telemetry architectures. We audit public content and social propagation patterns without harvesting private communications, passwords, or personal identities.
        </p>
      </div>

      {/* Database Status Card: Supabase PostgreSQL */}
      <section className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4 border border-white/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#111111] text-[#F8F5EF] flex items-center justify-center">
              <Server size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111111]">
                Database & Persistence Engine
              </h2>
              <p className="text-xs text-[#5E5A54]">
                Persistent layer for analyses, reports, topic clusters, and risk signals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestDatabase}
              disabled={isTestingDb}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#D8CFC2] hover:bg-[#F3EEE7] text-[#111111] text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              {isTestingDb ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
        </div>

        <div className="bg-white/80 border border-[#D8CFC2] rounded-2xl p-4 text-xs space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[#5E5A54]">Database Engine:</span>
            <span
              className={`font-semibold px-2.5 py-0.5 rounded-full text-[11px] ${
                dbStatus?.supabase_configured
                  ? 'bg-[#111111] text-[#F8F5EF]'
                  : 'bg-[#FAF3E8] text-[#845318] border border-[#9A6B2F]/30'
              }`}
            >
              {dbStatus?.supabase_configured ? 'SUPABASE POSTGRESQL' : 'LOCAL PERSISTENT STORE (data/voxentra_store.json)'}
            </span>
          </div>

          <div className="text-[#3A3834] leading-relaxed pt-1">
            {dbStatus?.message || 'Checking database configuration...'}
          </div>

          <div className="text-[11px] text-[#7D786F] pt-1">
            Credentials configured securely on server: <code className="text-[#111111] font-mono font-semibold">SUPABASE_URL</code> & <code className="text-[#111111] font-mono font-semibold">SUPABASE_SECRET_KEY</code>.
          </div>
        </div>
      </section>

      {/* Active Live Platform Connectors (X, YouTube, Telegram) */}
      <section className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-6 border border-white/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <Radio size={18} className="text-[#111111]" />
              <span>Live Platform Integrations (X, YouTube, Telegram)</span>
            </h2>
            <p className="text-xs text-[#5E5A54] mt-0.5">
              Connectors equipped with real API ingestion logic using server-side credentials.
            </p>
          </div>

          <button
            onClick={fetchConnectors}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D8CFC2] hover:bg-[#F3EEE7] text-[#111111] text-xs font-semibold cursor-pointer w-fit shadow-2xs"
          >
            <RefreshCw size={13} />
            <span>Refresh Status</span>
          </button>
        </div>

        {/* Test Result Toast */}
        {testResult && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
              testResult.connected
                ? 'bg-[#FAF3E8] border-emerald-500/30 text-[#111111]'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {testResult.connected ? (
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
            )}
            <span>
              <strong>{getPlatformName(testResult.platform)}:</strong> {testResult.message}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {liveConnectors.map((conn) => (
            <div
              key={conn.platform}
              className="bg-white/90 border border-[#D8CFC2] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-2xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PlatformIcon platform={conn.platform} size={18} />
                    <span className="font-bold text-[#111111] text-sm">
                      {conn.displayName}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      conn.is_live
                        ? 'bg-[#111111] text-[#F8F5EF]'
                        : 'bg-[#FAF3E8] text-[#845318] border border-[#9A6B2F]/30'
                    }`}
                  >
                    {conn.is_live ? 'CONNECTED LIVE' : 'SEEDED FALLBACK ACTIVE'}
                  </span>
                </div>

                <p className="text-xs text-[#5E5A54] leading-relaxed">
                  {conn.description}
                </p>

                <div className="pt-2 text-[11px] space-y-1">
                  <div className="text-[#7D786F] font-semibold uppercase text-[10px]">
                    Environment Secret:
                  </div>
                  <div className="font-mono text-[#111111] text-[10px]">
                    {conn.required_credentials.join(', ')}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#D8CFC2]/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#7D786F] font-mono">
                  {conn.rate_limit_info}
                </span>

                <button
                  disabled={testingPlatform === conn.platform}
                  onClick={() => handleTestConnection(conn.platform)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#D8CFC2] hover:bg-[#F3EEE7] text-[#111111] font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
                >
                  {testingPlatform === conn.platform ? 'Testing...' : 'Test Link'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo / Seeded Datasets (Instagram, Facebook, Reddit) */}
      <section className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4 border border-white/80 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
            <Database size={18} className="text-[#111111]" />
            <span>Demo / Seeded Datasets (Instagram, Facebook, Reddit)</span>
          </h2>
          <p className="text-xs text-[#5E5A54] mt-0.5">
            Configured in realistic Demo Dataset mode. No API credentials required, zero broken endpoints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demoConnectors.map((conn) => (
            <div
              key={conn.platform}
              className="bg-white/90 border border-[#D8CFC2] rounded-2xl p-5 space-y-3 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PlatformIcon platform={conn.platform} size={18} />
                  <span className="font-bold text-[#111111] text-sm">
                    {conn.displayName}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#D8CFC2] text-[#5E5A54]">
                  DEMO MODE
                </span>
              </div>

              <p className="text-xs text-[#5E5A54] leading-relaxed">
                {conn.description}
              </p>

              <div className="pt-2 border-t border-[#D8CFC2]/60 text-[11px] text-[#7D786F]">
                Seeded multi-platform test scenarios active. Direct API integration disabled per user preference.
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data Ingestion Transparency Matrix */}
      <section className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-6 border border-white/80 shadow-sm">
        <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-700" />
          <span>Data Ingestion Transparency Matrix</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data Analyzed Box */}
          <div className="bg-white/90 border border-emerald-500/30 rounded-2xl p-5 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Data Analyzed (Public Context Only)</span>
            </div>
            <ul className="space-y-2 text-xs text-[#3A3834]">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Publicly visible post text, captions, and hashtags</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Public engagement metrics (views, repost counts, comment volume)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Optical pixel noise gradients and acoustic spectral waterfall hashes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Cryptographic C2PA metadata manifests and public source archives</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Macro regional binning (North, South, East, West India)</span>
              </li>
            </ul>
          </div>

          {/* Data NOT Analyzed Box */}
          <div className="bg-white/90 border border-rose-500/20 rounded-2xl p-5 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-800">
              <EyeOff size={16} className="text-rose-600" />
              <span>Data STRICTLY NEVER Collected</span>
            </div>
            <ul className="space-y-2 text-xs text-[#3A3834]">
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Zero user passwords, credentials, or session cookies</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Zero private chats, direct messages (DMs), or closed groups</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Zero unrelated browser tabs, keystrokes, or personal history</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Zero individual user tracking, phone numbers, or Aadhaar identity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Zero biometric facial databases or facial identification stores</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
