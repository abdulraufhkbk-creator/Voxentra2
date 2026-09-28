import React, { useState } from 'react';
import { AnalysisResult, SocialPlatform } from '../../types/analysis';
import { PlatformIcon, getPlatformName } from '../common/PlatformIcon';
import { RiskBadge } from '../common/RiskBadge';
import {
  Chrome,
  Download,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Info,
  Radio,
  FileCode,
  Sparkles,
  Layers,
} from 'lucide-react';

interface CompanionSimulatorViewProps {
  onLoadSimulatedAnalysis: (result: AnalysisResult) => void;
}

const SIMULATED_POSTS = [
  {
    id: 'post-1',
    platform: 'instagram' as SocialPlatform,
    author: '@trending_updates_now',
    time: '2 hours ago',
    text: '🚨 BREAKING: Midnight cabinet gazette notification declares 100% immediate cancellation of all college student debt. Claim portal link in bio!',
    engagement: '1.4M views · 98.4K likes · 14.2K comments',
    hasMedia: true,
    scenarioIndex: 0,
  },
  {
    id: 'post-2',
    platform: 'x' as SocialPlatform,
    author: '@IndicComputeConsortium',
    time: '4 hours ago',
    text: '🚀 Proud to announce BhashaTech-7B: An open-weights foundation model trained on 22 Indian constitutional languages with verified cultural context. Weights live on HuggingFace! #BhashaTech',
    engagement: '2.4M views · 184K likes · 48.9K reposts',
    hasMedia: true,
    scenarioIndex: 1,
  },
  {
    id: 'post-3',
    platform: 'telegram' as SocialPlatform,
    author: '🚨 Local Emergency Alert Broadcast',
    time: '18 mins ago',
    text: '⚠️ URGENT RED ALERT! Sector 4 Metro viaduct suffered structural collapse during heavy morning showers! Over 15 cars trapped. Rescue halted. DO NOT GO NEAR SECTOR 4!',
    engagement: '920K views · 74K forwards',
    hasMedia: true,
    scenarioIndex: 2,
  },
];

export const CompanionSimulatorView: React.FC<CompanionSimulatorViewProps> = ({
  onLoadSimulatedAnalysis,
}) => {
  const [selectedPost, setSelectedPost] = useState(SIMULATED_POSTS[0]);
  const [isExtensionPopupOpen, setIsExtensionPopupOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [companionResult, setCompanionResult] = useState<AnalysisResult | null>(null);

  const handleAnalyzeInCompanion = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: selectedPost.platform,
          text: selectedPost.text,
          scenario_id:
            selectedPost.scenarioIndex === 0
              ? 'deepfake-policy-claim'
              : selectedPost.scenarioIndex === 1
              ? 'emerging-indic-llm'
              : 'recontextualized-flood',
        }),
      });

      const data = await res.json();
      setCompanionResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOpenFullAnalysis = () => {
    if (companionResult) {
      onLoadSimulatedAnalysis(companionResult);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-9 max-w-7xl mx-auto space-y-8 text-[#111111]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#111111] mb-1">
            <Chrome size={13} className="text-[#111111]" />
            <span>CLIENT EXTENSION</span>
            <span className="text-[#A39989]">/</span>
            <span className="text-[#7D786F] font-mono">CHROME MANIFEST V3</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight">
            Browser Companion & Interactive Simulator
          </h1>
          <p className="text-xs sm:text-sm text-[#5E5A54] mt-1.5 max-w-2xl leading-relaxed">
            Experience the real companion workflow: browse any simulated public social post, click the injected "Analyze This" trigger, and examine instantaneous risk signals.
          </p>
        </div>

        {/* Extension Download / Unpacked Badge */}
        <div className="liquid-glass border border-white/80 rounded-2xl p-4 flex items-center gap-3.5 text-xs shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#111111] text-[#F8F5EF] flex items-center justify-center shrink-0 shadow-xs">
            <Chrome size={18} />
          </div>
          <div>
            <div className="text-[#111111] font-extrabold">Manifest V3 Extension</div>
            <div className="text-[11px] text-[#5E5A54] font-mono">public/extension/manifest.json</div>
          </div>
        </div>
      </div>

      {/* Simulator Interface Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Simulated Social Media Browser Window (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#D8CFC2] rounded-3xl overflow-hidden shadow-md">
          {/* Simulated Browser Address Bar */}
          <div className="bg-[#FAF7F2] border-b border-[#D8CFC2] px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#D8CFC2] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#D8CFC2] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#D8CFC2] inline-block" />
            </div>

            <div className="flex-1 max-w-md bg-white border border-[#D8CFC2] rounded-xl px-3.5 py-1.5 text-xs text-[#5E5A54] truncate font-mono shadow-2xs">
              https://www.{selectedPost.platform}.com/observed_feed
            </div>

            <div className="flex items-center gap-2">
              {/* Browser Extension Action Icon */}
              <button
                onClick={() => {
                  setIsExtensionPopupOpen(!isExtensionPopupOpen);
                  if (!companionResult && !isAnalyzing) {
                    handleAnalyzeInCompanion();
                  }
                }}
                className={`p-2 rounded-xl border transition-all cursor-pointer relative ${
                  isExtensionPopupOpen
                    ? 'bg-[#111111] text-[#F8F5EF] border-[#111111] shadow-xs'
                    : 'bg-white text-[#111111] border-[#D8CFC2] hover:bg-[#FAF7F2]'
                }`}
                title="Click Voxentra Extension Toolbar Icon"
              >
                <Chrome size={16} />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#111111] animate-ping" />
              </button>
            </div>
          </div>

          {/* Social Post Feed Area */}
          <div className="p-6 sm:p-8 space-y-6 bg-[#FAF7F2]/40">
            <div className="text-[11px] font-extrabold text-[#7D786F] uppercase tracking-wider flex items-center justify-between">
              <span>Simulated Public Social Post</span>
              <span className="text-[11px] font-normal text-[#7D786F]">Select post to test below</span>
            </div>

            {/* Active Social Post Card */}
            <div className="bg-white border border-[#D8CFC2] rounded-2xl p-6 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <PlatformIcon platform={selectedPost.platform} size={22} />
                  <div>
                    <span className="font-extrabold text-[#111111] text-sm block">
                      {selectedPost.author}
                    </span>
                    <span className="text-[11px] text-[#7D786F]">{selectedPost.time}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-[#111111] leading-relaxed font-medium">
                {selectedPost.text}
              </p>

              <div className="text-xs text-[#7D786F] font-mono pt-3 border-t border-[#D8CFC2]/60">
                {selectedPost.engagement}
              </div>

              {/* Injected Content Script "Analyze This" Button */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-[11px] text-[#7D786F] italic">
                  Voxentra content-script injected trigger:
                </span>

                <button
                  onClick={() => {
                    setIsExtensionPopupOpen(true);
                    handleAnalyzeInCompanion();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-[#F8F5EF] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
                >
                  <Search size={14} />
                  <span>Analyze This (Voxentra)</span>
                </button>
              </div>
            </div>

            {/* Post Switcher */}
            <div className="space-y-2.5 pt-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7D786F] block">
                Switch Simulated Public Feed:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {SIMULATED_POSTS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPost(p);
                      setCompanionResult(null);
                      setIsExtensionPopupOpen(false);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedPost.id === p.id
                        ? 'border-[#111111] bg-white text-[#111111] shadow-sm ring-1 ring-[#111111]'
                        : 'border-[#D8CFC2] bg-white/70 text-[#5E5A54] hover:bg-white hover:border-[#A39989]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold mb-1 text-[#111111]">
                      <PlatformIcon platform={p.platform} size={14} />
                      <span className="capitalize">{p.platform}</span>
                    </div>
                    <p className="line-clamp-2 text-[11px] text-[#5E5A54] mt-1">
                      {p.text}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Simulated Extension Popup (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="liquid-glass border border-white/80 rounded-3xl p-6 space-y-5 shadow-lg relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8CFC2]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#111111] flex items-center justify-center text-[#F8F5EF] font-black text-xs">
                  V
                </div>
                <span className="font-extrabold text-[#111111] text-sm tracking-tight">VOXENTRA</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8DFD2] text-[#111111] font-mono font-bold">
                Companion v1.0
              </span>
            </div>

            {/* Context extraction snippet */}
            <div className="bg-white border border-[#D8CFC2] p-4 rounded-2xl text-xs space-y-1.5 shadow-2xs">
              <div className="text-[10px] text-[#7D786F] uppercase font-bold flex items-center justify-between">
                <span>Active Feed Target</span>
                <span className="font-mono text-[#111111] uppercase font-bold">{selectedPost.platform}</span>
              </div>
              <p className="text-[#3A3834] italic line-clamp-2 text-[11px] leading-relaxed">
                "{selectedPost.text}"
              </p>
            </div>

            {/* Primary Action Button */}
            <button
              disabled={isAnalyzing}
              onClick={handleAnalyzeInCompanion}
              className="w-full py-3 rounded-2xl bg-[#111111] hover:bg-[#2A2A2A] disabled:bg-[#E8DFD2] text-[#F8F5EF] font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#F8F5EF] border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to Backend API...</span>
                </>
              ) : (
                <>
                  <Search size={14} />
                  <span>Analyze This Feed</span>
                </>
              )}
            </button>

            {/* Compact Result Card inside popup */}
            {companionResult && (
              <div className="bg-white border border-[#D8CFC2] rounded-2xl p-4 space-y-3.5 text-xs shadow-2xs">
                <div className="flex items-center justify-between">
                  <RiskBadge level={companionResult.risk.risk_level} size="sm" />
                  <span className="text-[10px] text-[#7D786F] font-mono">
                    Conf: <strong>{companionResult.risk.confidence}</strong>
                  </span>
                </div>

                <p className="text-[#111111] leading-relaxed text-[11px] font-medium">
                  {companionResult.answers.what_is_happening}
                </p>

                <div className="space-y-1.5 text-[11px] pt-1 border-t border-[#D8CFC2]/60">
                  <div className="text-[#5E5A54] flex justify-between">
                    <span>Dominant Stance:</span>
                    <span className="text-[#111111] font-bold">
                      {companionResult.sentiment.stance.opposing > companionResult.sentiment.stance.supportive
                        ? 'High Skepticism'
                        : 'Supportive'}
                    </span>
                  </div>
                  <div className="text-[#5E5A54] flex justify-between">
                    <span>Signals Flagged:</span>
                    <span className="text-[#111111] font-mono font-extrabold">
                      {companionResult.risk.signals.length} Forensic Signals
                    </span>
                  </div>
                </div>

                {/* Open Full Analysis CTA */}
                <button
                  onClick={handleOpenFullAnalysis}
                  className="w-full py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E8DFD2] text-[#111111] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#D8CFC2]"
                >
                  <span>Open Full Dashboard Analysis</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Installation Instructions Card */}
          <div className="liquid-glass border border-white/80 rounded-3xl p-5 text-xs space-y-2.5 shadow-xs">
            <div className="font-extrabold text-[#111111] flex items-center gap-2">
              <FileCode size={15} className="text-[#111111]" />
              <span>Manifest V3 Companion Setup</span>
            </div>
            <p className="text-[#5E5A54] leading-relaxed text-[11px]">
              The production-ready extension package is stored in <code className="text-[#111111] font-mono font-semibold">public/extension/</code>. Load it into Chrome by navigating to <code className="text-[#111111] font-mono">chrome://extensions</code> and clicking "Load unpacked".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
