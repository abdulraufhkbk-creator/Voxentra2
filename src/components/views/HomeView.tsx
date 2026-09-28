import React from 'react';
import { AnalysisResult, AnalysisScenario, RiskLevel } from '../../types/analysis';
import { SEEDED_SCENARIOS } from '../../data/seedScenarios';
import { RiskBadge } from '../common/RiskBadge';
import { PlatformIcon } from '../common/PlatformIcon';
import { DataSourceIndicator } from '../common/DataSourceIndicator';
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
} from 'lucide-react';
import { NavItemKey } from '../layout/Sidebar';

interface HomeViewProps {
  currentAnalysis: AnalysisResult;
  historyList: Array<{ id: string; title: string; platform: string; risk_level: RiskLevel; timestamp: string; views: number }>;
  onSelectScenario: (scenario: AnalysisScenario) => void;
  onSelectHistoryItem: (id: string) => void;
  onNavigate: (tab: NavItemKey) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentAnalysis,
  historyList,
  onSelectScenario,
  onSelectHistoryItem,
  onNavigate,
}) => {
  return (
    <div className="p-4 sm:p-6 lg:p-9 max-w-7xl mx-auto space-y-8">
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden rounded-3xl p-7 sm:p-10 lg:p-12 liquid-glass border border-white/80 shadow-sm">
        {/* Ambient subtle light glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#E8DFD2]/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/40 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-3xl space-y-5 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#111111]">
              VOXENTRA INTELLIGENCE
            </span>
            <span className="text-[#A39989] font-mono">/</span>
            <span className="text-xs font-semibold text-[#5E5A54]">
              Continuous Multi-Platform Observation
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#111111] leading-[1.08]">
            What’s happening online?
          </h1>

          <p className="text-base sm:text-lg text-[#5E5A54] leading-relaxed max-w-2xl font-normal">
            Analyze social content, understand the conversation, and see how information spreads across platforms with forensic provenance and aggregate audience intelligence.
          </p>

          {/* Primary CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => onNavigate('analyze')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#111111] hover:bg-[#2A2A2A] text-[#F8F5EF] font-bold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer hover:scale-[1.01]"
            >
              <Search size={16} />
              <span>Analyze Content</span>
            </button>

            <button
              onClick={() => onNavigate('creator-lens')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/80 hover:bg-white text-[#111111] font-bold text-sm border border-[#D8CFC2] transition-all cursor-pointer shadow-xs hover:border-[#111111]/40"
            >
              <Sparkles size={16} className="text-[#111111]" />
              <span>Creator Lens</span>
            </button>

            <button
              onClick={() => onNavigate('trends')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/60 hover:bg-white text-[#5E5A54] hover:text-[#111111] font-bold text-sm border border-[#D8CFC2] transition-all cursor-pointer shadow-xs"
            >
              <Hash size={16} className="text-[#7D786F]" />
              <span>Explore Topics</span>
            </button>
          </div>
        </div>

        {/* Real-Time Platform Status Bar */}
        <div className="mt-10 pt-6 border-t border-[#D8CFC2]/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-[#7D786F] text-[10px] font-bold uppercase tracking-wider mb-1">
              Live Verified Platforms
            </div>
            <div className="flex items-center gap-1.5 text-[#111111] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#111111] animate-pulse" />
              <span>X · YouTube · Telegram</span>
            </div>
          </div>
          <div>
            <div className="text-[#7D786F] text-[10px] font-bold uppercase tracking-wider mb-1">
              Seeded Demo Feeds
            </div>
            <div className="flex items-center gap-1.5 text-[#5E5A54] font-semibold">
              <span>Instagram · Facebook · Reddit</span>
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
              Authenticity Engine
            </div>
            <div className="text-[#111111] font-bold">
              C2PA & Perceptual Hash
            </div>
          </div>
        </div>
      </section>

      {/* Featured Example Analyses (The 3 Curated Scenarios) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-[#111111] tracking-tight">
              Curated Intelligence Scenarios
            </h2>
            <p className="text-xs text-[#5E5A54] mt-0.5">
              Explore internally consistent test cases illustrating real disinformation vectors, organic trends, and archival manipulation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SEEDED_SCENARIOS.map((scenario) => {
            const isSelected = currentAnalysis.id === scenario.data.id;
            return (
              <div
                key={scenario.id}
                onClick={() => onSelectScenario(scenario)}
                className={`liquid-glass-card rounded-2xl p-6 flex flex-col justify-between cursor-pointer transition-all group ${
                  isSelected
                    ? 'ring-2 ring-[#111111] bg-white shadow-md'
                    : ''
                }`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PlatformIcon platform={scenario.platform} size={17} />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#5E5A54]">
                        {scenario.platform}
                      </span>
                    </div>
                    <RiskBadge level={scenario.risk_badge} size="sm" />
                  </div>

                  <h3 className="font-extrabold text-[#111111] text-base group-hover:opacity-80 transition-opacity line-clamp-2">
                    {scenario.title}
                  </h3>

                  <p className="text-xs text-[#5E5A54] leading-relaxed line-clamp-3">
                    {scenario.preview_text}
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-[#D8CFC2]/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-[#7D786F]">
                    {scenario.data.audience.sample_size.toLocaleString()} observations
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-[#111111] group-hover:translate-x-1 transition-transform">
                    <span>Inspect</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Active Focus Intelligence Snapshot */}
      <section className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-6 border border-white/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#D8CFC2]/60">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#5E5A54] uppercase tracking-wider mb-1">
              <span>ACTIVE INTELLIGENCE DOSSIER</span>
              <span>·</span>
              <PlatformIcon platform={currentAnalysis.target_platform} size={14} />
              <span className="font-bold">{currentAnalysis.target_platform}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
              {currentAnalysis.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <RiskBadge level={currentAnalysis.risk.risk_level} size="lg" />
            <DataSourceIndicator
              sourceType={currentAnalysis.data_source_type}
              aiEngine={currentAnalysis.ai_engine}
            />
          </div>
        </div>

        {/* Core questions answered directly in clean high-contrast cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white/80 border border-[#D8CFC2]/70 rounded-2xl p-5 space-y-2 shadow-xs">
            <div className="text-[11px] font-extrabold text-[#111111] uppercase tracking-wider">
              01. What is happening?
            </div>
            <p className="text-xs text-[#5E5A54] leading-relaxed">
              {currentAnalysis.answers.what_is_happening}
            </p>
          </div>

          <div className="bg-white/80 border border-[#D8CFC2]/70 rounded-2xl p-5 space-y-2 shadow-xs">
            <div className="text-[11px] font-extrabold text-[#111111] uppercase tracking-wider">
              02. Who is driving it?
            </div>
            <p className="text-xs text-[#5E5A54] leading-relaxed">
              {currentAnalysis.answers.who_is_driving_it}
            </p>
          </div>

          <div className="bg-white/80 border border-[#D8CFC2]/70 rounded-2xl p-5 space-y-2 shadow-xs">
            <div className="text-[11px] font-extrabold text-[#111111] uppercase tracking-wider">
              03. How is it spreading?
            </div>
            <p className="text-xs text-[#5E5A54] leading-relaxed">
              {currentAnalysis.answers.how_is_it_spreading}
            </p>
          </div>

          <div className="bg-white/80 border border-[#D8CFC2]/70 rounded-2xl p-5 space-y-2 shadow-xs">
            <div className="text-[11px] font-extrabold text-[#111111] uppercase tracking-wider">
              04. What are people feeling?
            </div>
            <p className="text-xs text-[#5E5A54] leading-relaxed">
              {currentAnalysis.answers.what_are_people_feeling}
            </p>
          </div>

          <div className="bg-white/80 border border-[#D8CFC2]/70 rounded-2xl p-5 space-y-2 shadow-xs md:col-span-2">
            <div className="text-[11px] font-extrabold text-[#111111] uppercase tracking-wider">
              05. What are the main narratives?
            </div>
            <p className="text-xs text-[#5E5A54] leading-relaxed">
              {currentAnalysis.answers.what_are_the_main_narratives}
            </p>
          </div>
        </div>

        {/* Navigation jump actions to deep intelligence areas */}
        <div className="pt-2 flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('risk')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#111111] bg-white/80 border border-[#D8CFC2] hover:bg-white transition-all shadow-xs cursor-pointer"
          >
            Review {currentAnalysis.risk.signals.length} Risk Signals & Evidence &rarr;
          </button>
          <button
            onClick={() => onNavigate('audience')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#111111] bg-white/80 border border-[#D8CFC2] hover:bg-white transition-all shadow-xs cursor-pointer"
          >
            Audience Demographics & Clusters &rarr;
          </button>
          <button
            onClick={() => onNavigate('network')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#111111] bg-white/80 border border-[#D8CFC2] hover:bg-white transition-all shadow-xs cursor-pointer"
          >
            Interactive Network Graph &rarr;
          </button>
          <button
            onClick={() => onNavigate('timeline')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#111111] bg-white/80 border border-[#D8CFC2] hover:bg-white transition-all shadow-xs cursor-pointer"
          >
            Chronological Timeline ({currentAnalysis.timeline.events.length} Events) &rarr;
          </button>
        </div>
      </section>

      {/* Recent Analyses and Trending Topics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Analyses Column */}
        <div className="lg:col-span-2 liquid-glass rounded-3xl p-6 sm:p-7 space-y-4 border border-white/80 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#D8CFC2]/60">
            <h3 className="font-extrabold text-[#111111] text-base">Recent Analysis History</h3>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-bold text-[#111111] hover:underline cursor-pointer"
            >
              View All ({historyList.length})
            </button>
          </div>

          <div className="divide-y divide-[#D8CFC2]/50">
            {historyList.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectHistoryItem(item.id)}
                className="py-3.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/60 px-3 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <PlatformIcon platform={item.platform} size={18} />
                  <div className="truncate">
                    <div className="text-xs font-bold text-[#111111] group-hover:opacity-80 transition-opacity truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-[#7D786F]">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {item.views.toLocaleString()} interactions
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <RiskBadge level={item.risk_level} size="sm" />
                  <ArrowRight size={14} className="text-[#A39989] group-hover:text-[#111111] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Keywords & Velocity */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-7 space-y-4 border border-white/80 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#D8CFC2]/60">
            <h3 className="font-extrabold text-[#111111] text-base">Observed Trends</h3>
            <span className="text-[11px] text-[#111111] font-mono font-bold bg-white/80 px-2 py-0.5 rounded-full border border-[#D8CFC2]">
              +{currentAnalysis.trends.acceleration_percentage}%
            </span>
          </div>

          <div className="space-y-2">
            {currentAnalysis.trends.viral_keywords.map((kw, i) => (
              <div
                key={i}
                className="bg-white/80 border border-[#D8CFC2]/60 p-3 rounded-xl flex items-center justify-between text-xs shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#7D786F] font-mono text-[10px]">#{i + 1}</span>
                  <span className="font-bold text-[#111111]">{kw.keyword}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#7D786F]">{kw.category}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E8DFD2] text-[#111111]">
                    {kw.trajectory.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('trends')}
            className="w-full mt-3 py-2.5 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-[#F8F5EF] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <TrendingUp size={14} />
            <span>Open Trend Acceleration Engine</span>
          </button>
        </div>
      </div>
    </div>
  );
};
