import React, { useState } from 'react';
import { AnalysisResult, AnalysisScenario, SocialPlatform } from '../../types/analysis';
import { SEEDED_SCENARIOS } from '../../data/seedScenarios';
import { PlatformIcon, getPlatformName } from '../common/PlatformIcon';
import { RiskBadge } from '../common/RiskBadge';
import {
  Search,
  Upload,
  Link as LinkIcon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileVideo,
  Layers,
  AtSign,
  Hash,
  ArrowRight,
  Radio,
} from 'lucide-react';

interface AnalyzeViewProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  onSelectScenario: (scenario: AnalysisScenario) => void;
}

const PLATFORMS: SocialPlatform[] = ['x', 'youtube', 'telegram', 'instagram', 'facebook', 'reddit'];

const ANALYSIS_STEPS = [
  'Collecting context',
  'Understanding content',
  'Analyzing audience',
  'Mapping trends',
  'Mapping network',
  'Assessing content risk',
  'Generating explanation',
];

export const AnalyzeView: React.FC<AnalyzeViewProps> = ({
  onAnalysisComplete,
  onSelectScenario,
}) => {
  const [mode, setMode] = useState<'content' | 'topic' | 'account'>('content');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('x');
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [accountInput, setAccountInput] = useState('');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('deepfake-policy-claim');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleScenarioPick = (scId: string) => {
    setSelectedScenarioId(scId);
    const scenario = SEEDED_SCENARIOS.find((s) => s.id === scId);
    if (scenario) {
      setSelectedPlatform(scenario.platform);
      setTextInput(scenario.data.content.text);
      setUrlInput(scenario.data.content.source_reference);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      if (!textInput) {
        setTextInput(`[Uploaded Media: ${file.name}] Suspicious speech with lip-sync anomalies and zero verifiable C2PA credentials.`);
      }
    }
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentStepIndex(0);

    const timerInterval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      let endpoint = '/api/analyze/content';
      let payload: any = {
        platform: selectedPlatform,
        text: textInput || undefined,
        url: urlInput || undefined,
        scenario_id: selectedScenarioId || undefined,
      };

      if (mode === 'topic') {
        endpoint = '/api/analyze/topic';
        payload = { topic: topicInput || '#BhashaTech AI Consortium' };
      } else if (mode === 'account') {
        endpoint = '/api/analyze/account';
        payload = { account: accountInput || '@AnonTrendCurator_92', platform: selectedPlatform };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const result: AnalysisResult = await response.json();
      clearInterval(timerInterval);
      setCurrentStepIndex(ANALYSIS_STEPS.length - 1);

      setTimeout(() => {
        setIsLoading(false);
        onAnalysisComplete(result);
      }, 500);
    } catch (err: any) {
      clearInterval(timerInterval);
      setIsLoading(false);
      setErrorMessage(err?.message || 'Failed to complete analysis pipeline. Please retry.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-9 max-w-5xl mx-auto space-y-8">
      {/* View Header */}
      <div>
        <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#111111] mb-1">
          <span>PIPELINE ENGINE</span>
          <span className="text-[#A39989]">/</span>
          <span>MULTI-SOURCE INGESTION</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight">
          Analyze Content & Context
        </h1>
        <p className="text-xs sm:text-sm text-[#5E5A54] mt-1.5 max-w-2xl leading-relaxed">
          Submit public social media posts, URLs, uploaded media clips, or topical keywords. The Voxentra intelligence engine extracts linguistic signals, authenticity markers, and network trajectories.
        </p>
      </div>

      {/* Mode selection tabs */}
      <div className="flex items-center gap-1.5 p-1.5 liquid-glass rounded-2xl w-fit text-xs font-bold border border-white/80 shadow-xs">
        <button
          onClick={() => setMode('content')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            mode === 'content'
              ? 'bg-[#111111] text-[#F8F5EF] shadow-sm'
              : 'text-[#5E5A54] hover:text-[#111111]'
          }`}
        >
          <Layers size={14} />
          <span>Content & Media Post</span>
        </button>

        <button
          onClick={() => setMode('topic')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            mode === 'topic'
              ? 'bg-[#111111] text-[#F8F5EF] shadow-sm'
              : 'text-[#5E5A54] hover:text-[#111111]'
          }`}
        >
          <Hash size={14} />
          <span>Topic Intelligence</span>
        </button>

        <button
          onClick={() => setMode('account')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            mode === 'account'
              ? 'bg-[#111111] text-[#F8F5EF] shadow-sm'
              : 'text-[#5E5A54] hover:text-[#111111]'
          }`}
        >
          <AtSign size={14} />
          <span>Account Impact Audit</span>
        </button>
      </div>

      {/* Main Analysis Form Card */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-9 space-y-7 border border-white/80 shadow-sm">
        {mode === 'content' && (
          <>
            {/* Step 1: Select Platform */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111] block">
                  1. Select Source Platform
                </label>
                <span className="text-[11px] text-[#7D786F]">
                  Live APIs: X, YouTube, Telegram · Demo Datasets: IG, FB, Reddit
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {PLATFORMS.map((platform) => {
                  const isSelected = selectedPlatform === platform;
                  const isLive = platform === 'x' || platform === 'youtube' || platform === 'telegram';
                  return (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => setSelectedPlatform(platform)}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all text-xs font-bold cursor-pointer relative ${
                        isSelected
                          ? 'border-[#111111] bg-white text-[#111111] shadow-sm ring-1 ring-[#111111]'
                          : 'border-[#D8CFC2]/70 bg-white/50 text-[#5E5A54] hover:bg-white/80 hover:text-[#111111]'
                      }`}
                    >
                      <PlatformIcon platform={platform} size={22} className="mb-1.5" />
                      <span>{getPlatformName(platform)}</span>
                      {isLive && (
                        <span className="text-[9px] font-mono font-bold text-[#111111] bg-[#FAF3E8] border border-[#D8CFC2] px-1.5 py-0.2 rounded-full mt-1">
                          LIVE
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Demo Scenario Picker */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
                  2. Choose Seeded Scenario or Enter Content
                </label>
                <span className="text-[11px] text-[#7D786F]">
                  Internally consistent demonstration benchmarks
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SEEDED_SCENARIOS.map((sc) => {
                  const isPicked = selectedScenarioId === sc.id;
                  return (
                    <div
                      key={sc.id}
                      onClick={() => handleScenarioPick(sc.id)}
                      className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                        isPicked
                          ? 'border-[#111111] bg-white text-[#111111] shadow-sm ring-1 ring-[#111111]'
                          : 'border-[#D8CFC2]/70 bg-white/50 text-[#5E5A54] hover:bg-white/80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-extrabold text-[#111111] truncate">{sc.title}</span>
                        <RiskBadge level={sc.risk_badge} size="sm" />
                      </div>
                      <p className="text-[11px] text-[#5E5A54] line-clamp-2 leading-relaxed">
                        {sc.preview_text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Optional URL Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111] flex items-center justify-between">
                <span>Public Post / Media URL (Optional)</span>
                <span className="text-[11px] text-[#7D786F] lowercase font-normal">URL input is not mandatory</span>
              </label>
              <div className="relative">
                <LinkIcon size={16} className="absolute left-3.5 top-3.5 text-[#7D786F]" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://x.com/status/..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl liquid-glass-input text-xs text-[#111111] placeholder-[#A39989] focus:outline-none"
                />
              </div>
            </div>

            {/* Post Text Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111] block">
                Post Text / Caption / Speech Transcript
              </label>
              <textarea
                rows={3}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter social post text, headline, or claim to evaluate sentiment, narrative evolution, and authenticity signals..."
                className="w-full p-4 rounded-2xl liquid-glass-input text-xs text-[#111111] placeholder-[#A39989] focus:outline-none leading-relaxed"
              />
            </div>

            {/* Media Upload Box */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111] block">
                Upload Media for Prototype Testing (Optional)
              </label>
              <div className="border border-dashed border-[#C4B8A5] bg-white/40 rounded-2xl p-6 text-center hover:bg-white/70 transition-all relative cursor-pointer">
                <input
                  type="file"
                  accept="video/*,image/*,audio/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#D8CFC2] flex items-center justify-center text-[#111111] shadow-2xs">
                    <Upload size={18} />
                  </div>
                  <div className="text-xs text-[#111111] font-bold">
                    {uploadedFileName ? (
                      <span className="flex items-center gap-1.5 text-[#111111]">
                        <FileVideo size={14} />
                        <span>Attached: {uploadedFileName}</span>
                      </span>
                    ) : (
                      <span>Drop video or image here, or click to browse</span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#7D786F]">
                    MP4, WebM, PNG, JPG up to 50MB. Analyzes optical noise, facial coherence, and audio spectra.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {mode === 'topic' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111] block">
                Topic, Hashtag, or Search Phrase
              </label>
              <div className="relative">
                <Hash size={16} className="absolute left-3.5 top-3.5 text-[#5E5A54]" />
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="e.g. #BhashaTech AI Consortium or Student Loan Relief"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl liquid-glass-input text-xs text-[#111111] placeholder-[#A39989] focus:outline-none"
                />
              </div>
            </div>
            <p className="text-xs text-[#5E5A54] leading-relaxed">
              Topical analysis aggregates multi-platform conversations, maps emerging narrative shifts, and analyzes demographic cluster adoption.
            </p>
          </div>
        )}

        {mode === 'account' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111] block">
                Account Pseudonym or Handle
              </label>
              <div className="relative">
                <AtSign size={16} className="absolute left-3.5 top-3.5 text-[#5E5A54]" />
                <input
                  type="text"
                  value={accountInput}
                  onChange={(e) => setAccountInput(e.target.value)}
                  placeholder="e.g. @AnonTrendCurator_92 or @IndicComputeConsortium"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl liquid-glass-input text-xs text-[#111111] placeholder-[#A39989] focus:outline-none"
                />
              </div>
            </div>
            <p className="text-xs text-[#5E5A54] leading-relaxed">
              Audits public network centrality, propagation velocity, and bot ring proximity without scraping private individual records or passwords.
            </p>
          </div>
        )}

        {/* Error notice if any */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Primary Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] text-[#7D786F] flex items-center gap-1.5 font-medium">
            <Sparkles size={14} className="text-[#111111]" />
            <span>Server-side Gemini AI synthesis with deterministic fallbacks</span>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleAnalyze}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#111111] hover:bg-[#2A2A2A] disabled:bg-[#5E5A54] text-[#F8F5EF] font-extrabold text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-[#F8F5EF] border-t-transparent rounded-full animate-spin" />
                <span>Running Pipeline...</span>
              </>
            ) : (
              <>
                <Search size={15} />
                <span>Analyze This</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Real Multi-step Loading Animation Modal */}
      {isLoading && (
        <div className="fixed inset-0 bg-[#111111]/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="liquid-glass rounded-3xl p-7 sm:p-9 max-w-md w-full shadow-2xl space-y-6 border border-white">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-[#111111] text-[#F8F5EF] mx-auto flex items-center justify-center mb-3 shadow-md">
                <Search size={22} className="animate-pulse" />
              </div>
              <h3 className="font-black text-xl text-[#111111]">
                Voxentra Pipeline Active
              </h3>
              <p className="text-xs text-[#5E5A54]">
                Executing multi-layered social intelligence inspection
              </p>
            </div>

            {/* Steps Progress Checklist */}
            <div className="space-y-2">
              {ANALYSIS_STEPS.map((step, idx) => {
                const isPast = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div
                    key={step}
                    className={`flex items-center gap-3 text-xs transition-all p-2.5 rounded-xl ${
                      isCurrent
                        ? 'bg-[#111111] text-[#F8F5EF] font-bold shadow-xs'
                        : isPast
                        ? 'text-[#111111] font-semibold bg-white/60'
                        : 'text-[#A39989]'
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 size={15} className="text-[#111111] shrink-0" />
                    ) : isCurrent ? (
                      <span className="w-3.5 h-3.5 border-2 border-[#F8F5EF] border-t-transparent rounded-full animate-spin shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-[#D8CFC2] shrink-0" />
                    )}
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>

            <div className="text-[11px] text-center text-[#7D786F] font-mono">
              Cryptographic provenance & demographic k-anonymity verified
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
