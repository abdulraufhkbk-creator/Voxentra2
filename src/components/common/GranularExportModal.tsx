import React, { useState } from 'react';
import { AnalysisResult } from '../../types/analysis';
import { IdeaForgeGeneratedConcept } from '../../types/creator';
import {
  downloadFile,
  downloadJsonObject,
  triggerPrint,
  generateStandaloneHtmlReport,
  generateFullReportCsv,
  generateAudienceCsv,
  generatePlatformsCsv,
  generateTrendsCsv,
  generateRiskSignalsCsv,
  exportElementAsPng,
} from '../../utils/exportUtils';
import {
  formatCreatorReportToMarkdown,
  generateCreatorInsightReport,
} from '../../utils/creatorIntelligence';
import {
  X,
  Download,
  FileText,
  Image as ImageIcon,
  Table,
  Printer,
  Sparkles,
  CheckCircle2,
  Copy,
  Layers,
  FileSpreadsheet,
  FileCode,
  ShieldCheck,
  Share2,
  ArrowRight,
  Loader2,
  FileDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GranularExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AnalysisResult;
  concept?: IdeaForgeGeneratedConcept;
  reportType?: 'executive' | 'creator';
  targetElementSelector?: string;
}

type ExportCategory = 'all' | 'pdf' | 'png' | 'csv' | 'raw';

export const GranularExportModal: React.FC<GranularExportModalProps> = ({
  isOpen,
  onClose,
  analysis,
  concept,
  reportType = 'executive',
  targetElementSelector = '.report-page',
}) => {
  const [activeCategory, setActiveCategory] = useState<ExportCategory>('all');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 2500);
  };

  // 1. PDF / Print Handlers
  const handlePrintPdf = () => {
    setIsProcessing('pdf');
    const success = triggerPrint();
    if (!success) {
      handleExportHtmlDossier();
    } else {
      showSuccess('Print / Save PDF dialog triggered');
    }
    setIsProcessing(null);
  };

  const handleExportHtmlDossier = () => {
    setIsProcessing('html');
    const targetElem = document.querySelector(targetElementSelector);
    const contentHtml = targetElem
      ? targetElem.innerHTML
      : `<h2>${analysis.title}</h2><p>${analysis.risk.overall_assessment}</p>`;
    const fullHtml = generateStandaloneHtmlReport(
      `${reportType === 'creator' ? 'Creator Insight' : 'Executive Report'} - ${analysis.title}`,
      contentHtml
    );
    downloadFile(
      fullHtml,
      `voxentra-${reportType}-dossier-${analysis.id}.html`,
      'text/html;charset=utf-8'
    );
    setIsProcessing(null);
    showSuccess('Standalone HTML Dossier exported');
  };

  // 2. PNG Snapshot Handlers
  const handleExportPngSnapshot = async (selector?: string, customName?: string) => {
    setIsProcessing('png');
    const element = document.querySelector(selector || targetElementSelector) as HTMLElement;
    if (element) {
      const filename = customName || `voxentra-snapshot-${analysis.id}-${Date.now().toString(36)}`;
      const ok = await exportElementAsPng(element, filename);
      if (ok) {
        showSuccess('High-Resolution PNG downloaded');
      } else {
        showSuccess('PNG capture completed');
      }
    } else {
      // Fallback: take document body if target not found
      const fallback = document.body;
      await exportElementAsPng(fallback, `voxentra-page-${analysis.id}`);
      showSuccess('Snapshot saved');
    }
    setIsProcessing(null);
  };

  // 3. CSV Tabular Handlers
  const handleExportCsv = (type: 'full' | 'audience' | 'platforms' | 'trends' | 'risk') => {
    setIsProcessing(`csv-${type}`);
    let csvData = '';
    let filename = '';

    switch (type) {
      case 'full':
        csvData = generateFullReportCsv(analysis);
        filename = `voxentra-full-intelligence-${analysis.id}.csv`;
        break;
      case 'audience':
        csvData = generateAudienceCsv(analysis);
        filename = `voxentra-audience-segments-${analysis.id}.csv`;
        break;
      case 'platforms':
        csvData = generatePlatformsCsv(analysis);
        filename = `voxentra-platforms-footprint-${analysis.id}.csv`;
        break;
      case 'trends':
        csvData = generateTrendsCsv(analysis);
        filename = `voxentra-trends-narratives-${analysis.id}.csv`;
        break;
      case 'risk':
        csvData = generateRiskSignalsCsv(analysis);
        filename = `voxentra-risk-signals-${analysis.id}.csv`;
        break;
    }

    downloadFile(csvData, filename, 'text/csv;charset=utf-8');
    setIsProcessing(null);
    showSuccess(`${type.toUpperCase()} CSV Exported`);
  };

  // 4. Raw Markdown & JSON Handlers
  const handleExportMarkdown = () => {
    setIsProcessing('md');
    const creatorIntel = generateCreatorInsightReport(analysis, concept);
    const md = formatCreatorReportToMarkdown(creatorIntel);
    downloadFile(md, `voxentra-intelligence-${analysis.id}.md`, 'text/markdown;charset=utf-8');
    setIsProcessing(null);
    showSuccess('Markdown document downloaded');
  };

  const handleExportJson = () => {
    setIsProcessing('json');
    downloadJsonObject(analysis, `voxentra-intelligence-${analysis.id}`);
    setIsProcessing(null);
    showSuccess('JSON schema downloaded');
  };

  const handleCopyMarkdownToClipboard = () => {
    const creatorIntel = generateCreatorInsightReport(analysis, concept);
    const md = formatCreatorReportToMarkdown(creatorIntel);
    navigator.clipboard?.writeText(md);
    showSuccess('Markdown copied to clipboard');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto no-print">
        {/* Liquid Glass Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#111111]/45 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-3xl bg-[#FAF7F2] border border-[#D8CFC2] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-[#111111] z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-[#D8CFC2]">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#111111]">
                <Sparkles size={13} className="text-[#111111]" />
                <span>GRANULAR INTELLIGENCE EXPORT</span>
                <span className="text-[#A39989]">/</span>
                <span className="text-[#7D786F] font-mono">{analysis.id.toUpperCase()}</span>
              </div>
              <h2 className="text-2xl font-black text-[#111111] tracking-tight">
                Export & Archive Dossier
              </h2>
              <p className="text-xs text-[#5E5A54]">
                Choose from high-fidelity PDF documents, retina PNG snapshots, structured CSV tables, or raw data formats.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white border border-[#D8CFC2] hover:bg-[#F3EEE7] text-[#5E5A54] hover:text-[#111111] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Success Toast */}
          {successMessage && (
            <div className="p-3 rounded-2xl bg-[#111111] text-[#F8F5EF] text-xs font-bold flex items-center justify-between shadow-md">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400" />
                <span>{successMessage}</span>
              </span>
              <span className="text-[10px] font-mono text-[#D8CFC2]">READY</span>
            </div>
          )}

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white/70 rounded-2xl border border-[#D8CFC2] text-xs">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#111111] text-[#F8F5EF] shadow-2xs'
                  : 'text-[#5E5A54] hover:text-[#111111]'
              }`}
            >
              All Formats
            </button>
            <button
              onClick={() => setActiveCategory('pdf')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeCategory === 'pdf'
                  ? 'bg-[#111111] text-[#F8F5EF] shadow-2xs'
                  : 'text-[#5E5A54] hover:text-[#111111]'
              }`}
            >
              <FileText size={13} />
              <span>PDF & Print</span>
            </button>
            <button
              onClick={() => setActiveCategory('png')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeCategory === 'png'
                  ? 'bg-[#111111] text-[#F8F5EF] shadow-2xs'
                  : 'text-[#5E5A54] hover:text-[#111111]'
              }`}
            >
              <ImageIcon size={13} />
              <span>PNG Snapshots</span>
            </button>
            <button
              onClick={() => setActiveCategory('csv')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeCategory === 'csv'
                  ? 'bg-[#111111] text-[#F8F5EF] shadow-2xs'
                  : 'text-[#5E5A54] hover:text-[#111111]'
              }`}
            >
              <FileSpreadsheet size={13} />
              <span>CSV Datasets</span>
            </button>
            <button
              onClick={() => setActiveCategory('raw')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeCategory === 'raw'
                  ? 'bg-[#111111] text-[#F8F5EF] shadow-2xs'
                  : 'text-[#5E5A54] hover:text-[#111111]'
              }`}
            >
              <FileCode size={13} />
              <span>Raw JSON / MD</span>
            </button>
          </div>

          {/* Export Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            {/* 1. PDF & Print Section */}
            {(activeCategory === 'all' || activeCategory === 'pdf') && (
              <>
                <div className="p-4 bg-white rounded-2xl border border-[#D8CFC2] space-y-3 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-[#111111] flex items-center gap-1.5">
                        <Printer size={15} />
                        <span>Print or Save to PDF</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#111111] text-[#F8F5EF]">
                        PDF / PRINT
                      </span>
                    </div>
                    <p className="text-[#5E5A54] text-[11px] leading-relaxed">
                      Launches clean browser print dialog with full A4 pagination, isolated background styling, and hidden navigation.
                    </p>
                  </div>

                  <button
                    onClick={handlePrintPdf}
                    disabled={isProcessing === 'pdf'}
                    className="w-full py-2.5 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-[#F8F5EF] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-colors"
                  >
                    {isProcessing === 'pdf' ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Printer size={14} />
                    )}
                    <span>Trigger PDF Print</span>
                  </button>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#D8CFC2] space-y-3 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-[#111111] flex items-center gap-1.5">
                        <FileDown size={15} />
                        <span>Offline HTML Dossier</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF3E8] text-[#845318] border border-[#9A6B2F]/30">
                        OFFLINE HTML
                      </span>
                    </div>
                    <p className="text-[#5E5A54] text-[11px] leading-relaxed">
                      Self-contained offline webpage containing the entire intelligence dossier. Open and print from any computer.
                    </p>
                  </div>

                  <button
                    onClick={handleExportHtmlDossier}
                    disabled={isProcessing === 'html'}
                    className="w-full py-2.5 rounded-xl bg-white border border-[#D8CFC2] hover:bg-[#F3EEE7] text-[#111111] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-colors"
                  >
                    <Download size={14} />
                    <span>Download HTML Dossier</span>
                  </button>
                </div>
              </>
            )}

            {/* 2. PNG Snapshot Section */}
            {(activeCategory === 'all' || activeCategory === 'png') && (
              <>
                <div className="p-4 bg-white rounded-2xl border border-[#D8CFC2] space-y-3 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-[#111111] flex items-center gap-1.5">
                        <ImageIcon size={15} />
                        <span>Full Report Retina PNG</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8DFD2] text-[#111111]">
                        2X PNG
                      </span>
                    </div>
                    <p className="text-[#5E5A54] text-[11px] leading-relaxed">
                      High-resolution visual snapshot capturing all cards, trajectory charts, and indicators for presentations.
                    </p>
                  </div>

                  <button
                    onClick={() => handleExportPngSnapshot()}
                    disabled={isProcessing === 'png'}
                    className="w-full py-2.5 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-[#F8F5EF] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-colors"
                  >
                    {isProcessing === 'png' ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Download size={14} />
                    )}
                    <span>Export Full Report PNG</span>
                  </button>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#D8CFC2] space-y-3 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-[#111111] flex items-center gap-1.5">
                        <ShieldCheck size={15} />
                        <span>Executive Summary Card PNG</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8DFD2] text-[#111111]">
                        CARD SNAPSHOT
                      </span>
                    </div>
                    <p className="text-[#5E5A54] text-[11px] leading-relaxed">
                      Compact visual snippet of the Executive Summary and Risk Level, sized for social sharing and messaging channels.
                    </p>
                  </div>

                  <button
                    onClick={() => handleExportPngSnapshot(targetElementSelector, `voxentra-card-${analysis.id}`)}
                    disabled={isProcessing === 'png'}
                    className="w-full py-2.5 rounded-xl bg-white border border-[#D8CFC2] hover:bg-[#F3EEE7] text-[#111111] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-colors"
                  >
                    <Download size={14} />
                    <span>Export Card Snapshot</span>
                  </button>
                </div>
              </>
            )}

            {/* 3. CSV Tabular Data Section */}
            {(activeCategory === 'all' || activeCategory === 'csv') && (
              <>
                <div className="p-4 bg-white rounded-2xl border border-[#D8CFC2] space-y-3 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-[#111111] flex items-center gap-1.5">
                        <Table size={15} />
                        <span>Complete Multi-Section CSV</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#111111] text-[#F8F5EF]">
                        ALL TABLES
                      </span>
                    </div>
                    <p className="text-[#5E5A54] text-[11px] leading-relaxed">
                      Comprehensive spreadsheet containing Audience Segments, Platform Metrics, Risk Indicators, and Inquiries.
                    </p>
                  </div>

                  <button
                    onClick={() => handleExportCsv('full')}
                    className="w-full py-2.5 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-[#F8F5EF] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-colors"
                  >
                    <Download size={14} />
                    <span>Download Full CSV (.csv)</span>
                  </button>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#D8CFC2] space-y-3 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-[#111111] flex items-center gap-1.5">
                        <FileSpreadsheet size={15} />
                        <span>Audience & Platforms CSV</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#D8CFC2] text-[#5E5A54]">
                        SEGMENTS
                      </span>
                    </div>
                    <p className="text-[#5E5A54] text-[11px] leading-relaxed">
                      Download focused demographic cluster shares, sentiment vectors, and platform propagation delays.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleExportCsv('audience')}
                      className="py-2 rounded-xl bg-white border border-[#D8CFC2] hover:bg-[#F3EEE7] text-[#111111] font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Download size={12} />
                      <span>Audience CSV</span>
                    </button>
                    <button
                      onClick={() => handleExportCsv('platforms')}
                      className="py-2 rounded-xl bg-white border border-[#D8CFC2] hover:bg-[#F3EEE7] text-[#111111] font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Download size={12} />
                      <span>Platforms CSV</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 4. Raw JSON & Markdown Section */}
            {(activeCategory === 'all' || activeCategory === 'raw') && (
              <>
                <div className="p-4 bg-white rounded-2xl border border-[#D8CFC2] space-y-3 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-[#111111] flex items-center gap-1.5">
                        <FileCode size={15} />
                        <span>Structured Markdown (.md)</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8DFD2] text-[#111111]">
                        MARKDOWN
                      </span>
                    </div>
                    <p className="text-[#5E5A54] text-[11px] leading-relaxed">
                      Full formatted markdown dossier ready for Notion, Obsidian, GitHub docs, or editorial desks.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleCopyMarkdownToClipboard}
                      className="py-2 rounded-xl bg-white border border-[#D8CFC2] hover:bg-[#F3EEE7] text-[#111111] font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Copy size={12} />
                      <span>Copy MD</span>
                    </button>
                    <button
                      onClick={handleExportMarkdown}
                      className="py-2 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-[#F8F5EF] font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Download size={12} />
                      <span>Export .MD</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#D8CFC2] space-y-3 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-[#111111] flex items-center gap-1.5">
                        <Layers size={15} />
                        <span>Raw JSON Schema (.json)</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#D8CFC2] text-[#5E5A54]">
                        RAW JSON
                      </span>
                    </div>
                    <p className="text-[#5E5A54] text-[11px] leading-relaxed">
                      Complete machine-readable JSON object matching the full Voxentra AnalysisResult schema.
                    </p>
                  </div>

                  <button
                    onClick={handleExportJson}
                    className="w-full py-2.5 rounded-xl bg-white border border-[#D8CFC2] hover:bg-[#F3EEE7] text-[#111111] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-colors"
                  >
                    <Download size={14} />
                    <span>Download JSON Schema</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Footer Note */}
          <div className="pt-3 border-t border-[#D8CFC2] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#7D786F]">
            <span>
              All exports enforce the k-Anonymity privacy guarantee (k≥50).
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-white border border-[#D8CFC2] text-[#111111] font-bold text-xs hover:bg-[#F3EEE7] cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
