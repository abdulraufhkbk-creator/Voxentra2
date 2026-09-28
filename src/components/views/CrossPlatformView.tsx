import React, { useState } from 'react';
import { AnalysisResult, PlatformObservation } from '../../types/analysis';
import { PlatformIcon, getPlatformName, isLiveCapablePlatform } from '../common/PlatformIcon';
import {
  Layers,
  ArrowRight,
  Clock,
  Eye,
  MessageSquare,
  AlertTriangle,
  FileText,
  Share2,
  Radio,
  Database,
  Sparkles,
} from 'lucide-react';

interface CrossPlatformViewProps {
  analysis: AnalysisResult;
}

export const CrossPlatformView: React.FC<CrossPlatformViewProps> = ({ analysis }) => {
  const { cross_platform } = analysis;
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformObservation>(
    cross_platform.platforms[0] || null
  );

  return (
    <div className="p-4 sm:p-6 lg:p-9 max-w-7xl mx-auto space-y-8 text-[#111111]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#111111] mb-1">
            <span>OMNI-CHANNEL INTELLIGENCE</span>
            <span className="text-[#A39989]">/</span>
            <span>MULTI-PLATFORM DIFFUSION</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight">
            Cross-Platform Spread & Narrative Variations
          </h1>
          <p className="text-xs sm:text-sm text-[#5E5A54] mt-1.5 max-w-2xl leading-relaxed">
            Side-by-side comparative inspection tracking how the same core claim or asset adapts in tone, captioning, and amplification across all 6 major social ecosystems.
          </p>
        </div>

        {/* Omnichannel metrics */}
        <div className="liquid-glass rounded-2xl p-3.5 flex items-center gap-4 text-xs border border-white/80 shadow-xs">
          <div>
            <div className="text-[#7D786F] text-[10px] uppercase font-bold">Origin Point</div>
            <div className="font-bold text-[#111111] text-xs truncate max-w-[140px]">
              {cross_platform.earliest_origin.split(' ')[0]}
            </div>
          </div>
          <div className="h-6 w-[1px] bg-[#D8CFC2]" />
          <div>
            <div className="text-[#7D786F] text-[10px] uppercase font-bold">Ecosystems</div>
            <div className="font-black text-[#111111] text-sm">
              {cross_platform.total_platforms_detected} Platforms
            </div>
          </div>
        </div>
      </div>

      {/* Propagation Pathway Visual Ribbon */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-3 border border-white/80 shadow-sm">
        <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
          <Share2 size={14} />
          <span>Cross-Platform Propagation Sequence</span>
        </h2>
        <div className="text-sm sm:text-base font-bold text-[#111111]">
          {cross_platform.propagation_pattern}
        </div>
      </div>

      {/* Side-by-Side Platform Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cross_platform.platforms.map((plat) => {
          const isSelected = selectedPlatform?.platform === plat.platform;
          const isLiveCapable = isLiveCapablePlatform(plat.platform);

          return (
            <div
              key={plat.platform}
              onClick={() => setSelectedPlatform(plat)}
              className={`bg-white/90 border rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between space-y-4 shadow-2xs ${
                isSelected
                  ? 'border-[#111111] bg-white ring-2 ring-[#111111]/10'
                  : 'border-[#D8CFC2] hover:border-[#111111]/30 hover:bg-white'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PlatformIcon platform={plat.platform} size={20} />
                    <span className="font-bold text-[#111111] text-sm">
                      {getPlatformName(plat.platform)}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isLiveCapable
                        ? 'bg-[#111111] text-[#F8F5EF]'
                        : 'bg-[#FAF7F2] border border-[#D8CFC2] text-[#5E5A54]'
                    }`}
                  >
                    {isLiveCapable ? 'LIVE READY' : 'DEMO DATASET'}
                  </span>
                </div>

                {/* Sample observed content string */}
                <div className="bg-[#FAF7F2] border border-[#D8CFC2]/60 p-3 rounded-xl text-xs text-[#3A3834] italic line-clamp-2">
                  "{plat.sample_content}"
                </div>

                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-[#7D786F] font-bold block">
                      Local Narrative:
                    </span>
                    <span className="text-[#111111] font-semibold">{plat.primary_narrative}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-[#7D786F] font-bold block">
                      Audience Sentiment Tone:
                    </span>
                    <span className="text-[#5E5A54]">{plat.sentiment_tone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#D8CFC2]/60 flex items-center justify-between text-xs text-[#7D786F]">
                <span className="flex items-center gap-1 font-mono text-[#5E5A54]">
                  <Eye size={12} />
                  <span>{plat.total_engagement.toLocaleString()}</span>
                </span>
                <span className="text-[11px] text-[#111111] font-bold flex items-center gap-1">
                  <span>Inspect</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Platform Detailed Breakdown */}
      {selectedPlatform && (
        <section className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-6 border border-white/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8CFC2]">
            <div className="flex items-center gap-3">
              <PlatformIcon platform={selectedPlatform.platform} size={24} />
              <div>
                <span className="text-[10px] font-mono uppercase text-[#7D786F] font-bold block">
                  Detailed Omnichannel Audit · {isLiveCapablePlatform(selectedPlatform.platform) ? 'Live Capable Connector' : 'Seeded Demo Dataset'}
                </span>
                <h3 className="text-xl font-black text-[#111111]">
                  {getPlatformName(selectedPlatform.platform)} Conversation Cluster
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-[#7D786F] font-mono">
                First Appeared: {selectedPlatform.first_appeared}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#111111] text-[#F8F5EF] font-mono font-bold text-[11px]">
                {selectedPlatform.post_count.toLocaleString()} syndicated posts
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                Amplification Vector on {getPlatformName(selectedPlatform.platform)}
              </span>
              <p className="bg-white/90 border border-[#D8CFC2] p-4 rounded-2xl text-[#3A3834] leading-relaxed shadow-2xs">
                {selectedPlatform.amplification_vector}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                Risk Signal Alignment
              </span>
              <p className="bg-white/90 border border-[#D8CFC2] p-4 rounded-2xl text-[#3A3834] leading-relaxed shadow-2xs">
                {selectedPlatform.risk_signal_alignment}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
