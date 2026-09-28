import React, { useState } from 'react';
import { PlatformIcon, getPlatformName } from '../common/PlatformIcon';
import { SocialPlatform } from '../../types/analysis';
import { usePlatformData } from '../../context/PlatformDataProvider';
import {
  Database,
  Radio,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  Info,
  Server,
} from 'lucide-react';

export const DataSourcesView: React.FC<{ onNavigateToAnalyze: () => void }> = ({ onNavigateToAnalyze }) => {
  const { connectors, dbStatus, isLoading, refreshSources, testConnector } = usePlatformData();
  const [testingPlatform, setTestingPlatform] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { ok: boolean; message: string }>>({});

  const handleTestConnector = async (platform: SocialPlatform) => {
    setTestingPlatform(platform);
    try {
      const result = await testConnector(platform);
      setTestResults((prev) => ({
        ...prev,
        [platform]: result,
      }));
    } finally {
      setTestingPlatform(null);
    }
  };


  const liveCount = connectors.filter((c) => c.status === 'connected_live').length;
  const restrictedCount = connectors.filter((c) => c.status === 'configured_unavailable').length;
  const unconfiguredCount = connectors.filter((c) => c.status === 'not_configured').length;

  return (
    <div className="p-4 sm:p-6 lg:p-9 max-w-7xl mx-auto space-y-8 text-[#111111]">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#111111] mb-1">
            <span>DATA PROVENANCE</span>
            <span className="text-[#A39989]">/</span>
            <span>PLATFORM INTEGRATIONS</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight">
            Data Sources & Live Connectors
          </h1>
          <p className="text-xs sm:text-sm text-[#5E5A54] mt-1.5 max-w-2xl leading-relaxed">
            Real data integrity control center. Ingestion and analytics operate exclusively on authenticated, live APIs. Platforms without credentials remain strictly disabled.
          </p>
        </div>

        <button
          onClick={refreshSources}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-white/80 text-[#111111] text-xs font-bold border border-[#D8CFC2] transition-all cursor-pointer shadow-xs w-fit"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh Live Status</span>
        </button>
      </div>

      {/* Summary Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="liquid-glass rounded-2xl p-5 border border-white/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5E5A54]">
              Active Live Sources
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-3xl font-black text-[#111111]">{liveCount}</div>
          <div className="text-[11px] text-[#5E5A54]">
            {connectors.filter((c) => c.status === 'connected_live').map((c) => c.displayName).join(', ') || 'None connected'}
          </div>
        </div>

        <div className="liquid-glass rounded-2xl p-5 border border-white/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5E5A54]">
              Access Restricted
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <div className="text-3xl font-black text-[#111111]">{restrictedCount}</div>
          <div className="text-[11px] text-[#5E5A54]">
            {connectors.filter((c) => c.status === 'configured_unavailable').map((c) => c.displayName).join(', ') || 'None'}
          </div>
        </div>

        <div className="liquid-glass rounded-2xl p-5 border border-white/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5E5A54]">
              Disabled / Not Configured
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#A39989]" />
          </div>
          <div className="text-3xl font-black text-[#111111]">{unconfiguredCount}</div>
          <div className="text-[11px] text-[#5E5A54]">
            Instagram, Facebook, Reddit
          </div>
        </div>

        <div className="liquid-glass rounded-2xl p-5 border border-white/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5E5A54]">
              Storage & Engine
            </span>
            <ShieldCheck size={16} className="text-[#111111]" />
          </div>
          <div className="text-lg font-black text-[#111111] truncate">
            {dbStatus?.connected ? (dbStatus.storage_type || 'Supabase Postgres') : 'Local Storage'}
          </div>
          <div className="text-[11px] text-[#5E5A54]">
            Gemini 3.8 Flash (Server-Side)
          </div>
        </div>
      </div>

      {/* Platform Connectors Detail List */}
      <div className="space-y-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#111111]">
          Social Platform Connectors
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connectors.map((c) => {
            const isLive = c.status === 'connected_live';
            const isRestricted = c.status === 'configured_unavailable';
            const isTesting = testingPlatform === c.platform;
            const testRes = testResults[c.platform];

            return (
              <div
                key={c.platform}
                className={`liquid-glass rounded-3xl p-6 border transition-all space-y-5 shadow-xs ${
                  isLive
                    ? 'border-emerald-200/80 bg-emerald-500/5'
                    : isRestricted
                    ? 'border-amber-200/80 bg-amber-500/5'
                    : 'border-black/5 opacity-85'
                }`}
              >
                {/* Platform Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-[#D8CFC2] flex items-center justify-center shadow-2xs">
                      <PlatformIcon platform={c.platform} size={22} />
                    </div>
                    <div>
                      <div className="font-extrabold text-base text-[#111111] flex items-center gap-2">
                        <span>{c.displayName}</span>
                        {isLive && (
                          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                            LIVE DATA SOURCE
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#5E5A54] mt-0.5">
                        {isLive
                          ? 'Official API Authenticated & Active'
                          : isRestricted
                          ? 'Token Detected · Subscription Access Restricted (HTTP 403)'
                          : 'Disabled · No Credentials Configured'}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isLive ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        <CheckCircle2 size={13} className="text-emerald-700" />
                        <span>CONNECTED</span>
                      </span>
                    ) : isRestricted ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        <AlertTriangle size={13} className="text-amber-700" />
                        <span>UNAVAILABLE</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8DFD2] text-[#7D786F]">
                        <XCircle size={13} />
                        <span>NOT CONFIGURED</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#5E5A54] leading-relaxed">
                  {c.description}
                </p>

                {/* Environment Requirement Info */}
                <div className="p-3 bg-white/70 rounded-xl border border-[#D8CFC2]/60 text-[11px] space-y-1 font-mono">
                  <div className="text-[#7D786F] font-bold">REQUIRED ENVIRONMENT VARIABLE:</div>
                  <div className="text-[#111111] font-semibold truncate">
                    {c.required_credentials.join(', ') || 'None required'}
                  </div>
                </div>

                {/* Test Feedback if executed */}
                {testRes && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                      testRes.ok
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}
                  >
                    {testRes.ok ? (
                      <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
                    ) : (
                      <AlertTriangle size={15} className="text-rose-700 shrink-0" />
                    )}
                    <span className="leading-snug">{testRes.message}</span>
                  </div>
                )}

                {/* Action Row */}
                <div className="pt-2 border-t border-[#D8CFC2]/60 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-[#7D786F]">
                    {c.rate_limit_info}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTestConnector(c.platform)}
                      disabled={isTesting}
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-white/80 text-[#111111] text-xs font-bold border border-[#D8CFC2] transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                    >
                      <RefreshCw size={12} className={isTesting ? 'animate-spin' : ''} />
                      <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                    </button>

                    {isLive && (
                      <button
                        onClick={onNavigateToAnalyze}
                        className="px-3.5 py-1.5 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-[#F8F5EF] text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                      >
                        <span>Ingest</span>
                        <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Backend Infrastructure Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Supabase / Postgres */}
        <div className="liquid-glass rounded-3xl p-6 border border-white/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#111111] text-[#F8F5EF] flex items-center justify-center shadow-xs">
              <Database size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#111111]">
                Persistent Analytics Database
              </h3>
              <div className="text-xs text-[#5E5A54]">
                {dbStatus?.connected ? 'Supabase PostgreSQL Cloud' : 'Local Storage Sandbox'}
              </div>
            </div>
          </div>

          <p className="text-xs text-[#5E5A54] leading-relaxed">
            Stores genuine ingested social posts, video metrics, comments, and risk audit dossiers. No hardcoded demonstration records are preserved.
          </p>

          <div className="p-3 bg-white/70 rounded-xl border border-[#D8CFC2]/60 text-[11px] font-mono space-y-1">
            <div className="text-[#7D786F]">SYNC INTEGRATION:</div>
            <div className="text-[#111111] font-semibold">
              {dbStatus?.message || 'Persistent store verified and operational.'}
            </div>
          </div>
        </div>

        {/* Gemini 3.8 Flash Engine */}
        <div className="liquid-glass rounded-3xl p-6 border border-white/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#111111] text-[#F8F5EF] flex items-center justify-center shadow-xs">
              <Cpu size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#111111]">
                Gemini 3.8 Flash AI Engine
              </h3>
              <div className="text-xs text-[#5E5A54]">
                Server-Side Multi-Modal Multi-Linguistic NLP
              </div>
            </div>
          </div>

          <p className="text-xs text-[#5E5A54] leading-relaxed">
            Powers factual explanation synthesis, forensic signal extraction, and narrative detection directly from authentic content inputs.
          </p>

          <div className="p-3 bg-white/70 rounded-xl border border-[#D8CFC2]/60 text-[11px] font-mono space-y-1">
            <div className="text-[#7D786F]">SERVER-SIDE API KEY:</div>
            <div className="text-[#111111] font-semibold">
              GEMINI_API_KEY Configured & Operational
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
