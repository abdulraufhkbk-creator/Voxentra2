import React, { useState } from 'react';
import { AnalysisResult } from '../../types/analysis';
import { PlatformIcon } from '../common/PlatformIcon';
import {
  Eye,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';

import { EmptyAnalysisState } from '../common/EmptyAnalysisState';

interface TimelineViewProps {
  analysis: AnalysisResult | null;
  onNavigateToAnalyze?: () => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ analysis, onNavigateToAnalyze }) => {
  if (!analysis) {
    return (
      <EmptyAnalysisState
        title="No Timeline Events Available"
        description="Ingest real social content to trace event milestones, origin timestamps, and velocity acceleration."
        onAction={onNavigateToAnalyze}
      />
    );
  }

  const { timeline } = analysis;
  const [phaseFilter, setPhaseFilter] = useState<string>('all');

  const filteredEvents = timeline.events.filter((ev) => {
    if (phaseFilter === 'all') return true;
    return ev.phase === phaseFilter;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-9 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#111111] mb-1">
            <span>CHRONOLOGY ENGINE</span>
            <span className="text-[#A39989]">/</span>
            <span>TEMPORAL DIFFUSION</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight">
            Propagation Chronology & Timeline
          </h1>
          <p className="text-xs sm:text-sm text-[#5E5A54] mt-1.5 max-w-2xl leading-relaxed">
            Time-indexed sequence tracking message origin, early reactions, bot amplification rings, cross-platform jumps, and subsequent narrative pivots.
          </p>
        </div>

        {/* Temporal Bounds Indicator */}
        <div className="liquid-glass rounded-2xl p-3.5 flex items-center gap-4 text-xs border border-white/80 shadow-xs">
          <div>
            <div className="text-[#7D786F] text-[10px] uppercase font-bold">Start Time</div>
            <div className="font-mono text-[#111111] text-xs font-black">
              {new Date(timeline.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
            </div>
          </div>
          <div className="h-7 w-[1px] bg-[#D8CFC2]" />
          <div>
            <div className="text-[#7D786F] text-[10px] uppercase font-bold">Peak Velocity</div>
            <div className="font-mono text-[#111111] text-xs font-black">
              {new Date(timeline.peak_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
            </div>
          </div>
        </div>
      </div>

      {/* Phase Filter Controls */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 liquid-glass border border-white/80 rounded-2xl text-xs font-bold w-fit shadow-xs">
        <button
          onClick={() => setPhaseFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            phaseFilter === 'all'
              ? 'bg-[#111111] text-[#F8F5EF] shadow-sm'
              : 'text-[#5E5A54] hover:text-[#111111] hover:bg-white/60'
          }`}
        >
          All Phases ({timeline.events.length})
        </button>
        <button
          onClick={() => setPhaseFilter('origin')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            phaseFilter === 'origin'
              ? 'bg-[#111111] text-[#F8F5EF] shadow-sm'
              : 'text-[#5E5A54] hover:text-[#111111] hover:bg-white/60'
          }`}
        >
          Origin
        </button>
        <button
          onClick={() => setPhaseFilter('amplification')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            phaseFilter === 'amplification'
              ? 'bg-[#111111] text-[#F8F5EF] shadow-sm'
              : 'text-[#5E5A54] hover:text-[#111111] hover:bg-white/60'
          }`}
        >
          Amplification
        </button>
        <button
          onClick={() => setPhaseFilter('cross_platform')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            phaseFilter === 'cross_platform'
              ? 'bg-[#111111] text-[#F8F5EF] shadow-sm'
              : 'text-[#5E5A54] hover:text-[#111111] hover:bg-white/60'
          }`}
        >
          Cross-Platform
        </button>
        <button
          onClick={() => setPhaseFilter('narrative_shift')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            phaseFilter === 'narrative_shift'
              ? 'bg-[#111111] text-[#F8F5EF] shadow-sm'
              : 'text-[#5E5A54] hover:text-[#111111] hover:bg-white/60'
          }`}
        >
          Narrative Shift
        </button>
        <button
          onClick={() => setPhaseFilter('peak')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            phaseFilter === 'peak'
              ? 'bg-[#111111] text-[#F8F5EF] shadow-sm'
              : 'text-[#5E5A54] hover:text-[#111111] hover:bg-white/60'
          }`}
        >
          Peak & Debunking
        </button>
      </div>

      {/* Chronological Event Stream */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-[#D8CFC2] space-y-8 my-4">
        {filteredEvents.map((event) => (
          <div key={event.id} className="relative group">
            {/* Timeline bullet */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-2 w-4 h-4 rounded-full bg-[#FAF7F2] border-3 border-[#111111] group-hover:scale-125 transition-transform shadow-xs" />

            <div className="liquid-glass-card border border-white/80 rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-xs transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <PlatformIcon platform={event.platform} size={18} />
                  <span className="font-extrabold text-[#111111] text-sm sm:text-base">
                    {event.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-[#111111] bg-white px-2.5 py-0.5 rounded-md border border-[#D8CFC2] font-bold">
                    {event.relative_time}
                  </span>
                  <span className="text-[#7D786F] font-mono">
                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
                  </span>
                  <span className="capitalize px-2 py-0.5 rounded-md bg-[#E8DFD2] text-[#5E5A54] font-bold text-[10px]">
                    {event.phase.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#3A3834] leading-relaxed font-normal">
                {event.description}
              </p>

              {/* Engagement & Sentiment snapshots */}
              <div className="pt-3 border-t border-[#D8CFC2]/50 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4 text-[#5E5A54]">
                  <span className="flex items-center gap-1.5">
                    <Eye size={13} className="text-[#7D786F]" />
                    <span className="font-semibold">{event.engagement_snapshot.views.toLocaleString()} views</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare size={13} className="text-[#7D786F]" />
                    <span className="font-semibold">{event.engagement_snapshot.interactions.toLocaleString()} interactions</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#7D786F] font-bold">Tone:</span>
                  <span className="font-bold text-[#111111]">{event.sentiment_snapshot}</span>
                </div>
              </div>

              {event.risk_indicator && (
                <div className="bg-[#FAF3E8] border border-[#E0D3C1] p-3 rounded-xl flex items-center gap-2 text-xs text-[#845318]">
                  <AlertTriangle size={14} className="text-[#9A6B2F] shrink-0" />
                  <span className="font-semibold">{event.risk_indicator}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
