import React, { useState } from 'react';
import { AnalysisResult } from '../../types/analysis';
import { RiskBadge } from '../common/RiskBadge';
import {
  AlertTriangle,
  FileCheck,
  Eye,
  History,
  ChevronDown,
  ChevronUp,
  FileSearch,
} from 'lucide-react';

import { EmptyAnalysisState } from '../common/EmptyAnalysisState';

interface ContentRiskViewProps {
  analysis: AnalysisResult | null;
  onNavigateToAnalyze?: () => void;
}

export const ContentRiskView: React.FC<ContentRiskViewProps> = ({ analysis, onNavigateToAnalyze }) => {
  if (!analysis) {
    return (
      <EmptyAnalysisState
        title="No Content Risk Audit Available"
        description="Ingest real video content or social post to audit C2PA provenance, synthetic indicators, and context drift."
        onAction={onNavigateToAnalyze}
      />
    );
  }

  const { risk } = analysis;
  const [expandedSignalId, setExpandedSignalId] = useState<string | null>(
    risk.signals[0]?.id || null
  );

  const toggleExpand = (id: string) => {
    setExpandedSignalId(expandedSignalId === id ? null : id);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-9 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#111111] mb-1">
            <span>FORENSIC ENGINE</span>
            <span className="text-[#A39989]">/</span>
            <span>PROVENANCE & INTEGRITY</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight">
            Content Risk & Context Audit
          </h1>
          <p className="text-xs sm:text-sm text-[#5E5A54] mt-1.5 max-w-2xl leading-relaxed">
            Multi-modal authenticity verification auditing synthetic media indicators, cryptographic C2PA provenance manifests, and archival context drift.
          </p>
        </div>

        {/* Risk Badge & Confidence Indicator */}
        <div className="flex items-center gap-3">
          <RiskBadge level={risk.risk_level} size="lg" />
          <div className="liquid-glass rounded-2xl px-4 py-2 text-xs border border-white/80 shadow-xs">
            <span className="text-[#7D786F] text-[10px] uppercase font-bold block">Confidence</span>
            <span className="font-black text-[#111111] text-sm">{risk.confidence}</span>
          </div>
        </div>
      </div>

      {/* Non-Negotiable Mandatory Disclaimer */}
      <div className="bg-[#FAF3E8] border border-[#E0D3C1] rounded-2xl p-5 flex items-start gap-3.5 text-xs text-[#7A5220] shadow-xs">
        <AlertTriangle size={18} className="text-[#9A6B2F] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-extrabold text-[#5A3B12] text-xs uppercase tracking-wide">
            Important Evidentiary Disclaimer
          </span>
          <p className="leading-relaxed text-[#7A5220]">
            {risk.disclaimer}
          </p>
        </div>
      </div>

      {/* Overall Assessment Summary */}
      <div className="bg-[#111111] text-[#F8F5EF] rounded-3xl p-6 sm:p-8 space-y-3 shadow-md">
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#D8CFC2] flex items-center gap-2">
          <FileSearch size={15} className="text-[#F8F5EF]" />
          <span>Synthesis Assessment</span>
        </div>
        <p className="text-base sm:text-lg text-[#F8F5EF] font-medium leading-relaxed">
          {risk.overall_assessment}
        </p>
      </div>

      {/* Forensic Deep Dive: Synthetic Media vs Provenance vs Context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Synthetic Media Indicators Card */}
        <div className="liquid-glass-card rounded-3xl p-6 space-y-4 border border-white/80 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-[#D8CFC2]/60">
            <h3 className="font-extrabold text-[#111111] text-sm flex items-center gap-2">
              <Eye size={16} className="text-[#111111]" />
              <span>Synthetic Media Audit</span>
            </h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                risk.synthetic_indicators.detected
                  ? 'bg-[#111111] text-[#F8F5EF]'
                  : 'bg-[#EDF6F1] text-[#1B4332]'
              }`}
            >
              {risk.synthetic_indicators.detected ? 'ANOMALIES DETECTED' : 'NATURAL ASSET'}
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-[10px] uppercase text-[#7D786F] font-bold block">
                Visual Artifacts Observed:
              </span>
              {risk.synthetic_indicators.visual_artifacts.length > 0 ? (
                <ul className="mt-1.5 space-y-1.5">
                  {risk.synthetic_indicators.visual_artifacts.map((art, i) => (
                    <li key={i} className="text-[#3A3834] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                      <span className="leading-snug">{art}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-[#7D786F] italic mt-1 block">None detected.</span>
              )}
            </div>

            <div>
              <span className="text-[10px] uppercase text-[#7D786F] font-bold block">
                Acoustic Spectral Analysis:
              </span>
              {risk.synthetic_indicators.audio_spectral_anomalies.length > 0 ? (
                <ul className="mt-1.5 space-y-1.5">
                  {risk.synthetic_indicators.audio_spectral_anomalies.map((ano, i) => (
                    <li key={i} className="text-[#3A3834] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9A6B2F]" />
                      <span className="leading-snug">{ano}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-[#7D786F] italic mt-1 block">Zero acoustic syntheses.</span>
              )}
            </div>

            <div className="pt-3 border-t border-[#D8CFC2]/60 flex justify-between items-center text-[11px]">
              <span className="text-[#7D786F] font-medium">Coherence:</span>
              <span className="font-mono font-bold text-[#111111]">{risk.synthetic_indicators.temporal_coherence}</span>
            </div>
          </div>
        </div>

        {/* Provenance & C2PA Credentials Card */}
        <div className="liquid-glass-card rounded-3xl p-6 space-y-4 border border-white/80 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-[#D8CFC2]/60">
            <h3 className="font-extrabold text-[#111111] text-sm flex items-center gap-2">
              <FileCheck size={16} className="text-[#111111]" />
              <span>Provenance & C2PA</span>
            </h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                risk.c2pa_metadata.has_credentials
                  ? 'bg-[#EDF6F1] text-[#1B4332]'
                  : 'bg-[#E8DFD2] text-[#5E5A54]'
              }`}
            >
              {risk.c2pa_metadata.has_credentials ? 'C2PA SIGNED' : 'NO C2PA SIGNATURE'}
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-[10px] uppercase text-[#7D786F] font-bold block">Issuer</span>
              <div className="text-[#111111] font-semibold mt-0.5">
                {risk.c2pa_metadata.issuer || 'Unsigned / Third-party social repost container'}
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase text-[#7D786F] font-bold block">Platform Label</span>
              <div className="text-[#3A3834] mt-0.5">
                {risk.c2pa_metadata.platform_label_text}
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase text-[#7D786F] font-bold block">
                Detected Container Edits:
              </span>
              {risk.c2pa_metadata.edits_detected.length > 0 ? (
                <ul className="mt-1.5 space-y-1">
                  {risk.c2pa_metadata.edits_detected.map((edit, i) => (
                    <li key={i} className="text-[#3A3834] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7D786F]" />
                      <span>{edit}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-[#1B4332] font-semibold text-[11px] mt-1 block">Unmodified raw payload</span>
              )}
            </div>
          </div>
        </div>

        {/* Context Audit & Archival Matching Card */}
        <div className="liquid-glass-card rounded-3xl p-6 space-y-4 border border-white/80 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-[#D8CFC2]/60">
            <h3 className="font-extrabold text-[#111111] text-sm flex items-center gap-2">
              <History size={16} className="text-[#111111]" />
              <span>Context Drift Audit</span>
            </h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                risk.context_audit.drift_detected
                  ? 'bg-[#111111] text-[#F8F5EF]'
                  : 'bg-[#EDF6F1] text-[#1B4332]'
              }`}
            >
              {risk.context_audit.drift_detected ? 'CONTEXT DRIFT' : 'ALIGNED CONTEXT'}
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-[10px] uppercase text-[#7D786F] font-bold block">Mismatch Summary</span>
              <p className="text-[#3A3834] mt-0.5 leading-relaxed">
                {risk.context_audit.mismatch_summary}
              </p>
            </div>

            {risk.context_audit.reused_footage_origin && (
              <div className="bg-[#FAF3E8] p-3 rounded-xl border border-[#E0D3C1]">
                <span className="text-[10px] uppercase text-[#845318] font-bold block">
                  Archival Match Identified:
                </span>
                <span className="text-[#111111] font-semibold mt-0.5 block">
                  {risk.context_audit.reused_footage_origin}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Identified Signals with "Show Why" Evidence Accordion */}
      <section className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4 border border-white/80 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-[#111111] tracking-tight">
            Evidence Signals ({risk.signals.length} Signals Identified)
          </h2>
          <p className="text-xs text-[#5E5A54] mt-0.5">
            Inspect technical forensic evidence, optical metrics, and verification methodology for each signal.
          </p>
        </div>

        <div className="space-y-3">
          {risk.signals.map((sig) => {
            const isExpanded = expandedSignalId === sig.id;
            return (
              <div
                key={sig.id}
                className="bg-white/70 border border-[#D8CFC2]/70 rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                <div
                  onClick={() => toggleExpand(sig.id)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-white transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        sig.severity === 'high'
                          ? 'bg-[#111111] text-[#F8F5EF]'
                          : sig.severity === 'caution'
                          ? 'bg-[#FAF3E8] text-[#845318] border border-[#9A6B2F]/30'
                          : 'bg-[#EDF6F1] text-[#1B4332]'
                      }`}
                    >
                      {sig.severity.toUpperCase()}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-[#111111] text-sm">{sig.title}</h3>
                      <p className="text-xs text-[#5E5A54] mt-0.5 line-clamp-1">
                        {sig.description}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="flex items-center gap-1 text-xs font-bold text-[#111111] shrink-0"
                  >
                    <span>{isExpanded ? 'Hide Evidence' : 'Show Why'}</span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {/* Expanded Evidence Drawer */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 pt-0 border-t border-[#D8CFC2]/50 space-y-3.5 text-xs bg-[#F8F5EF]/60">
                    <div className="pt-3">
                      <span className="text-[10px] uppercase text-[#7D786F] font-bold block mb-1.5">
                        Observable Evidentiary Checklist:
                      </span>
                      <ul className="space-y-1.5 pl-2">
                        {sig.evidence.map((ev, i) => (
                          <li key={i} className="text-[#3A3834] flex items-start gap-2">
                            <span className="text-[#111111] font-black">✓</span>
                            <span>{ev}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 bg-white border border-[#D8CFC2] rounded-xl shadow-xs">
                      <span className="text-[10px] uppercase text-[#5E5A54] font-mono font-bold block">
                        Technical Forensic Details:
                      </span>
                      <p className="text-[#111111] mt-1 font-mono text-[11px] leading-relaxed">
                        {sig.technical_details}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
