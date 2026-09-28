import React, { useState } from 'react';
import { AnalysisResult, SocialPlatform } from '../../types/analysis';
import {
  CreatorContentFormat,
  CreatorObjective,
  CreatorTone,
  IdeaForgeConfig,
  IdeaForgeGeneratedConcept,
} from '../../types/creator';
import {
  deriveCreatorIntelligence,
  generateIdeaForgeConcept,
} from '../../utils/creatorIntelligence';
import { PlatformIcon, getPlatformName } from '../common/PlatformIcon';
import { CreatorInsightReport } from '../creator/CreatorInsightReport';
import {
  Sparkles,
  TrendingUp,
  HelpCircle,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  Filter,
  Copy,
  Check,
  Download,
  Printer,
  FileText,
  Share2,
  RefreshCw,
  Compass,
  MessageSquare,
  Layers,
  Flame,
  CheckCircle2,
  Sliders,
  Eye,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { EmptyAnalysisState } from '../common/EmptyAnalysisState';

interface CreatorLensViewProps {
  analysis: AnalysisResult | null;
  onNavigateToAnalyze?: () => void;
}

const PLATFORM_FILTERS: Array<{ key: SocialPlatform | 'all'; label: string }> = [
  { key: 'all', label: 'All Platforms' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'x', label: 'X (Twitter)' },
  { key: 'telegram', label: 'Telegram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'reddit', label: 'Reddit' },
];

const TIME_FILTERS = ['Today', 'Last 7 days', 'Last 30 days', 'All-Time'];

const LANGUAGE_FILTERS = [
  'All Languages',
  'English',
  'Hindi',
  'Kannada',
  'Tamil',
  'Telugu',
  'Malayalam',
  'Bengali',
  'Hinglish',
  'Tanglish',
];

const FORMAT_OPTIONS: CreatorContentFormat[] = [
  'Short video / Reel / Short',
  'Long-form YouTube video',
  'Carousel / Slides',
  'X / Threads Post Sequence',
  'Explainer Breakdown',
  'News Analysis & Debunk',
  'Educational Walkthrough',
  'FAQ / Q&A Spotlight',
  'Infographic / Visual Summary',
];

const TONE_OPTIONS: CreatorTone[] = [
  'Educational & Objective',
  'Forensic & Analytical',
  'Conversational & Engaging',
  'Authoritative & Investigative',
  'Concise & Fast-Paced',
  'Empathetic & Clarifying',
];

const OBJECTIVE_OPTIONS: CreatorObjective[] = [
  'Demystify Misleading Claims',
  'Answer Top Audience Questions',
  'Fill an Unaddressed Information Gap',
  'Explain Technical / Complex Concepts',
  'Provide Actionable Verification Checklist',
  'Highlight Emerging Innovations',
];

export const CreatorLensView: React.FC<CreatorLensViewProps> = ({ analysis, onNavigateToAnalyze }) => {
  if (!analysis) {
    return (
      <EmptyAnalysisState
        title="No Creator Intelligence Available"
        description="Ingest real video content or submit social context to generate Creator Lens opportunity insights, Idea Forge concepts, and conversation gap analysis."
        onAction={onNavigateToAnalyze}
      />
    );
  }

  const intel = deriveCreatorIntelligence(analysis);

  // Filters state
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<SocialPlatform | 'all'>('all');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('Today');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState('All Languages');
  const [selectedFormatFilter, setSelectedFormatFilter] = useState<string>('All');

  // Active topic focus
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const activeTopic = intel.emergingTopics[activeTopicIndex] || intel.emergingTopics[0];

  // Idea Forge State
  const [forgeConfig, setForgeConfig] = useState<IdeaForgeConfig>({
    topic: activeTopic.name,
    platform: 'all',
    audience: 'Everyday social media consumers & community members',
    content_format: 'Short video / Reel / Short',
    tone: 'Educational & Objective',
    objective: 'Demystify Misleading Claims',
    custom_angle: '',
    selected_gap_id: intel.conversationGaps[0]?.id,
  });

  const [generatedConcept, setGeneratedConcept] = useState<IdeaForgeGeneratedConcept>(() =>
    generateIdeaForgeConcept(analysis, {
      topic: activeTopic.name,
      platform: 'all',
      audience: 'Everyday social media consumers & community members',
      content_format: 'Short video / Reel / Short',
      tone: 'Educational & Objective',
      objective: 'Demystify Misleading Claims',
      selected_gap_id: intel.conversationGaps[0]?.id,
    })
  );

  const [viewMode, setViewMode] = useState<'workbench' | 'report'>('workbench');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Filter questions & gaps based on platform filter
  const filteredQuestions = intel.audienceQuestions.filter((q) => {
    if (selectedPlatformFilter === 'all') return true;
    return q.platforms.includes(selectedPlatformFilter);
  });

  const filteredGaps = intel.conversationGaps.filter((g) => {
    if (selectedPlatformFilter === 'all') return true;
    return g.platforms.includes(selectedPlatformFilter);
  });

  const filteredOpportunities = intel.creatorOpportunities.filter((opp) => {
    if (selectedPlatformFilter === 'all') return true;
    return opp.relevant_platforms.includes(selectedPlatformFilter);
  });

  const handleGenerateConcept = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const result = generateIdeaForgeConcept(analysis, forgeConfig);
      setGeneratedConcept(result);
      setIsGenerating(false);
    }, 400);
  };

  const handlePickQuestionForForge = (q: (typeof intel.audienceQuestions)[0]) => {
    setForgeConfig((prev) => ({
      ...prev,
      custom_angle: `Directly address the audience question: "${q.question}" with clear evidence.`,
      objective: 'Answer Top Audience Questions',
    }));
    // Scroll smoothly to Idea Forge
    const el = document.getElementById('idea-forge-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePickGapForForge = (gap: (typeof intel.conversationGaps)[0]) => {
    setForgeConfig((prev) => ({
      ...prev,
      selected_gap_id: gap.id,
      custom_angle: gap.opportunity,
      objective: 'Fill an Unaddressed Information Gap',
      content_format: gap.suggested_formats[0] || prev.content_format,
    }));
    const el = document.getElementById('idea-forge-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopyConcept = () => {
    const text = `TITLE: ${generatedConcept.title}
HOOK: ${generatedConcept.hook}
FORMAT: ${generatedConcept.format}
PLATFORM: ${generatedConcept.platform}
AUDIENCE: ${generatedConcept.audience}
WHY NOW: ${generatedConcept.why_now}
EVIDENCE: ${generatedConcept.evidence}

OUTLINE:
${generatedConcept.outline_bullets.map((b) => `• ${b}`).join('\n')}

TAGS: ${generatedConcept.suggested_tags.join(' ')}
CTA: ${generatedConcept.call_to_action}`;

    navigator.clipboard?.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (viewMode === 'report') {
    return (
      <div className="p-4 sm:p-6 lg:p-9 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-white/80 p-2 rounded-2xl border border-[#D8CFC2] shadow-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('workbench')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#5E5A54] hover:text-[#111111] transition-colors cursor-pointer"
            >
              <Lightbulb size={14} />
              <span>Creator Workbench & Forge</span>
            </button>

            <button
              onClick={() => setViewMode('report')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111111] text-[#F8F5EF] text-xs font-bold shadow-xs cursor-pointer"
            >
              <FileText size={14} />
              <span>Creator Insight Report</span>
            </button>
          </div>
        </div>

        <CreatorInsightReport
          analysis={analysis}
          concept={generatedConcept}
          onClose={() => setViewMode('workbench')}
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-9 max-w-7xl mx-auto space-y-9">
      {/* 1. Header Banner with Brand & Tagline */}
      <section className="relative overflow-hidden rounded-3xl p-7 sm:p-10 liquid-glass border border-white/80 shadow-sm">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#E8DFD2]/70 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#111111] flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#111111]" />
              <span>CREATOR INTELLIGENCE</span>
            </span>
            <span className="text-[#A39989] font-mono">/</span>
            <span className="text-xs font-semibold text-[#5E5A54]">
              Evidence-Based Content Strategy
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#111111]">
            Creator Lens
          </h1>

          <p className="text-base sm:text-lg font-medium text-[#111111] italic">
            "Turn social intelligence into your next idea."
          </p>

          <p className="text-xs sm:text-sm text-[#5E5A54] leading-relaxed max-w-2xl font-normal">
            Transform real-time conversation signals, audience inquiries, and unaddressed information gaps into structured, high-value content concepts. Grounded in observational evidence, not arbitrary virality promises.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#idea-forge-section"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#111111] hover:bg-[#2A2A2A] text-[#F8F5EF] font-bold text-xs transition-all shadow-sm cursor-pointer"
            >
              <Lightbulb size={14} />
              <span>Jump to Idea Forge</span>
            </a>

            <button
              onClick={() => setViewMode('report')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/80 hover:bg-white text-[#111111] border border-[#D8CFC2] font-bold text-xs transition-all shadow-xs cursor-pointer"
            >
              <FileText size={14} className="text-[#5E5A54]" />
              <span>Creator Insight Report</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Creator Filters Toolbar */}
      <section className="liquid-glass rounded-2xl p-4 border border-white/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#111111]">
            <Filter size={14} />
            <span>Audience & Platform Filters</span>
          </div>
          <span className="text-[11px] font-mono text-[#7D786F]">
            Showing insights grounded in {analysis.title}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Platform Selector */}
          <div>
            <label className="text-[10px] font-bold uppercase text-[#7D786F] block mb-1">
              Platform
            </label>
            <select
              value={selectedPlatformFilter}
              onChange={(e) => setSelectedPlatformFilter(e.target.value as any)}
              className="w-full text-xs font-semibold bg-white/90 border border-[#D8CFC2] rounded-xl px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111]"
            >
              {PLATFORM_FILTERS.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Time Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase text-[#7D786F] block mb-1">
              Time Window
            </label>
            <select
              value={selectedTimeFilter}
              onChange={(e) => setSelectedTimeFilter(e.target.value)}
              className="w-full text-xs font-semibold bg-white/90 border border-[#D8CFC2] rounded-xl px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111]"
            >
              {TIME_FILTERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase text-[#7D786F] block mb-1">
              Language Focus
            </label>
            <select
              value={selectedLanguageFilter}
              onChange={(e) => setSelectedLanguageFilter(e.target.value)}
              className="w-full text-xs font-semibold bg-white/90 border border-[#D8CFC2] rounded-xl px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111]"
            >
              {LANGUAGE_FILTERS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Format Preference */}
          <div>
            <label className="text-[10px] font-bold uppercase text-[#7D786F] block mb-1">
              Target Format
            </label>
            <select
              value={selectedFormatFilter}
              onChange={(e) => setSelectedFormatFilter(e.target.value)}
              className="w-full text-xs font-semibold bg-white/90 border border-[#D8CFC2] rounded-xl px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111]"
            >
              <option value="All">All Formats</option>
              {FORMAT_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 3. Section: What's Gaining Attention */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#111111] flex items-center gap-1.5">
              <TrendingUp size={14} />
              <span>WHAT'S GAINING ATTENTION</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight mt-0.5">
              Emerging Topics & Trajectory Signals
            </h2>
          </div>
          <span className="text-xs text-[#5E5A54] font-medium">
            Select a topic to focus creator insights
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {intel.emergingTopics.map((topic, idx) => {
            const isSelected = activeTopicIndex === idx;
            return (
              <motion.div
                key={topic.id}
                whileHover={{ y: -2 }}
                onClick={() => {
                  setActiveTopicIndex(idx);
                  setForgeConfig((prev) => ({ ...prev, topic: topic.name }));
                }}
                className={`p-5 rounded-3xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-white border-[#111111] shadow-md ring-1 ring-[#111111]'
                    : 'liquid-glass-card border-white/80 hover:border-[#D8CFC2]'
                }`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        topic.velocity === 'Surging'
                          ? 'bg-[#111111] text-[#F8F5EF]'
                          : 'bg-[#E8DFD2] text-[#5E5A54]'
                      }`}
                    >
                      {topic.velocity.toUpperCase()} VELOCITY
                    </span>
                    <span className="text-xs font-black font-mono text-[#111111]">
                      {topic.growth_rate}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-[#111111] text-base leading-snug">
                      {topic.name}
                    </h3>
                    <div className="text-xs text-[#5E5A54] font-mono mt-0.5">
                      {topic.discussion_volume}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#3A3834] pt-1">
                    <p className="leading-relaxed line-clamp-2">
                      {topic.why_notable}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#D8CFC2]/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      {topic.platforms.map((p) => (
                        <PlatformIcon key={p} platform={p} size={13} />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-[#111111] flex items-center gap-1">
                      <span>{isSelected ? 'Focused Topic' : 'Inspect'}</span>
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. Section: Why It Matters to Creators */}
      <section className="bg-[#111111] text-[#F8F5EF] rounded-3xl p-6 sm:p-8 space-y-4 shadow-md">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#D8CFC2]">
            <Compass size={14} />
            <span>WHY IT MATTERS TO CREATORS</span>
          </div>
          <span className="text-xs font-mono text-[#A39989]">
            Topic: {activeTopic.name}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#A39989] block">
              Observed Opportunity
            </span>
            <p className="text-sm text-[#F8F5EF] font-medium leading-relaxed">
              {activeTopic.why_it_matters}
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#A39989] block">
              Audience Need & Sentiment
            </span>
            <p className="text-sm text-[#F8F5EF]/90 leading-relaxed">
              Audience interest is rated <strong className="text-[#F8F5EF]">{activeTopic.audience_interest}</strong> with a predominantly <strong className="text-[#F8F5EF]">{activeTopic.sentiment}</strong> inquiry tone requiring clarity and honest verification.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#A39989] block">
              Cross-Platform Dynamics
            </span>
            <p className="text-sm text-[#F8F5EF]/90 leading-relaxed">
              Conversation spread observed across {activeTopic.platforms.map((p) => getPlatformName(p)).join(', ')}, allowing multi-format adaptation from short-form reels to deep-dive threads.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Section: What is the audience asking? */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#111111] flex items-center gap-1.5">
              <HelpCircle size={14} />
              <span>WHAT IS THE AUDIENCE ASKING?</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight mt-0.5">
              Audience Questions & Inquiries
            </h2>
          </div>
          <span className="text-xs text-[#5E5A54]">
            Extracted from public replies, comments & broadcast feedback
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="liquid-glass-card rounded-3xl p-5 sm:p-6 border border-white/80 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF3E8] text-[#845318] border border-[#9A6B2F]/30">
                      {q.urgency}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#5E5A54]">
                      {q.discussion_volume}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-[#111111] leading-snug">
                    "{q.question}"
                  </h3>

                  <div className="p-3 bg-white/70 border border-[#D8CFC2]/60 rounded-xl text-xs italic text-[#5E5A54]">
                    Sample context: {q.context_sample}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#D8CFC2]/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {q.platforms.map((p) => (
                      <PlatformIcon key={p} platform={p} size={13} />
                    ))}
                    <span className="text-[11px] text-[#7D786F] ml-1">{q.frequency}</span>
                  </div>

                  <button
                    onClick={() => handlePickQuestionForForge(q)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-[#F8F5EF] text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Lightbulb size={12} />
                    <span>Send to Forge</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 p-8 liquid-glass rounded-3xl text-center text-xs text-[#5E5A54]">
              No audience questions matching the selected platform filter.
            </div>
          )}
        </div>
      </section>

      {/* 6. Section: Conversation Gaps */}
      <section className="space-y-4">
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#111111] flex items-center gap-1.5">
            <AlertCircle size={14} />
            <span>CONVERSATION GAPS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight mt-0.5">
            Unaddressed Perspectives & Information Blindspots
          </h2>
          <p className="text-xs sm:text-sm text-[#5E5A54] mt-1 max-w-2xl">
            Where audience curiosity is high but existing explanations are scarce or contradictory.
          </p>
        </div>

        <div className="space-y-4">
          {filteredGaps.map((gap) => (
            <div
              key={gap.id}
              className="liquid-glass rounded-3xl p-6 sm:p-7 border border-white/80 space-y-4 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D8CFC2]/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#111111]" />
                  <h3 className="font-extrabold text-base text-[#111111]">
                    {gap.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {gap.platforms.map((p) => (
                      <PlatformIcon key={p} platform={p} size={13} />
                    ))}
                  </div>
                  <button
                    onClick={() => handlePickGapForForge(gap)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-[#F8F5EF] text-xs font-bold transition-all shadow-xs cursor-pointer ml-2"
                  >
                    <Sparkles size={12} />
                    <span>Create Idea</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-[#7D786F] block">
                    1. The Gap
                  </span>
                  <p className="text-[#111111] font-medium leading-relaxed">
                    {gap.gap}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-[#7D786F] block">
                    2. Supporting Evidence
                  </span>
                  <p className="text-[#3A3834] leading-relaxed">
                    {gap.evidence}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-[#7D786F] block">
                    3. Audience Signal
                  </span>
                  <p className="text-[#3A3834] leading-relaxed italic bg-white/70 p-2.5 rounded-xl border border-[#D8CFC2]/50">
                    {gap.audience_signal}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-[#7D786F] block">
                    4. Content Opportunity
                  </span>
                  <p className="text-[#111111] font-semibold leading-relaxed">
                    {gap.opportunity}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Section: Creator Opportunities */}
      <section className="space-y-4">
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#111111] flex items-center gap-1.5">
            <Lightbulb size={14} />
            <span>CREATOR OPPORTUNITIES</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight mt-0.5">
            Structured Content Directions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="liquid-glass-card rounded-3xl p-6 border border-white/80 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#111111] text-[#F8F5EF]">
                    {opp.suggested_format}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {opp.relevant_platforms.map((p) => (
                      <PlatformIcon key={p} platform={p} size={13} />
                    ))}
                  </div>
                </div>

                <h3 className="text-lg font-black text-[#111111] leading-snug">
                  "{opp.opportunity_title}"
                </h3>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#7D786F] block">
                      Why It Matters:
                    </span>
                    <p className="text-[#3A3834] mt-0.5">{opp.why_it_matters}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#7D786F] block">
                      Suggested Angle:
                    </span>
                    <p className="text-[#111111] font-semibold mt-0.5">{opp.possible_angle}</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#D8CFC2]/60 flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#7D786F]">
                  Observed signal, not virality guarantee
                </span>
                <button
                  onClick={() => {
                    setForgeConfig((prev) => ({
                      ...prev,
                      topic: opp.topic,
                      content_format: opp.suggested_format,
                      custom_angle: opp.possible_angle,
                    }));
                    const el = document.getElementById('idea-forge-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#111111] hover:underline cursor-pointer"
                >
                  <span>Build in Forge</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. MAJOR FEATURE: Idea Forge */}
      <section
        id="idea-forge-section"
        className="liquid-glass rounded-3xl p-6 sm:p-9 border border-white/80 shadow-md space-y-7"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D8CFC2]/60 pb-4">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#111111] flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#111111]" />
              <span>INTERACTIVE WORKBENCH</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight mt-0.5">
              Idea Forge
            </h2>
            <p className="text-xs sm:text-sm text-[#5E5A54] mt-1 max-w-xl">
              Configure parameters to forge grounded, high-retention content ideas tailored to current social intelligence.
            </p>
          </div>

          <button
            onClick={handleGenerateConcept}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#111111] hover:bg-[#2A2A2A] text-[#F8F5EF] font-bold text-xs transition-all shadow-md cursor-pointer hover:scale-[1.01]"
          >
            <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
            <span>{isGenerating ? 'Forging Concept...' : 'Forge Content Idea'}</span>
          </button>
        </div>

        {/* Configuration Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Target Topic */}
          <div>
            <label className="text-[10px] font-bold uppercase text-[#7D786F] block mb-1">
              Topic
            </label>
            <input
              type="text"
              value={forgeConfig.topic}
              onChange={(e) => setForgeConfig({ ...forgeConfig, topic: e.target.value })}
              className="w-full bg-white border border-[#D8CFC2] rounded-xl px-3 py-2 font-bold text-[#111111] focus:outline-none focus:border-[#111111]"
            />
          </div>

          {/* Content Format */}
          <div>
            <label className="text-[10px] font-bold uppercase text-[#7D786F] block mb-1">
              Content Format
            </label>
            <select
              value={forgeConfig.content_format}
              onChange={(e) => setForgeConfig({ ...forgeConfig, content_format: e.target.value as any })}
              className="w-full bg-white border border-[#D8CFC2] rounded-xl px-3 py-2 font-semibold text-[#111111] focus:outline-none focus:border-[#111111]"
            >
              {FORMAT_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Platform */}
          <div>
            <label className="text-[10px] font-bold uppercase text-[#7D786F] block mb-1">
              Target Platform
            </label>
            <select
              value={forgeConfig.platform}
              onChange={(e) => setForgeConfig({ ...forgeConfig, platform: e.target.value as any })}
              className="w-full bg-white border border-[#D8CFC2] rounded-xl px-3 py-2 font-semibold text-[#111111] focus:outline-none focus:border-[#111111]"
            >
              {PLATFORM_FILTERS.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tone */}
          <div>
            <label className="text-[10px] font-bold uppercase text-[#7D786F] block mb-1">
              Tone of Voice
            </label>
            <select
              value={forgeConfig.tone}
              onChange={(e) => setForgeConfig({ ...forgeConfig, tone: e.target.value as any })}
              className="w-full bg-white border border-[#D8CFC2] rounded-xl px-3 py-2 font-semibold text-[#111111] focus:outline-none focus:border-[#111111]"
            >
              {TONE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Objective */}
          <div>
            <label className="text-[10px] font-bold uppercase text-[#7D786F] block mb-1">
              Primary Objective
            </label>
            <select
              value={forgeConfig.objective}
              onChange={(e) => setForgeConfig({ ...forgeConfig, objective: e.target.value as any })}
              className="w-full bg-white border border-[#D8CFC2] rounded-xl px-3 py-2 font-semibold text-[#111111] focus:outline-none focus:border-[#111111]"
            >
              {OBJECTIVE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Angle / Hook direction */}
          <div>
            <label className="text-[10px] font-bold uppercase text-[#7D786F] block mb-1">
              Custom Angle / Specific Focus (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Focus on lip-sync optical glitch..."
              value={forgeConfig.custom_angle || ''}
              onChange={(e) => setForgeConfig({ ...forgeConfig, custom_angle: e.target.value })}
              className="w-full bg-white border border-[#D8CFC2] rounded-xl px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111]"
            />
          </div>
        </div>

        {/* Generated Idea Forge Result Card */}
        <div className="bg-[#111111] text-[#F8F5EF] rounded-3xl p-6 sm:p-9 space-y-6 shadow-xl border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D8CFC2] block">
                FORGED CONCEPT · {generatedConcept.format}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#F8F5EF] leading-tight">
                {generatedConcept.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyConcept}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#F8F5EF] text-xs font-bold transition-all cursor-pointer"
              >
                {isCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{isCopied ? 'Copied' : 'Copy All'}</span>
              </button>
            </div>
          </div>

          {/* Core Concept Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* The Hook */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-[#D8CFC2] block">
                The Opening Hook
              </span>
              <p className="text-base text-[#F8F5EF] font-bold italic leading-snug">
                "{generatedConcept.hook}"
              </p>
            </div>

            {/* Core Angle */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-[#D8CFC2] block">
                Core Explanatory Angle
              </span>
              <p className="text-sm text-[#F8F5EF]/90 leading-relaxed font-normal">
                {generatedConcept.core_angle}
              </p>
            </div>
          </div>

          {/* Evidence & Why Now */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#A39989] block">Target Audience</span>
              <p className="text-[#F8F5EF] font-medium">{generatedConcept.audience}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#A39989] block">Why Now (Signal)</span>
              <p className="text-[#F8F5EF] leading-snug">{generatedConcept.why_now}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#A39989] block">Grounding Evidence</span>
              <p className="text-[#F8F5EF] leading-snug">{generatedConcept.evidence}</p>
            </div>
          </div>

          {/* Script / Flow Outline */}
          <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
            <span className="text-[10px] uppercase font-bold text-[#D8CFC2] block">
              Suggested Step-by-Step Structure:
            </span>
            <ul className="space-y-1.5 pl-1">
              {generatedConcept.outline_bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-[#F8F5EF]/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D8CFC2] shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hashtags & CTA */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              {generatedConcept.suggested_tags.map((tag) => (
                <span key={tag} className="text-[11px] font-mono text-[#D8CFC2] bg-white/5 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>

            <div className="text-[11px] text-[#A39989]">
              Call to Action: <span className="text-[#F8F5EF] font-semibold">"{generatedConcept.call_to_action}"</span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Creator Insight Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-[#111111]/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] border border-[#D8CFC2] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-9 space-y-7 shadow-2xl text-[#111111]">
            <div className="flex items-center justify-between border-b border-[#D8CFC2] pb-4">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#5E5A54]">
                  VOXENTRA INTELLIGENCE DOSSIER
                </div>
                <h2 className="text-2xl font-black text-[#111111]">
                  Creator Insight Dossier: {activeTopic.name}
                </h2>
                <div className="text-xs text-[#7D786F] mt-0.5">
                  Generated {new Date().toLocaleString()} · Grounded in observational intelligence
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-xl bg-white border border-[#D8CFC2] hover:bg-[#F3EEE7] text-[#111111] cursor-pointer"
                  title="Print Report"
                >
                  <Printer size={16} />
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#111111] text-[#F8F5EF] text-xs font-bold cursor-pointer hover:bg-[#2A2A2A]"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Dossier Content */}
            <div className="space-y-6 text-xs">
              {/* Executive Summary */}
              <div className="p-5 bg-white rounded-2xl border border-[#D8CFC2] space-y-2 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-[#7D786F] block">
                  Executive Brief for Creators
                </span>
                <p className="text-sm text-[#111111] leading-relaxed">
                  {activeTopic.why_it_matters} The primary audience inquiry cluster seeks clarity regarding authentication heuristics and official validation.
                </p>
              </div>

              {/* Emerging Trajectories */}
              <div>
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#111111] mb-2">
                  Top Emerging Narrative Signals
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {intel.emergingTopics.map((t) => (
                    <div key={t.id} className="p-3.5 bg-white rounded-xl border border-[#D8CFC2]">
                      <div className="font-bold text-xs text-[#111111]">{t.name}</div>
                      <div className="text-[11px] text-[#5E5A54] mt-1">{t.signal_summary}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* High-Frequency Audience Questions */}
              <div>
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#111111] mb-2">
                  Key Audience Questions (Verified Inquiries)
                </h3>
                <ul className="space-y-2">
                  {intel.audienceQuestions.map((q) => (
                    <li key={q.id} className="p-3 bg-white rounded-xl border border-[#D8CFC2] flex items-start gap-2">
                      <span className="text-[#111111] font-bold">?</span>
                      <div>
                        <div className="font-bold text-[#111111]">{q.question}</div>
                        <div className="text-[11px] text-[#7D786F]">{q.frequency} · {q.discussion_volume}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Verified Conversation Gaps */}
              <div>
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#111111] mb-2">
                  Conversation Gaps Ready for Exploration
                </h3>
                <div className="space-y-2">
                  {intel.conversationGaps.map((g) => (
                    <div key={g.id} className="p-3.5 bg-white rounded-xl border border-[#D8CFC2] space-y-1">
                      <div className="font-bold text-[#111111]">{g.title}</div>
                      <div className="text-[11px] text-[#5E5A54]">{g.gap}</div>
                      <div className="text-[11px] text-[#111111] font-semibold mt-1">Opportunity: {g.opportunity}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Forged Concept */}
              <div className="p-5 bg-[#111111] text-[#F8F5EF] rounded-2xl space-y-3">
                <span className="text-[10px] font-mono uppercase text-[#D8CFC2] block">
                  Recommended Concept: {generatedConcept.title}
                </span>
                <p className="text-sm font-bold italic">"{generatedConcept.hook}"</p>
                <div className="text-[11px] text-[#F8F5EF]/80">{generatedConcept.core_angle}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
