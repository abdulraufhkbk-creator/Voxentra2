import { AnalysisResult } from '../types/analysis';
import { generateCreatorInsightReport } from './creatorIntelligence';
import * as htmlToImage from 'html-to-image';

/**
 * Initiates a browser download for text/json/markdown/csv content using Blob URLs.
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = 'text/plain;charset=utf-8'
): boolean {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      try {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (e) {
        // cleanup ignore
      }
    }, 250);
    return true;
  } catch (error) {
    console.error('Download failed via Blob URL:', error);
    try {
      const dataUri = `data:${mimeType},` + encodeURIComponent(content);
      const link = document.createElement('a');
      link.href = dataUri;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => document.body.removeChild(link), 250);
      return true;
    } catch (fallbackError) {
      console.error('Fallback download also failed:', fallbackError);
      return false;
    }
  }
}

/**
 * Downloads a structured JSON object.
 */
export function downloadJsonObject(data: any, filename: string): boolean {
  const jsonStr = JSON.stringify(data, null, 2);
  return downloadFile(
    jsonStr,
    filename.endsWith('.json') ? filename : `${filename}.json`,
    'application/json;charset=utf-8'
  );
}

/**
 * Triggers document printing with iframe safety.
 */
export function triggerPrint(): boolean {
  try {
    window.print();
    return true;
  } catch (error) {
    console.warn('Direct window.print() failed or restricted by sandbox:', error);
    return false;
  }
}

/**
 * Generates CSV string from tabular array data.
 */
function toCsvString(headers: string[], rows: (string | number)[][]): string {
  const escapeCsv = (val: string | number) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerRow = headers.map(escapeCsv).join(',');
  const dataRows = rows.map((r) => r.map(escapeCsv).join(','));
  return [headerRow, ...dataRows].join('\r\n');
}

/**
 * Generates CSV for Audience Segments & Stances.
 */
export function generateAudienceCsv(analysis: AnalysisResult): string {
  const headers = ['Segment ID', 'Segment Name', 'Share (%)', 'Age Band', 'Dominant Stance', 'Key Drivers'];
  const rows = analysis.audience.segments.map((s) => [
    s.id,
    s.name,
    s.share_percentage,
    s.age_band,
    s.dominant_stance,
    s.key_drivers,
  ]);
  return toCsvString(headers, rows);
}

/**
 * Generates CSV for Cross-Platform Propagation.
 */
export function generatePlatformsCsv(analysis: AnalysisResult): string {
  const headers = [
    'Platform',
    'Post Count',
    'Total Engagement',
    'Propagation Delay',
    'Sentiment Tone',
    'Primary Narrative',
    'First Appeared',
    'Sample Content',
  ];
  const rows = analysis.cross_platform.platforms.map((p) => [
    p.platform.toUpperCase(),
    p.post_count,
    p.total_engagement,
    p.propagation_delay,
    p.sentiment_tone,
    p.primary_narrative,
    p.first_appeared,
    p.sample_content,
  ]);
  return toCsvString(headers, rows);
}

/**
 * Generates CSV for Trends & Narratives.
 */
export function generateTrendsCsv(analysis: AnalysisResult): string {
  const headers = ['Topic / Keyword', 'Volume / Weight', 'Growth / Trajectory', 'Sentiment', 'Category'];
  const rows = [
    ...analysis.trends.trending_topics.map((t) => [t.name, t.volume, `+${t.growth}%`, t.sentiment, 'Trending Topic']),
    ...analysis.trends.viral_keywords.map((k) => [k.keyword, k.weight, k.trajectory, 'N/A', k.category]),
  ];
  return toCsvString(headers, rows);
}

/**
 * Generates CSV for Content Risk & Forensic Signals.
 */
export function generateRiskSignalsCsv(analysis: AnalysisResult): string {
  const headers = ['Signal ID', 'Category', 'Title', 'Severity', 'Description', 'Technical Details'];
  const rows = analysis.risk.signals.map((sig) => [
    sig.id,
    sig.category.toUpperCase(),
    sig.title,
    sig.severity.toUpperCase(),
    sig.description,
    sig.technical_details,
  ]);
  return toCsvString(headers, rows);
}

/**
 * Generates comprehensive Multi-Table CSV.
 */
export function generateFullReportCsv(analysis: AnalysisResult): string {
  const creatorIntel = generateCreatorInsightReport(analysis);

  let csvContent = `=== VOXENTRA INTELLIGENCE EXPORT: ${analysis.title} ===\r\n`;
  csvContent += `Report ID: ${analysis.id}\r\n`;
  csvContent += `Generated At: ${new Date().toISOString()}\r\n`;
  csvContent += `Risk Level: ${analysis.risk.risk_level}\r\n`;
  csvContent += `Confidence: ${analysis.risk.confidence}\r\n\r\n`;

  csvContent += `--- SECTION 1: AUDIENCE DEMOGRAPHICS ---\r\n`;
  csvContent += generateAudienceCsv(analysis) + `\r\n\r\n`;

  csvContent += `--- SECTION 2: CROSS-PLATFORM FOOTPRINT ---\r\n`;
  csvContent += generatePlatformsCsv(analysis) + `\r\n\r\n`;

  csvContent += `--- SECTION 3: TOPICS & KEYWORDS ---\r\n`;
  csvContent += generateTrendsCsv(analysis) + `\r\n\r\n`;

  csvContent += `--- SECTION 4: CONTENT RISK & FORENSIC SIGNALS ---\r\n`;
  csvContent += generateRiskSignalsCsv(analysis) + `\r\n\r\n`;

  csvContent += `--- SECTION 5: AUDIENCE QUESTIONS (CREATOR LENS) ---\r\n`;
  const qHeaders = ['Question', 'Urgency', 'Frequency', 'Platforms', 'Observed Volume', 'Context Quote'];
  const qRows = creatorIntel.audience_questions.map((q) => [
    q.question,
    q.urgency,
    q.frequency,
    q.platforms.join('; '),
    q.discussion_volume,
    q.context_sample,
  ]);
  csvContent += toCsvString(qHeaders, qRows) + `\r\n\r\n`;

  csvContent += `--- SECTION 6: CONVERSATION GAPS ---\r\n`;
  const gapHeaders = ['Gap Title', 'The Missing Piece', 'Supporting Evidence', 'Audience Signal', 'Explainer Angle'];
  const gapRows = creatorIntel.conversation_gaps.map((g) => [
    g.title,
    g.gap,
    g.evidence,
    g.audience_signal,
    g.opportunity,
  ]);
  csvContent += toCsvString(gapHeaders, gapRows);

  return csvContent;
}

/**
 * Exports a DOM node as a high-resolution PNG image.
 */
export async function exportElementAsPng(element: HTMLElement, filename: string): Promise<boolean> {
  try {
    const dataUrl = await htmlToImage.toPng(element, {
      quality: 0.98,
      backgroundColor: '#FAF7F2',
      pixelRatio: 2,
      filter: (node) => {
        if (node instanceof HTMLElement && node.classList.contains('no-print')) {
          return false;
        }
        return true;
      },
    });

    const link = document.createElement('a');
    link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    link.href = dataUrl;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      try {
        document.body.removeChild(link);
      } catch (e) {
        // ignore
      }
    }, 250);
    return true;
  } catch (err) {
    console.error('Failed to export element as PNG:', err);
    return false;
  }
}

/**
 * Generates a clean, self-contained standalone HTML document for offline viewing, archiving, or printing to PDF.
 */
export function generateStandaloneHtmlReport(title: string, reportBodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Voxentra Intelligence Report</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background-color: #FAF7F2;
      color: #111111;
      line-height: 1.6;
      padding: 2.5rem 1.5rem;
    }
    .report-wrapper {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #D8CFC2;
      border-radius: 24px;
      padding: 2.5rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.03);
    }
    .no-print-bar {
      max-width: 900px;
      margin: 0 auto 1.5rem auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1rem;
      border-bottom: 1px solid #D8CFC2;
    }
    .btn {
      background: #111111;
      color: #F8F5EF;
      border: none;
      padding: 0.6rem 1.2rem;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
    }
    .btn:hover { background: #2A2A2A; }
    @media print {
      body { background: #ffffff !important; padding: 0 !important; }
      .no-print-bar { display: none !important; }
      .report-wrapper { border: none !important; box-shadow: none !important; padding: 0 !important; width: 100% !important; max-width: 100% !important; }
    }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <div>
      <strong style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em;">VOXENTRA OFFLINE DOSSIER</strong>
      <div style="font-size: 0.75rem; color: #5E5A54;">Open in any browser · Ready to print / save as PDF</div>
    </div>
    <button class="btn" onclick="window.print()">Print / Save as PDF</button>
  </div>
  <div class="report-wrapper">
    ${reportBodyHtml}
  </div>
</body>
</html>`;
}

export type ReportExportFormat = 'print' | 'pdf' | 'json' | 'html' | 'csv' | 'markdown' | 'md' | 'blob';

export interface ExportReportOptions {
  format: ReportExportFormat | string;
  analysis: AnalysisResult;
  reportType?: 'executive' | 'creator';
  filename?: string;
  targetElementSelector?: string;
  download?: boolean;
}

export interface ExportReportResult {
  success: boolean;
  format: string;
  filename?: string;
  blob?: Blob;
  error?: string;
}

/**
 * Universal export utility for the ReportsView component.
 * Triggers browser printing or generates a mock/real file blob based on the selected format.
 */
export async function exportReport(options: ExportReportOptions): Promise<ExportReportResult> {
  const {
    format,
    analysis,
    reportType = 'executive',
    filename: customFilename,
    targetElementSelector = '.report-page',
    download = true,
  } = options;

  const baseFilename = customFilename || `voxentra-${reportType}-report-${analysis.id}`;

  try {
    switch (format.toLowerCase()) {
      case 'print':
      case 'pdf': {
        const printSuccess = triggerPrint();
        if (printSuccess) {
          return { success: true, format: 'print' };
        }
        // Fallback: If print is blocked (e.g. within restricted iframe), generate standalone HTML blob
        const targetEl = document.querySelector(targetElementSelector);
        const innerHtml = targetEl ? targetEl.innerHTML : `<h1>${analysis.title}</h1><p>${analysis.risk.overall_assessment}</p>`;
        const fullHtml = generateStandaloneHtmlReport(`Intelligence Report - ${analysis.title}`, innerHtml);
        const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
        const filename = `${baseFilename}.html`;
        if (download) {
          downloadFile(fullHtml, filename, 'text/html;charset=utf-8');
        }
        return { success: true, format: 'html-fallback', filename, blob };
      }

      case 'json': {
        const jsonContent = JSON.stringify(analysis, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
        const filename = `${baseFilename}.json`;
        if (download) {
          downloadFile(jsonContent, filename, 'application/json;charset=utf-8');
        }
        return { success: true, format: 'json', filename, blob };
      }

      case 'html': {
        const targetEl = document.querySelector(targetElementSelector);
        const innerHtml = targetEl ? targetEl.innerHTML : `<h1>${analysis.title}</h1><p>${analysis.risk.overall_assessment}</p>`;
        const fullHtml = generateStandaloneHtmlReport(`Voxentra Report - ${analysis.title}`, innerHtml);
        const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
        const filename = `${baseFilename}.html`;
        if (download) {
          downloadFile(fullHtml, filename, 'text/html;charset=utf-8');
        }
        return { success: true, format: 'html', filename, blob };
      }

      case 'csv': {
        const csvContent = generateFullReportCsv(analysis);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        const filename = `${baseFilename}.csv`;
        if (download) {
          downloadFile(csvContent, filename, 'text/csv;charset=utf-8');
        }
        return { success: true, format: 'csv', filename, blob };
      }

      case 'markdown':
      case 'md': {
        const markdownContent = `# VOXENTRA INTELLIGENCE DOSSIER: ${analysis.title}
*ID: ${analysis.id.toUpperCase()} | Engine: ${analysis.ai_engine} | Date: ${new Date(analysis.timestamp).toUTCString()}*

## 1. Executive Summary & Core Assessment
${analysis.risk.overall_assessment}

- **Platform**: ${analysis.target_platform.toUpperCase()}
- **Risk Level**: ${analysis.risk.risk_level}
- **Confidence Rating**: ${analysis.risk.confidence}
- **Data Source**: ${analysis.data_source_type}

## 2. Core Strategic Intelligence Answers
- **What is happening**: ${analysis.answers.what_is_happening}
- **Who is driving it**: ${analysis.answers.who_is_driving_it}
- **How is it spreading**: ${analysis.answers.how_is_it_spreading}
- **What are people feeling**: ${analysis.answers.what_are_people_feeling}
- **Main Narratives**: ${analysis.answers.what_are_the_main_narratives}

## 3. Forensic & Risk Signals
${analysis.risk.signals.map(s => `### [${s.severity.toUpperCase()}] ${s.title}
${s.description}
*Technical Details: ${s.technical_details}*
`).join('\n')}

## 4. Audience & Demographic Segments
${analysis.audience.segments.map(s => `- **${s.name}** (${s.share_percentage}%): Stance: ${s.dominant_stance} | Key Drivers: ${s.key_drivers}`).join('\n')}
`;
        const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
        const filename = `${baseFilename}.md`;
        if (download) {
          downloadFile(markdownContent, filename, 'text/markdown;charset=utf-8');
        }
        return { success: true, format: 'markdown', filename, blob };
      }

      case 'blob':
      default: {
        // Generic mock / binary payload blob representation
        const payload = {
          metadata: {
            title: analysis.title,
            id: analysis.id,
            exportedAt: new Date().toISOString(),
            engine: analysis.ai_engine,
            format,
          },
          data: analysis,
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/octet-stream' });
        const filename = `${baseFilename}.bin`;
        if (download) {
          downloadFile(JSON.stringify(payload, null, 2), filename, 'application/octet-stream');
        }
        return { success: true, format: 'blob', filename, blob };
      }
    }
  } catch (err: any) {
    console.error(`exportReport error for format "${format}":`, err);
    return {
      success: false,
      format,
      error: err?.message || 'Unknown export error occurred',
    };
  }
}

