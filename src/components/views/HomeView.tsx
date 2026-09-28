import React from 'react';
import { AnalysisResult, RiskLevel } from '../../types/analysis';
import { RiskBadge } from '../common/RiskBadge';
import { PlatformIcon, getPlatformName } from '../common/PlatformIcon';
import { DataSourceIndicator } from '../common/DataSourceIndicator';
import { usePlatformData } from '../../context/PlatformDataProvider';
import {
  Search,
  Hash,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Eye,
  Radio,
  FileCheck2,
  Sparkles,
  Server,
  Share2,
  Clock,
  Layers,
  Database,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { NavItemKey } from '../layout/Sidebar';

interface HomeViewProps {
  currentAnalysis: AnalysisResult | null;
  historyList: Array<{ id: string; title: string; platform: string; risk_level: RiskLevel; timestamp: string; views: number; summary?: string }>;
  onSelectHistoryItem: (id: string) => void;
  onNavigate: (tab: NavItemKey) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentAnalysis,
  historyList,
  onSelectHistoryItem,
  onNavigate,
}) => {
  const { availablePlatforms, dbStatus } = usePlatformData();
  const liveNames = availablePlatforms.map((p) => p.displayName).join(' · ') || 'None';
  const totalViews = historyList.reduce((acc, curr) => acc + (curr.views || 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-9 max-w-7xl mx-auto space-y-8">
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden rounded-3xl p-7 sm:p-10 lg:p-12 liquid-glass border border-white/80 shadow-sm">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#E8DFD2]/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/40 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-3xl space-y-5 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#111111]">
              VOXENTRA PRODUCTION PLATFORM
            </span>
            <span className="text-[#A39989] font-mono">/</span>
            <span className="text-xs font-semibold text-[#5E5A54]">
              Authentic Social Intelligence & Provenance
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#111111] leading-[1.08]">
            What’s happening online?
          </h1>

          <p className="text-base sm:text-lg text-[#5E5A54] leading-relaxed max-w-2xl font-normal">
            Analyze live social content, inspect public video metrics, and audit information diffusion with cryptographic provenance and privacy-preserving aggregate signals.
          </p>

          {/* Primary CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => onNavigate('analyze')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#111111] hover:bg-[#2A2A2A] text-[#F8F5EF] font-bold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer hover:scale-[1.01]"
            >
              <Search size={16} />
              <span>Ingest & Analyze Content</span>
            </button>

            <button
              onClick={() => onNavigate('data-sources')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/80 hover:bg-white text-[#111111] font-bold text-sm border border-[#D8CFC2] transition-all cursor-pointer shadow-xs hover:border-[#111111]/40"
            >
              <Server size={16} className="text-[#111111]" />
              <span>Connected APIs</span>
            </button>

            <button
              onClick={() => onNavigate('creator-lens')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/60 hover:bg-white text-[#5E5A54] hover:text-[#111111] font-bold text-sm border border-[#D8CFC2] transition-all cursor-pointer shadow-xs"
            >
              <Sparkles size={16} className="text-[#7D786F]" />
              <span>Creator Lens</span>
            </button>
          </div>
        </div>

        {/* Real-Time Platform Status Bar */}
        <div className="mt-10 pt-6 border-t border-[#D8CFC2]/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-[#7D786F] text-[10px] font-bold uppercase tracking-wider mb-1">
              Active Live APIs
            </div>
            <div className="flex items-center gap-1.5 text-[#111111] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{liveNames}</span>
            </div>
          </div>
          <div>
            <div className="text-[#7D786F] text-[10px] font-bold uppercase tracking-wider mb-1">
              Analyzed Records
            </div>
            <div className="flex items-center gap-1.5 text-[#111111] font-bold">
              <span>{historyList.length} Ingested Dossiers</span>
            </div>
          </div>
          <div>
            <div className="text-[#7D786F] text-[10px] font-bold uppercase tracking-wider mb-1">
              Privacy Standard
            </div>
            <div className="flex items-center gap-1.5 text-[#111111] font-bold">
              <ShieldCheck size={14} className="text-[#111111]" />
              <span>k-Anonymity (k≥50)</span>
            </div>
          </div>
          <div>
            <div className="text-[#7D786F] text-[10px] font-bold uppercase tracking-wider mb-1">
              AI Reasoning Engine
            </div>
            <div className="text-[#111111] font-bold truncate">
              Gemini 3.8 Flash (Server-Side)
            </div>
          </div>
        </div>
      </section>

      {/* Active Focus Dossier (If loaded) */}
      {currentAnalysis ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#7D786F]">
                CURRENT ACTIVE DOSSIER
              </div>
              <h2 className="text-xl font-black text-[#111111] tracking-tight">
                {currentAnalysis.title}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <RiskBadge level={currentAnalysis.risk.risk_level} size="md" />
              <DataSourceIndicator
                sourceType={currentAnalysis.data_source_type}
                aiEngine={currentAnalysis.ai_engine}
              />
            </div>
          </div>

          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/80 shadow-xs space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Executive Summary */}
              <div className="md:col-span-2 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-[#5E5A54]">
                  Key Findings & Strategic Overview
                </div>
                <p className="text-sm text-[#111111] font-medium leading-relaxed">
                  {currentAnalysis.answers.what_is_happening}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-white/70 rounded-xl border border-[#D8CFC2]/60">
                    <span className="text-[10px] text-[#7D786F] font-bold uppercase block mb-0.5">Platform</span>
                    <span className="font-extrabold text-[#111111] uppercase">{currentAnalysis.target_platform}</span>
                  </div>
                  <div className="p-3 bg-white/70 rounded-xl border border-[#D8CFC2]/60">
                    <span className="text-[10px] text-[#7D786F] font-bold uppercase block mb-0.5">Observed Views</span>
                    <span className="font-extrabold text-[#111111]">{currentAnalysis.content.engagement.views.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-white/70 rounded-xl border border-[#D8CFC2]/60">
                    <span className="text-[10px] text-[#7D786F] font-bold uppercase block mb-0.5">Sentiment Ratio</span>
                    <span className="font-extrabold text-emerald-700">{currentAnalysis.sentiment.overall.positive}% Pos</span>
                  </div>
                </div>
              </div>

              {/* Forensic Signal Snapshot */}
              <div className="space-y-3 bg-white/60 p-4 rounded-2xl border border-[#D8CFC2]/60">
                <div className="text-xs font-bold uppercase tracking-wider text-[#5E5A54] flex items-center justify-between">
                  <span>Forensic Audit</span>
                  <span className="font-mono text-[10px] text-[#7D786F]">{currentAnalysis.risk.signals.length} Signals</span>
                </div>
                <div className="space-y-2">
                  {currentAnalysis.risk.signals.slice(0, 2).map((sig) => (
                    <div key={sig.id} className="text-xs p-2.5 rounded-xl bg-white border border-[#D8CFC2]/60 space-y-1">
                      <div className="font-extrabold text-[#111111] flex items-center justify-between">
                        <span className="truncate">{sig.title}</span>
                        <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-[#FAF7F2] border border-[#D8CFC2]">
                          {sig.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5E5A54] line-clamp-2">{sig.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Deep Dive Links */}
            <div className="pt-4 border-t border-[#D8CFC2]/60 flex flex-wrap items-center gap-2">
              <button
                onClick={() => onNavigate('audience')}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-white/90 text-[#111111] text-xs font-bold border border-[#D8CFC2] transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <span>Audience Demographics</span>
                <ArrowRight size={12} />
              </button>
              <button
                onClick={() => onNavigate('trends')}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-white/90 text-[#111111] text-xs font-bold border border-[#D8CFC2] transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <span>Trends & Narratives</span>
                <ArrowRight size={12} />
              </button>
              <button
                onClick={() => onNavigate('network')}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-white/90 text-[#111111] text-xs font-bold border border-[#D8CFC2] transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <span>Network Graph</span>
                <ArrowRight size={12} />
              </button>
              <button
                onClick={() => onNavigate('creator-lens')}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-white/90 text-[#111111] text-xs font-bold border border-[#D8CFC2] transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <span>Creator Intelligence</span>
                <ArrowRight size={12} />
              </button>
              <button
                onClick={() => onNavigate('reports')}
                className="px-3.5 py-2 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-[#F8F5EF] text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 ml-auto"
              >
                <FileText size={12} />
                <span>Export Dossier</span>
              </button>
            </div>
          </div>
        </section>
      ) : (
        <div className="liquid-glass rounded-3xl p-8 border border-white/80 shadow-xs text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#111111] text-[#F8F5EF] flex items-center justify-center mx-auto shadow-sm">
            <Search size={22} />
          </div>
          <h3 className="font-extrabold text-lg text-[#111111]">
            No Active Analysis Loaded
          </h3>
          <p className="text-xs text-[#5E5A54] max-w-md mx-auto leading-relaxed">
            Ingest live video data from YouTube or analyze custom social text to generate real-time audience breakdowns, forensic risk signals, and narrative diffusion maps.
          </p>
          <button
            onClick={() => onNavigate('analyze')}
            className="px-6 py-2.5 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-[#F8F5EF] text-xs font-extrabold transition-all cursor-pointer shadow-sm inline-flex items-center gap-2"
          >
            <Search size={14} />
            <span>Start Live Analysis</span>
          </button>
        </div>
      )}

      {/* Real Ingestion History */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-[#111111] tracking-tight">
              Ingested Intelligence History
            </h2>
            <p className="text-xs text-[#5E5A54] mt-0.5">
              Persistent record of all authentic social content audited through Voxentra.
            </p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-bold text-[#111111] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>View All ({historyList.length})</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {historyList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {historyList.slice(0, 6).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectHistoryItem(item.id)}
                className="liquid-glass rounded-2xl p-5 border border-white/80 shadow-xs hover:border-[#111111]/30 transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PlatformIcon platform={item.platform as any} size={16} />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#5E5A54]">
                      {item.platform}
                    </span>
                  </div>
                  <RiskBadge level={item.risk_level} size="sm" />
                </div>

                <div className="font-extrabold text-xs text-[#111111] line-clamp-2 group-hover:text-black">
                  {item.title}
                </div>

                {item.summary && (
                  <p className="text-[11px] text-[#5E5A54] line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                )}

                <div className="pt-2 border-t border-[#D8CFC2]/60 flex items-center justify-between text-[10px] text-[#7D786F] font-mono">
                  <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  <span>{item.views > 0 ? `${item.views.toLocaleString()} views` : 'Live Analysis'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="liquid-glass rounded-2xl p-6 border border-white/80 shadow-xs text-center text-xs text-[#5E5A54]">
            No previous records found in persistent storage. Run an analysis above to save intelligence dossiers.
          </div>
        )}
      </section>
    </div>
  );
};
