import React from 'react';
import { AnalysisResult } from '../../types/analysis';
import {
  TrendingUp,
  ArrowUpRight,
  Flame,
  GitBranch,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PlatformIcon } from '../common/PlatformIcon';
import { motion } from 'motion/react';

interface TrendsViewProps {
  analysis: AnalysisResult;
}

export const TrendsView: React.FC<TrendsViewProps> = ({ analysis }) => {
  const { trends } = analysis;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="p-4 sm:p-6 lg:p-9 max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#111111] mb-1">
            <span>MOMENTUM ENGINE</span>
            <span className="text-[#A39989]">/</span>
            <span>NARRATIVE EVOLUTION</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight">
            Trends & Narrative Trajectory
          </h1>
          <p className="text-xs sm:text-sm text-[#5E5A54] mt-1.5 max-w-2xl leading-relaxed">
            Tracks real-time topical velocity, detects spontaneous narrative shifts, and analyzes keyword acceleration across platforms.
          </p>
        </div>

        {/* Acceleration KPI Card */}
        <div className="liquid-glass rounded-2xl p-4 flex items-center gap-4 text-xs border border-white/80 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-[#111111] text-[#F8F5EF] flex items-center justify-center shadow-sm">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="text-[#7D786F] text-[10px] uppercase font-bold">Trend Acceleration</div>
            <div className="font-black text-2xl text-[#111111] flex items-center gap-1.5">
              <span>+{trends.acceleration_percentage}%</span>
              <span className="text-xs font-semibold text-[#5E5A54]">({trends.velocity_label})</span>
            </div>
            <div className="text-[10px] text-[#7D786F]">{trends.acceleration_period}</div>
          </div>
        </div>
      </div>

      {/* Narrative Evolution & Shift Highlights */}
      <section className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-6 border border-white/80 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#D8CFC2]/60">
          <div>
            <h2 className="text-lg font-black text-[#111111] tracking-tight flex items-center gap-2">
              <GitBranch size={18} className="text-[#111111]" />
              <span>Narrative Evolution & Pivots</span>
            </h2>
            <p className="text-xs text-[#5E5A54] mt-0.5">
              Observes how public conversation morphs from initial reaction to secondary discourse or debunking.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {trends.narratives.map((narrative) => (
            <div
              key={narrative.id}
              className="bg-white/80 border border-[#D8CFC2]/70 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <PlatformIcon platform={narrative.origin_platform} size={17} />
                  <span className="font-extrabold text-[#111111] text-sm sm:text-base">
                    {narrative.title}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      narrative.status === 'rising'
                        ? 'bg-[#111111] text-[#F8F5EF]'
                        : narrative.status === 'declining'
                        ? 'bg-[#E8DFD2] text-[#5E5A54]'
                        : 'bg-[#FAF3E8] text-[#845318] border border-[#D8CFC2]'
                    }`}
                  >
                    {narrative.status.toUpperCase()} ({narrative.acceleration})
                  </span>
                  <span className="text-[11px] text-[#7D786F] font-mono">
                    {narrative.volume.toLocaleString()} mentions
                  </span>
                </div>
              </div>

              {/* Sample representative quote */}
              <blockquote className="text-xs italic text-[#5E5A54] border-l-2 border-[#111111] pl-3.5 py-0.5 leading-relaxed">
                {narrative.sample_quote}
              </blockquote>

              {/* If Narrative Shift detected, show the From -> To pathway */}
              {narrative.shift_evolution && (
                <div className="mt-3 p-4 bg-[#FAF3E8] border border-[#D8CFC2] rounded-xl text-xs space-y-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
                    <Sparkles size={13} className="text-[#111111]" />
                    <span>Identified Narrative Shift Trajectory</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-[#D8CFC2]">
                      <span className="text-[10px] text-[#7D786F] block font-bold uppercase">Initial Narrative (From):</span>
                      <span className="text-[#5E5A54] mt-1 block font-medium">{narrative.shift_evolution.from}</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-[#111111]/30">
                      <span className="text-[10px] text-[#111111] block font-bold uppercase">Subsequent Pivot (To):</span>
                      <span className="text-[#111111] mt-1 block font-bold">{narrative.shift_evolution.to}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#7D786F] pt-1 flex items-center gap-1.5 font-medium">
                    <Clock size={12} className="text-[#7D786F]" />
                    <span>Trigger: {narrative.shift_evolution.trigger_timestamp}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Trending Topics & Viral Keyword Trajectories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Topics List */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-7 space-y-4 border border-white/80 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#D8CFC2]/60">
            <h3 className="font-extrabold text-[#111111] text-base flex items-center gap-2">
              <Flame size={16} className="text-[#111111]" />
              <span>Trending Topic Clusters</span>
            </h3>
            <span className="text-xs font-semibold text-[#7D786F]">Growth Velocity</span>
          </div>

          <div className="space-y-2.5 pt-2">
            {trends.trending_topics.map((t, idx) => (
              <div
                key={idx}
                className="bg-white/80 border border-[#D8CFC2]/70 p-3.5 rounded-2xl flex items-center justify-between text-xs shadow-2xs"
              >
                <div>
                  <div className="font-extrabold text-[#111111]">{t.name}</div>
                  <div className="text-[11px] text-[#7D786F] mt-0.5">
                    {t.volume.toLocaleString()} interactions · Sentiment: {t.sentiment}
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center text-xs font-bold text-[#111111] bg-[#FAF3E8] border border-[#D8CFC2] px-2.5 py-0.5 rounded-full">
                    <ArrowUpRight size={13} />
                    <span>+{t.growth}%</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Viral Keywords & Trajectory */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-7 space-y-4 border border-white/80 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#D8CFC2]/60">
            <h3 className="font-extrabold text-[#111111] text-base flex items-center gap-2">
              <TrendingUp size={16} className="text-[#111111]" />
              <span>Viral Keywords & Signals</span>
            </h3>
            <span className="text-xs font-semibold text-[#7D786F]">Signal Weight</span>
          </div>

          <div className="space-y-3 pt-2">
            {trends.viral_keywords.map((kw, idx) => (
              <div
                key={idx}
                className="bg-white/80 border border-[#D8CFC2]/70 p-3.5 rounded-2xl space-y-2 text-xs shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#111111]">{kw.keyword}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#7D786F]">{kw.category}</span>
                    <span className="font-mono text-[#111111] font-bold">{kw.weight}/100</span>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-[#E8DFD2] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${kw.weight}%` }}
                    className="h-full bg-[#111111] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
