import React, { useState } from 'react';
import { AnalysisResult } from '../../types/analysis';
import { IdeaForgeGeneratedConcept } from '../../types/creator';
import {
  generateCreatorInsightReport,
  formatCreatorReportToMarkdown,
} from '../../utils/creatorIntelligence';
import { PlatformIcon, getPlatformName } from '../common/PlatformIcon';
import { GranularExportModal } from '../common/GranularExportModal';
import {
  downloadFile,
  downloadJsonObject,
  triggerPrint,
  generateStandaloneHtmlReport,
} from '../../utils/exportUtils';
import {
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Copy,
  TrendingUp,
  Sparkles,
  HelpCircle,
  AlertCircle,
  Compass,
  Layers,
  Flame,
  FileText,
  Clock,
  Tag,
  ArrowRight,
  ShieldCheck,
  FileDown,
  Sliders,
} from 'lucide-react';

interface CreatorInsightReportProps {
  analysis: AnalysisResult;
  concept?: IdeaForgeGeneratedConcept;
  onClose?: () => void;
  isStandalonePage?: boolean;
}

export const CreatorInsightReport: React.FC<CreatorInsightReportProps> = ({
  analysis,
  concept,
  onClose,
  isStandalonePage = false,
}) => {
  const report = generateCreatorInsightReport(analysis, concept);
  const [isCopied, setIsCopied] = useState(false);
  const [copyType, setCopyType] = useState<'markdown' | 'link' | 'json' | 'html' | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handlePrint = () => {
    const success = triggerPrint();
    if (!success) {
      handleDownloadHTML();
    }
  };

  const handleDownloadMarkdown = () => {
    const md = formatCreatorReportToMarkdown(report);
    const success = downloadFile(
      md,
      `creator-insight-report-${analysis.id}-${new Date().toISOString().slice(0, 10)}.md`,
      'text/markdown;charset=utf-8'
    );
    if (success) {
      setIsCopied(true);
      setCopyType('markdown');
      setTimeout(() => {
        setIsCopied(false);
        setCopyType(null);
      }, 2000);
    }
  };

  const handleDownloadJSON = () => {
    const success = downloadJsonObject(report, `creator-insight-report-${analysis.id}`);
    if (success) {
      setIsCopied(true);
      setCopyType('json');
      setTimeout(() => {
        setIsCopied(false);
        setCopyType(null);
      }, 2000);
    }
  };

  const handleDownloadHTML = () => {
    const reportElem = document.querySelector('.report-page');
    const contentHtml = reportElem
      ? reportElem.innerHTML
      : `<h2>Creator Insight Report - ${report.topic}</h2><p>${report.executive_brief}</p>`;
    const fullHtml = generateStandaloneHtmlReport(`Creator Insight - ${report.topic}`, contentHtml);
    const success = downloadFile(fullHtml, `creator-insight-${analysis.id}.html`, 'text/html;charset=utf-8');
    if (success) {
      setIsCopied(true);
      setCopyType('html');
      setTimeout(() => {
        setIsCopied(false);
        setCopyType(null);
      }, 2000);
    }
  };

  const handleCopyMarkdown = () => {
    const md = formatCreatorReportToMarkdown(report);
    navigator.clipboard?.writeText(md);
    setIsCopied(true);
    setCopyType('link');
    setTimeout(() => {
      setIsCopied(false);
      setCopyType(null);
    }, 2000);
  };

  return (
    <div className={`space-y-6 ${isStandalonePage ? 'max-w-5xl mx-auto p-4 sm:p-6 lg:p-8' : ''}`}>
      {/* Top Action Bar (hidden when printed) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8CFC2]/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#111111]">
            <Sparkles size={13} className="text-[#111111]" />
            <span>VOXENTRA CREATOR INTELLIGENCE</span>
            <span className="text-[#A39989]">/</span>
            <span className="text-[#7D786F] font-mono">{report.report_id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">
            Creator Insight Report
          </h1>
          <p className="text-xs text-[#5E5A54]">
            Evidence-based synthesis of trends, audience questions, conversation gaps, and content directions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#D8CFC2] hover:bg-[#F3EEE7] text-[#111111] text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            title="Open Granular Export Options (PDF, PNG, CSV, JSON, Markdown)"
          >
            <Download size={14} className="text-[#111111]" />
            <span>Export Options...</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#D8CFC2] hover:bg-[#F3EEE7] text-[#111111] text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            title="Copy formatted Markdown to Clipboard"
          >
            {isCopied && copyType === 'link' ? (
              <CheckCircle2 size={14} className="text-emerald-600" />
            ) : (
              <Copy size={14} />
            )}
            <span>{isCopied && copyType === 'link' ? 'Copied' : 'Copy MD'}</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#D8CFC2] hover:bg-[#F3EEE7] text-[#111111] text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            title="Download Markdown Report"
          >
            <Download size={14} />
            <span>{isCopied && copyType === 'markdown' ? 'Exported!' : 'Export MD'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-[#F8F5EF] text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer size={14} />
            <span>Print / PDF</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-white/70 hover:bg-white text-[#5E5A54] hover:text-[#111111] border border-[#D8CFC2] text-xs font-bold cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>

      <GranularExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        analysis={analysis}
        concept={concept}
        reportType="creator"
        targetElementSelector=".report-page"
      />

      {/* Main Printable Dossier Container */}
      <div className="report-page bg-[#FAF7F2] border border-[#D8CFC2] rounded-3xl p-6 sm:p-10 space-y-8 text-[#111111] shadow-sm">
        {/* Document Header & Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#D8CFC2]">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#111111] text-[#F8F5EF] text-[10px] font-mono uppercase tracking-widest font-extrabold">
              CONFIDENTIAL · CREATOR STRATEGY DOSSIER
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#111111]">
              Topic Focus: {report.topic}
            </h2>
            <div className="text-xs text-[#5E5A54] flex flex-wrap items-center gap-3">
              <span>Engine: <strong>Voxentra Social Intelligence</strong></span>
              <span>·</span>
              <span>Generated: {new Date(report.generated_at).toLocaleString()}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-[#111111] font-semibold">
                <ShieldCheck size={13} />
                k-Anonymity Guard (k≥50)
              </span>
            </div>
          </div>

          {/* Velocity Badge Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs text-right sm:text-left shrink-0">
            <div className="bg-white p-2.5 rounded-xl border border-[#D8CFC2] min-w-[130px]">
              <div className="text-[10px] text-[#7D786F] font-bold uppercase">Trend Velocity</div>
              <div className="text-sm font-black text-[#111111]">
                +{report.velocity_summary.acceleration_percentage}%
              </div>
              <div className="text-[10px] text-[#5E5A54]">{report.velocity_summary.velocity_label}</div>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-[#D8CFC2] min-w-[130px]">
              <div className="text-[10px] text-[#7D786F] font-bold uppercase">Observed Reach</div>
              <div className="text-sm font-black text-[#111111]">
                {(report.velocity_summary.total_views / 1000).toFixed(1)}k Views
              </div>
              <div className="text-[10px] text-[#5E5A54]">{report.velocity_summary.total_platforms_count} Platforms</div>
            </div>
          </div>
        </div>

        {/* 1. Executive Brief */}
        <section className="space-y-2.5">
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
            <Compass size={14} />
            <span>1. Executive Creator Brief</span>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-[#D8CFC2] space-y-2 leading-relaxed text-xs sm:text-sm text-[#111111] shadow-2xs">
            <p className="font-medium">{report.executive_brief}</p>
            <p className="text-[#5E5A54] text-xs">
              <strong>Strategic Opportunity:</strong> Creators who provide direct optical/forensic demonstrations and verifiable citations can capture significant search and discussion demand before secondary reactionary saturation occurs.
            </p>
          </div>
        </section>

        {/* 2. Emerging Trajectories & Narrative Signals */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
              <TrendingUp size={14} />
              <span>2. Emerging Topics & Trajectory Signals</span>
            </div>
            <span className="text-[11px] text-[#7D786F]">Ranked by discussion velocity</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {report.emerging_topics.map((t, idx) => (
              <div
                key={t.id}
                className="p-4 bg-white rounded-2xl border border-[#D8CFC2] space-y-2 shadow-2xs text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-[#111111]">
                    {idx + 1}. {t.name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8DFD2] text-[#111111] font-mono">
                    {t.growth_rate} ({t.velocity})
                  </span>
                </div>

                <p className="text-[#5E5A54] leading-relaxed">
                  {t.why_notable}
                </p>

                <div className="pt-2 border-t border-[#D8CFC2]/60 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    {t.platforms.map((p) => (
                      <PlatformIcon key={p} platform={p} size={13} />
                    ))}
                  </div>
                  <span className="text-[#7D786F] font-mono">{t.discussion_volume}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Narrative Evolution Shifts if detected */}
          {report.narrative_signals.some((n) => n.shift) && (
            <div className="mt-3 p-4 bg-[#FAF3E8] rounded-2xl border border-[#D8CFC2] space-y-2 text-xs">
              <div className="font-extrabold text-[#111111] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Clock size={13} />
                <span>Detected Narrative Shift Trajectories</span>
              </div>
              {report.narrative_signals
                .filter((n) => n.shift)
                .map((n) => (
                  <div key={n.id} className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div className="bg-white p-3 rounded-xl border border-[#D8CFC2]">
                      <span className="text-[10px] uppercase font-bold text-[#7D786F] block">Initial Phase (From)</span>
                      <span className="text-xs text-[#5E5A54] font-medium">{n.shift?.from}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-[#111111]/30">
                      <span className="text-[10px] uppercase font-bold text-[#111111] block">Current Shift (To)</span>
                      <span className="text-xs text-[#111111] font-bold">{n.shift?.to}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>

        {/* 3. Verified Audience Questions */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
              <HelpCircle size={14} />
              <span>3. What is the Audience Asking? (Verified Inquiries)</span>
            </div>
            <span className="text-[11px] text-[#7D786F]">Extracted from comment clusters</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {report.audience_questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 bg-white rounded-2xl border border-[#D8CFC2] space-y-2.5 shadow-2xs text-xs flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF3E8] text-[#845318] border border-[#9A6B2F]/30">
                      {q.urgency}
                    </span>
                    <span className="text-[10px] font-mono text-[#7D786F]">{q.frequency}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-[#111111] leading-snug">
                    "{q.question}"
                  </h4>
                  <p className="text-[11px] text-[#5E5A54] italic bg-[#FAF7F2] p-2 rounded-lg border border-[#D8CFC2]/60">
                    {q.context_sample}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#D8CFC2]/60 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1">
                    {q.platforms.map((p) => (
                      <PlatformIcon key={p} platform={p} size={12} />
                    ))}
                  </div>
                  <span className="text-[#5E5A54] font-medium">{q.discussion_volume}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Conversation Gaps & Information Blindspots */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
            <AlertCircle size={14} />
            <span>4. Identified Conversation Gaps</span>
          </div>

          <div className="space-y-3.5">
            {report.conversation_gaps.map((gap, idx) => (
              <div
                key={gap.id}
                className="p-5 bg-white rounded-2xl border border-[#D8CFC2] space-y-3 shadow-2xs text-xs"
              >
                <div className="flex items-center justify-between border-b border-[#D8CFC2]/60 pb-2">
                  <h4 className="font-extrabold text-sm text-[#111111]">
                    Gap {idx + 1}: {gap.title}
                  </h4>
                  <div className="flex items-center gap-1">
                    {gap.platforms.map((p) => (
                      <PlatformIcon key={p} platform={p} size={13} />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#7D786F] block">The Gap</span>
                    <p className="text-[#111111] leading-relaxed">{gap.gap}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#7D786F] block">Evidence</span>
                    <p className="text-[#5E5A54] leading-relaxed">{gap.evidence}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#7D786F] block">Audience Signal</span>
                    <p className="text-[#3A3834] italic bg-[#FAF7F2] p-2 rounded-lg border border-[#D8CFC2]/50 leading-relaxed">
                      {gap.audience_signal}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#7D786F] block">Explainer Angle</span>
                    <p className="text-[#111111] font-bold leading-relaxed">{gap.opportunity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Audience Sentiment & Emotion Signals */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
            <Flame size={14} />
            <span>5. Sentiment, Tone & Emotional Distribution</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            {/* Sentiment Breakdown */}
            <div className="p-4 bg-white rounded-2xl border border-[#D8CFC2] space-y-2 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-[#7D786F] block">Dominant Stance</span>
              <div className="font-extrabold text-sm text-[#111111]">
                {report.sentiment_intelligence.dominant_tone}
              </div>
              <div className="space-y-1.5 pt-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Positive / Curious:</span>
                  <strong>{report.sentiment_intelligence.breakdown.positive}%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Neutral / Informational:</span>
                  <strong>{report.sentiment_intelligence.breakdown.neutral}%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Critical / Skeptical:</span>
                  <strong>{report.sentiment_intelligence.breakdown.negative}%</strong>
                </div>
              </div>
            </div>

            {/* Emotional Drivers */}
            <div className="p-4 bg-white rounded-2xl border border-[#D8CFC2] space-y-2 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-[#7D786F] block">Top Emotional Drivers</span>
              <div className="space-y-2 pt-1 text-[11px]">
                {report.sentiment_intelligence.top_emotions.map((e) => (
                  <div key={e.emotion} className="space-y-0.5">
                    <div className="flex justify-between">
                      <span className="font-medium text-[#111111]">{e.emotion}</span>
                      <span className="font-mono text-[#7D786F]">{e.percentage}%</span>
                    </div>
                    <div className="w-full bg-[#E8DFD2] h-1.5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${e.percentage}%` }}
                        className="h-full bg-[#111111] rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Language Signals */}
            <div className="p-4 bg-white rounded-2xl border border-[#D8CFC2] space-y-2 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-[#7D786F] block">Language Sentiment Vectors</span>
              <div className="space-y-1.5 pt-1 text-[11px]">
                {report.sentiment_intelligence.language_signals.slice(0, 4).map((l) => (
                  <div key={l.language} className="flex justify-between items-center py-1 border-b border-[#D8CFC2]/40 last:border-0">
                    <span className="font-semibold text-[#111111]">{l.language}</span>
                    <span className="text-[10px] text-[#5E5A54]">{l.sentiment_label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6. Cross-Platform Strategy & Recommended Formats */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
            <Layers size={14} />
            <span>6. Cross-Platform Publishing Strategy</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
            {report.platform_strategy.map((p) => (
              <div
                key={p.platform}
                className="p-4 bg-white rounded-2xl border border-[#D8CFC2] space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between border-b border-[#D8CFC2]/60 pb-1.5">
                  <div className="flex items-center gap-2">
                    <PlatformIcon platform={p.platform} size={15} />
                    <span className="font-extrabold text-sm text-[#111111]">
                      {getPlatformName(p.platform)}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#D8CFC2]">
                    {p.activity_level} Activity
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="text-[11px]">
                    <span className="text-[#7D786F]">Format: </span>
                    <strong className="text-[#111111]">{p.recommended_format}</strong>
                  </div>
                  <div className="text-[11px]">
                    <span className="text-[#7D786F]">Peak Window: </span>
                    <span className="text-[#5E5A54]">{p.best_timing_signal}</span>
                  </div>
                  <div className="text-[11px]">
                    <span className="text-[#7D786F]">Audience: </span>
                    <span className="text-[#5E5A54]">{p.audience_focus}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Featured Forged Content Concept */}
        <section className="bg-[#111111] text-[#F8F5EF] rounded-3xl p-6 sm:p-8 space-y-5 border border-white/10 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D8CFC2] block">
                7. FEATURED GROUNDED CONCEPT · {report.featured_idea_concept.format}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#F8F5EF] mt-0.5">
                "{report.featured_idea_concept.title}"
              </h3>
            </div>
            <span className="text-xs font-mono text-[#A39989]">
              {report.featured_idea_concept.platform}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#D8CFC2] block">Opening Hook</span>
              <p className="text-sm font-bold italic text-[#F8F5EF]">
                "{report.featured_idea_concept.hook}"
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#D8CFC2] block">Core Angle</span>
              <p className="text-xs leading-relaxed text-[#F8F5EF]/90 font-normal">
                {report.featured_idea_concept.core_angle}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs pt-1 border-t border-white/10">
            <span className="text-[10px] uppercase font-bold text-[#D8CFC2] block">Step-by-Step Production Outline</span>
            <ul className="space-y-1.5 pl-1 text-[#F8F5EF]/90">
              {report.featured_idea_concept.outline_bullets.map((b, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D8CFC2] mt-1.5 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-1.5">
              {report.featured_idea_concept.suggested_tags.map((t) => (
                <span key={t} className="text-[11px] font-mono text-[#D8CFC2] bg-white/5 px-2 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </div>

            <div className="text-[11px] text-[#A39989]">
              CTA: <strong className="text-[#F8F5EF]">"{report.featured_idea_concept.call_to_action}"</strong>
            </div>
          </div>
        </section>

        {/* Document Footer Disclaimer */}
        <div className="pt-4 border-t border-[#D8CFC2] text-center text-[10px] text-[#7D786F] space-y-1">
          <p>
            <strong>Methodology & Ethics Disclaimer:</strong> Creator Lens recommendations are generated by analyzing aggregated, anonymized public discussion velocities, comment clustering, and context drift signatures. Voxentra does not guarantee algorithmic distribution or virality.
          </p>
          <p className="font-mono">
            VOXENTRA INTELLIGENCE SUITE · SIH FINALIST EDITION · {report.report_id}
          </p>
        </div>
      </div>
    </div>
  );
};
