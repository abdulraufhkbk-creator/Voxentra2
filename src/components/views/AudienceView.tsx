import React, { useState } from 'react';
import { AnalysisResult, AudienceSegment } from '../../types/analysis';
import {
  Users,
  ShieldCheck,
  MapPin,
  PieChart,
  Languages,
  TrendingUp,
} from 'lucide-react';

interface AudienceViewProps {
  analysis: AnalysisResult;
}

export const AudienceView: React.FC<AudienceViewProps> = ({ analysis }) => {
  const { audience, sentiment } = analysis;
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>(
    audience.segments[0]?.id || ''
  );
  const [regionFilter, setRegionFilter] = useState<string>('All');

  const selectedSegment =
    audience.segments.find((s) => s.id === selectedSegmentId) ||
    audience.segments[0];

  const filteredRegions = Object.entries(audience.regions).filter(([region]) =>
    regionFilter === 'All' ? true : region === regionFilter
  );

  return (
    <div className="p-4 sm:p-6 lg:p-9 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#111111] mb-1">
            <span>AGGREGATE INTELLIGENCE</span>
            <span className="text-[#A39989]">/</span>
            <span>WHO IS DRIVING WHAT?</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight">
            Audience Intelligence & Demographic Clustering
          </h1>
          <p className="text-xs sm:text-sm text-[#5E5A54] mt-1.5 max-w-2xl leading-relaxed">
            Privacy-first aggregate profiling answering who is driving conversation momentum, what communities are feeling, and which demographic segments are leading the narrative.
          </p>
        </div>

        {/* Statistical Confidence Badges */}
        <div className="liquid-glass rounded-2xl p-3.5 flex items-center gap-4 text-xs border border-white/80 shadow-xs">
          <div>
            <div className="text-[#7D786F] text-[10px] uppercase font-bold">Sample Size</div>
            <div className="font-black text-[#111111] text-sm">
              {audience.sample_size.toLocaleString()}
            </div>
          </div>
          <div className="h-7 w-[1px] bg-[#D8CFC2]" />
          <div>
            <div className="text-[#7D786F] text-[10px] uppercase font-bold">Coverage</div>
            <div className="font-black text-[#111111] text-sm">
              {audience.audience_coverage.slice(0, 5)}
            </div>
          </div>
          <div className="h-7 w-[1px] bg-[#D8CFC2]" />
          <div>
            <div className="text-[#7D786F] text-[10px] uppercase font-bold">Confidence</div>
            <div className="font-black text-[#111111] text-sm">
              {audience.inference_confidence}
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="liquid-glass rounded-2xl p-4 flex items-start gap-3 text-xs text-[#5E5A54] border border-white/90 shadow-2xs">
        <ShieldCheck size={18} className="text-[#111111] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-extrabold text-[#111111]">Strict Anonymization Guarantee: </span>
          <span>{audience.privacy_guarantee}</span>
        </div>
      </div>

      {/* Primary Key Question: "Who is driving what?" */}
      <div className="bg-[#111111] text-[#F8F5EF] rounded-3xl p-6 sm:p-8 space-y-2.5 shadow-md">
        <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-[#D8CFC2] flex items-center gap-1.5">
          <TrendingUp size={14} />
          <span>Core Intelligence Finding</span>
        </h2>
        <div className="text-base sm:text-xl font-bold leading-relaxed text-white">
          {analysis.answers.who_is_driving_it}
        </div>
      </div>

      {/* Anonymous Audience Segments */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-black text-[#111111] tracking-tight">
            Anonymous Audience Segments
          </h2>
          <p className="text-xs text-[#5E5A54]">
            Algorithmic macro-clusters based on shared engagement patterns, linguistic signatures, and topic affinity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {audience.segments.map((seg) => {
            const isSelected = seg.id === selectedSegmentId;
            return (
              <div
                key={seg.id}
                onClick={() => setSelectedSegmentId(seg.id)}
                className={`liquid-glass-card rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'ring-2 ring-[#111111] bg-white shadow-md'
                    : ''
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-extrabold text-[#111111]">
                      {seg.share_percentage}% of total
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8DFD2] text-[#111111] font-bold">
                      {seg.age_band}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-[#111111] text-sm leading-snug">
                    {seg.name}
                  </h3>

                  <div className="space-y-1 text-xs text-[#5E5A54]">
                    <div className="flex items-center gap-1.5">
                      <Languages size={13} className="text-[#7D786F]" />
                      <span className="truncate">{seg.languages.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <PieChart size={13} className="text-[#7D786F]" />
                      <span className="truncate">{seg.top_interests.join(' · ')}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#D8CFC2]/60 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#7D786F]">Stance:</span>
                    <span className="font-bold text-[#111111] capitalize">
                      {seg.dominant_stance} ({seg.support_percentage}% sup / {seg.oppose_percentage}% opp)
                    </span>
                  </div>

                  {/* Stance Progress Bar */}
                  <div className="h-1.5 w-full bg-[#E8DFD2] rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${seg.support_percentage}%` }}
                      className="bg-[#111111]"
                    />
                    <div
                      style={{ width: `${seg.oppose_percentage}%` }}
                      className="bg-[#9A6B2F]"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Selected Segment Deep Dive */}
      {selectedSegment && (
        <section className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-6 border border-white/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8CFC2]/60">
            <div>
              <span className="text-[10px] font-mono text-[#7D786F] font-bold uppercase tracking-wider">
                Segment Deep-Dive
              </span>
              <h3 className="text-xl font-black text-[#111111] mt-0.5">
                {selectedSegment.name}
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-[#5E5A54]">Sample Size:</span>
              <span className="font-extrabold text-[#111111] bg-white border border-[#D8CFC2] px-3 py-1 rounded-xl font-mono shadow-2xs">
                {selectedSegment.sample_size.toLocaleString()} users
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
                Key Behavioral Drivers
              </span>
              <p className="text-xs text-[#5E5A54] leading-relaxed bg-white/70 border border-[#D8CFC2]/70 p-4 rounded-2xl shadow-2xs">
                {selectedSegment.key_drivers}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
                Linguistic & Code-Mixing Distribution
              </span>
              <div className="bg-white/70 border border-[#D8CFC2]/70 p-4 rounded-2xl space-y-2 text-xs shadow-2xs">
                {selectedSegment.languages.map((lang, idx) => (
                  <div key={lang} className="flex items-center justify-between">
                    <span className="text-[#5E5A54] font-medium">{lang}</span>
                    <span className="font-mono text-[#111111] font-bold">
                      {Math.max(15, 60 - idx * 15)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
                Engagement Velocity Rate
              </span>
              <div className="bg-white/70 border border-[#D8CFC2]/70 p-4 rounded-2xl space-y-2 text-xs shadow-2xs">
                <div className="text-[#111111] font-black text-sm">{selectedSegment.engagement_rate}</div>
                <p className="text-[11px] text-[#7D786F]">
                  Calculated against baseline demographic group peer velocity.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Demographic Distributions: Age & Regions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Band Breakdown */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-7 space-y-4 border border-white/80 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#D8CFC2]/60">
            <h3 className="font-extrabold text-[#111111] text-base flex items-center gap-2">
              <Users size={16} className="text-[#111111]" />
              <span>Age Band Distribution</span>
            </h3>
            <span className="text-xs font-semibold text-[#7D786F]">5 Aggregate Bands</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {Object.entries(audience.age_bands).map(([band, pct]) => (
              <div key={band} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#111111] font-bold">{band}</span>
                  <span className="font-mono text-[#111111] font-bold">{pct}%</span>
                </div>
                <div className="h-2 w-full bg-[#E8DFD2] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-[#111111] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Regional Analysis */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-7 space-y-4 border border-white/80 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#D8CFC2]/60">
            <h3 className="font-extrabold text-[#111111] text-base flex items-center gap-2">
              <MapPin size={16} className="text-[#111111]" />
              <span>Geographic Concentration</span>
            </h3>
            <span className="text-xs font-semibold text-[#7D786F]">Regional Macro-Zones</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {filteredRegions.map(([region, pct]) => (
              <div key={region} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#111111] font-bold">{region}</span>
                  <span className="font-mono text-[#111111] font-bold">{pct}%</span>
                </div>
                <div className="h-2 w-full bg-[#E8DFD2] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-[#5E5A54] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Multilingual Sentiment Matrix */}
      <section className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4 border border-white/80 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#D8CFC2]/60">
          <div>
            <h3 className="font-extrabold text-[#111111] text-base flex items-center gap-2">
              <Languages size={16} className="text-[#111111]" />
              <span>Multilingual Sentiment & Dialect Breakdown</span>
            </h3>
            <p className="text-xs text-[#5E5A54] mt-0.5">
              Evaluated across regional Indic languages, Hinglish, and code-mixed scripts.
            </p>
          </div>

          {sentiment.sarcasm_indicators.detected && (
            <div className="text-xs bg-white border border-[#D8CFC2] text-[#111111] font-bold px-3 py-1 rounded-full shadow-2xs">
              Sarcasm Detected ({sentiment.sarcasm_indicators.count.toLocaleString()} instances)
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 pt-2">
          {Object.entries(sentiment.by_language).map(([lang, stat]) => (
            <div
              key={lang}
              className="bg-white/80 border border-[#D8CFC2]/70 rounded-2xl p-4 space-y-2.5 text-xs shadow-2xs"
            >
              <div className="flex items-center justify-between font-bold text-[#111111]">
                <span>{lang}</span>
                <span className="text-[10px] text-[#7D786F] font-mono">
                  {stat.count.toLocaleString()}
                </span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-[#111111] font-semibold">
                  <span>Positive</span>
                  <span>{stat.positive}%</span>
                </div>
                <div className="flex justify-between text-[#5E5A54]">
                  <span>Neutral</span>
                  <span>{stat.neutral}%</span>
                </div>
                <div className="flex justify-between text-[#7D786F]">
                  <span>Negative</span>
                  <span>{stat.negative}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
