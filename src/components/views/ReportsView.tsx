import React, { useState } from 'react';
import { AnalysisResult } from '../../types/analysis';
import { RiskBadge } from '../common/RiskBadge';
import { PlatformIcon, getPlatformName } from '../common/PlatformIcon';
import { DataSourceIndicator } from '../common/DataSourceIndicator';
import { CreatorInsightReport } from '../creator/CreatorInsightReport';
import { GranularExportModal } from '../common/GranularExportModal';
import {
  downloadJsonObject,
  downloadFile,
  triggerPrint,
  generateStandaloneHtmlReport,
} from '../../utils/exportUtils';
import {
  FileText,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Users,
  Eye,
  FileCheck,
  Sparkles,
  Layers,
  Flame,
  Activity,
  FileDown,
  Sliders,
  FileCode,
} from 'lucide-react';

interface ReportsViewProps {
  analysis: AnalysisResult;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ analysis }) => {
  const [reportType, setReportType] = useState<'executive' | 'creator'>('executive');
  const [isCopied, setIsCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handlePrint = () => {
    const success = triggerPrint();
    if (!success) {
      // If print was blocked by sandbox, export offline HTML dossier automatically
      handleDownloadHTML();
    }
  };

  const handleDownloadJSON = () => {
    const success = downloadJsonObject(analysis, `voxentra-intelligence-${analysis.id}`);
    if (success) {
      setDownloadSuccess('JSON Exported');
      setTimeout(() => setDownloadSuccess(null), 2000);
    }
  };

  const handleDownloadHTML = () => {
    const reportElem = document.querySelector('.report-page');
    const contentHtml = reportElem ? reportElem.innerHTML : `<h2>${analysis.title}</h2><p>${analysis.risk.overall_assessment}</p>`;
    const fullHtml = generateStandaloneHtmlReport(`Executive Report - ${analysis.title}`, contentHtml);
    const success = downloadFile(fullHtml, `voxentra-dossier-${analysis.id}.html`, 'text/html;charset=utf-8');
    if (success) {
      setDownloadSuccess('Offline Dossier Exported');
      setTimeout(() => setDownloadSuccess(null), 2000);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (reportType === 'creator') {
    return (
      <div className="p-4 sm:p-6 lg:p-9 max-w-7xl mx-auto space-y-6">
        <div className="no-print flex items-center justify-between bg-white/80 p-2 rounded-2xl border border-[#D8CFC2] shadow-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setReportType('executive')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#5E5A54] hover:text-[#111111] transition-colors cursor-pointer"
            >
              <FileText size={14} />
              <span>Executive Forensic Dossier</span>
            </button>

            <button
              onClick={() => setReportType('creator')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111111] text-[#F8F5EF] text-xs font-bold shadow-xs cursor-pointer"
            >
              <Sparkles size={14} />
              <span>Creator Insight Report</span>
            </button>
          </div>
        </div>

        <CreatorInsightReport analysis={analysis} isStandalonePage={false} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-9 max-w-5xl mx-auto space-y-8 text-[#111111]">
      {/* Action Bar (hidden on print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8CFC2]/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#111111]">
            <FileCheck size={13} className="text-[#111111]" />
            <span>OFFICIAL INTELLIGENCE DOSSIER</span>
            <span className="text-[#A39989]">/</span>
            <span className="text-[#7D786F] font-mono">SIH AUDIT READY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
            Executive Intelligence Report
          </h1>
          <p className="text-xs text-[#5E5A54]">
            Comprehensive 11-section synthesis ready for stakeholders, fact-checking desks, and public safety advisories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-white/90 p-1 rounded-xl border border-[#D8CFC2] shadow-2xs mr-1">
            <button
              onClick={() => setReportType('executive')}
              className="px-3 py-1.5 rounded-lg bg-[#111111] text-[#F8F5EF] text-xs font-bold cursor-pointer"
            >
              Executive
            </button>
            <button
              onClick={() => setReportType('creator')}
              className="px-3 py-1.5 rounded-lg text-[#5E5A54] hover:text-[#111111] text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Sparkles size={12} />
              <span>Creator Report</span>
            </button>
          </div>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F3EEE7] text-[#111111] text-xs font-bold border border-[#D8CFC2] transition-colors cursor-pointer shadow-2xs"
            title="Open Granular Export Options (PDF, PNG, CSV, JSON, Markdown)"
          >
            <Download size={14} className="text-[#111111]" />
            <span>Export Options...</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 hover:bg-white text-[#111111] text-xs font-semibold border border-[#D8CFC2] transition-colors cursor-pointer shadow-2xs"
            title="Export JSON Data"
          >
            <FileCode size={14} className="text-[#5E5A54]" />
            <span>{downloadSuccess === 'JSON Exported' ? 'Exported!' : 'JSON'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 hover:bg-white text-[#111111] text-xs font-semibold border border-[#D8CFC2] transition-colors cursor-pointer shadow-2xs"
            title="Share Link"
          >
            {isCopied ? <CheckCircle2 size={14} className="text-emerald-600" /> : <Share2 size={14} className="text-[#5E5A54]" />}
            <span>{isCopied ? 'Link Copied' : 'Share'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-[#F8F5EF] text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer size={14} />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      <GranularExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        analysis={analysis}
        reportType={reportType}
        targetElementSelector=".report-page"
      />

      {/* The Printable Report Container */}
      <div className="report-page bg-[#FAF7F2] border border-[#D8CFC2] rounded-3xl p-6 sm:p-10 space-y-8 text-[#111111] shadow-sm">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#D8CFC2]">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#111111] text-[#F8F5EF] text-[10px] font-mono uppercase tracking-widest font-extrabold">
              VOXENTRA SOCIAL INTELLIGENCE PLATFORM · REPORT ID: {analysis.id.toUpperCase()}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
              {analysis.title}
            </h2>
            <div className="text-xs text-[#5E5A54] flex flex-wrap items-center gap-3 pt-1">
              <span>Timestamp: {new Date(analysis.timestamp).toUTCString()}</span>
              <span>·</span>
              <span className="flex items-center gap-1 font-semibold text-[#111111]">
                <PlatformIcon platform={analysis.target_platform} size={14} />
                <span className="capitalize">{analysis.target_platform}</span>
              </span>
              <span>·</span>
              <span>Engine: {analysis.ai_engine}</span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-start sm:items-end gap-2">
            <RiskBadge level={analysis.risk.risk_level} size="lg" />
            <DataSourceIndicator
              sourceType={analysis.data_source_type}
              aiEngine={analysis.ai_engine}
            />
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <section className="space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
            <FileText size={13} />
            <span>01. Executive Summary & Assessment</span>
          </div>
          <div className="text-xs sm:text-sm text-[#111111] leading-relaxed bg-white p-5 rounded-2xl border border-[#D8CFC2] shadow-2xs font-medium">
            {analysis.risk.overall_assessment}
          </div>
        </section>

        {/* Section 2: What is Happening */}
        <section className="space-y-2">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
            02. What is Happening (Phenomenon Audit)
          </div>
          <p className="text-xs sm:text-sm text-[#3A3834] leading-relaxed">
            {analysis.answers.what_is_happening}
          </p>
        </section>

        {/* Section 3: Audience Intelligence */}
        <section className="space-y-3">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
            <Users size={13} />
            <span>03. Audience Intelligence & Driving Demographics</span>
          </div>
          <p className="text-xs text-[#5E5A54]">
            {analysis.answers.who_is_driving_it}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {analysis.audience.segments.map((seg) => (
              <div key={seg.id} className="bg-white p-3.5 rounded-xl border border-[#D8CFC2] text-xs space-y-1.5 shadow-2xs">
                <div className="flex justify-between font-bold text-[#111111]">
                  <span>{seg.name}</span>
                  <span className="font-mono text-[#111111]">{seg.share_percentage}%</span>
                </div>
                <div className="text-[11px] text-[#5E5A54]">
                  {seg.age_band} · Stance: <strong className="text-[#111111]">{seg.dominant_stance}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Sentiment & Emotion */}
        <section className="space-y-3">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
            <Flame size={13} />
            <span>04. Sentiment & Emotion Distribution</span>
          </div>
          <p className="text-xs text-[#5E5A54]">
            {analysis.answers.what_are_people_feeling}
          </p>

          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-[#FAF7F2] border border-[#D8CFC2] p-4 rounded-2xl">
              <span className="text-[10px] text-[#5E5A54] uppercase font-bold">Positive / Curious</span>
              <div className="text-xl font-black text-[#111111] mt-0.5">
                {analysis.sentiment.overall.positive}%
              </div>
            </div>
            <div className="bg-[#FAF7F2] border border-[#D8CFC2] p-4 rounded-2xl">
              <span className="text-[10px] text-[#5E5A54] uppercase font-bold">Neutral / Informational</span>
              <div className="text-xl font-black text-[#111111] mt-0.5">
                {analysis.sentiment.overall.neutral}%
              </div>
            </div>
            <div className="bg-[#FAF7F2] border border-[#D8CFC2] p-4 rounded-2xl">
              <span className="text-[10px] text-[#5E5A54] uppercase font-bold">Negative / Skeptical</span>
              <div className="text-xl font-black text-[#111111] mt-0.5">
                {analysis.sentiment.overall.negative}%
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Trends & Narratives */}
        <section className="space-y-3">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
            <Activity size={13} />
            <span>05. Trends & Narrative Trajectory</span>
          </div>
          <p className="text-xs text-[#5E5A54]">
            {analysis.answers.what_are_the_main_narratives}
          </p>
          <div className="space-y-2">
            {analysis.trends.narratives.map((nar) => (
              <div key={nar.id} className="bg-white p-3.5 rounded-xl border border-[#D8CFC2] text-xs flex justify-between items-center shadow-2xs">
                <span className="font-semibold text-[#111111]">{nar.title}</span>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8DFD2] text-[#111111]">
                  {nar.status.toUpperCase()} ({nar.acceleration})
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Network & Influence */}
        <section className="space-y-2">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
            06. Network & Influence Topology
          </div>
          <p className="text-xs text-[#3A3834] leading-relaxed">
            {analysis.answers.how_is_it_spreading}
          </p>
          <div className="text-xs text-[#5E5A54] pt-1">
            Total Reach: <strong>{analysis.network.propagation_metrics.total_reach.toLocaleString()}</strong> users across <strong>{analysis.network.propagation_metrics.cross_platform_hops}</strong> platforms. Amplification Factor: <strong>{analysis.network.propagation_metrics.amplification_factor}</strong>.
          </div>
        </section>

        {/* Section 7: Content Risk Signals */}
        <section className="space-y-3">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
            <ShieldAlert size={13} />
            <span>07. Content Risk & Authenticity Signals</span>
          </div>
          <div className="space-y-2">
            {analysis.risk.signals.map((sig) => (
              <div key={sig.id} className="p-4 bg-white border border-[#D8CFC2] rounded-xl text-xs space-y-1 shadow-2xs">
                <div className="flex justify-between items-center font-bold text-[#111111]">
                  <span>{sig.title}</span>
                  <span className={`uppercase text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    sig.severity === 'high' ? 'bg-[#111111] text-[#F8F5EF]' : 'bg-[#FAF3E8] text-[#845318]'
                  }`}>
                    {sig.severity}
                  </span>
                </div>
                <p className="text-[#5E5A54] leading-relaxed">{sig.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 8: Chronological Timeline */}
        <section className="space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
            <Clock size={13} />
            <span>08. Chronological Timeline</span>
          </div>
          <div className="divide-y divide-[#D8CFC2]/60 text-xs bg-white rounded-xl border border-[#D8CFC2] p-3 shadow-2xs">
            {analysis.timeline.events.slice(0, 4).map((ev) => (
              <div key={ev.id} className="py-2.5 flex items-center justify-between text-[#3A3834] first:pt-1 last:pb-1">
                <span><strong>{ev.relative_time}</strong> · {ev.title} ({ev.platform.toUpperCase()})</span>
                <span className="font-mono text-[10px] text-[#7D786F] uppercase font-bold">{ev.phase}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 9: Cross-Platform Observations */}
        <section className="space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
            <Layers size={13} />
            <span>09. Cross-Platform Observations</span>
          </div>
          <p className="text-xs text-[#3A3834] leading-relaxed bg-white p-4 rounded-xl border border-[#D8CFC2] shadow-2xs">
            {analysis.cross_platform.propagation_pattern}
          </p>
        </section>

        {/* Section 10: Evidence and Confidence */}
        <section className="space-y-2">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
            10. Evidence and Provenance Confidence
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#D8CFC2] text-xs space-y-2 shadow-2xs">
            <div className="flex justify-between">
              <span className="text-[#5E5A54]">Confidence Assessment:</span>
              <strong className="text-[#111111]">{analysis.risk.confidence}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5E5A54]">C2PA Cryptographic Signature:</span>
              <strong className="text-[#111111]">
                {analysis.risk.c2pa_metadata.has_credentials ? 'VALIDATED' : 'NOT PRESENT / STRIPPED'}
              </strong>
            </div>
            <div className="pt-2 border-t border-[#D8CFC2]/60 text-[11px] text-[#5E5A54] italic">
              {analysis.risk.disclaimer}
            </div>
          </div>
        </section>

        {/* Section 11: Privacy and Data Coverage Note */}
        <section className="space-y-2 pb-2">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
            <ShieldCheck size={13} />
            <span>11. Privacy & Data Coverage Guarantee</span>
          </div>
          <p className="text-xs text-[#5E5A54] leading-relaxed">
            Data points analyzed: <strong>{analysis.privacy.data_points_analyzed.toLocaleString()}</strong>. Anonymization standard: <strong>{analysis.privacy.anonymization_method}</strong>. No personal profiling, private messages, or account credentials were collected or stored.
          </p>
        </section>

        {/* Footer */}
        <div className="pt-4 border-t border-[#D8CFC2] text-center text-[10px] text-[#7D786F] space-y-1">
          <p className="font-mono">
            VOXENTRA INTELLIGENCE SUITE · SIH FINALIST AUDIT EDITION · {analysis.id.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
};
