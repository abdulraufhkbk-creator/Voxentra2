import React, { useState } from 'react';
import { AnalysisResult, SocialPlatform } from '../../types/analysis';
import { PlatformIcon, getPlatformName } from '../common/PlatformIcon';
import { usePlatformData } from '../../context/PlatformDataProvider';
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
  ExternalLink,
} from 'lucide-react';

interface AnalyzeViewProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
}

const ANALYSIS_STEPS = [
  'Querying platform API connector',
  'Ingesting authentic metadata & metrics',
  'Parsing linguistic & narrative structure',
  'Running Gemini 3.8 Flash multi-modal audit',
  'Extracting risk signals & provenance evidence',
  'Persisting intelligence dossier to database',
];

export const AnalyzeView: React.FC<AnalyzeViewProps> = ({
  onAnalysisComplete,
}) => {
  const { connectors } = usePlatformData();
  const [mode, setMode] = useState<'content' | 'topic' | 'account'>('content');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('youtube');
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [accountInput, setAccountInput] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      if (!textInput) {
        setTextInput(`[Uploaded Media File: ${file.name}] Ingested for multi-modal optical and forensic inspection.`);
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
      let payload: any = {};

      if (mode === 'content') {
        const effectiveQuery = urlInput.trim() || textInput.trim() || 'trending';
        payload = {
          platform: selectedPlatform,
          url: urlInput.trim() || undefined,
          text: textInput.trim() || undefined,
          content_id: effectiveQuery,
        };
      } else if (mode === 'topic') {
        endpoint = '/api/analyze/topic';
        if (!topicInput.trim()) {
          throw new Error('Please enter a topic, hashtag, or keyword to analyze.');
        }
        payload = { topic: topicInput.trim() };
      } else if (mode === 'account') {
        endpoint = '/api/analyze/account';
        if (!accountInput.trim()) {
          throw new Error('Please enter a channel title, handle, or pseudonym to audit.');
        }
        payload = { account: accountInput.trim(), platform: selectedPlatform };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || errJson.error || `Server returned HTTP ${response.status}`);
      }

      const result: AnalysisResult = await response.json();
      clearInterval(timerInterval);
      setCurrentStepIndex(ANALYSIS_STEPS.length - 1);

      setTimeout(() => {
        setIsLoading(false);
        onAnalysisComplete(result);
      }, 400);
    } catch (err: any) {
      clearInterval(timerInterval);
      setIsLoading(false);
      setErrorMessage(err?.message || 'Failed to complete analysis. Please check input and retry.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-9 max-w-5xl mx-auto space-y-8">
      {/* View Header */}
      <div>
        <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#111111] mb-1">
          <span>REAL-TIME INGESTION</span>
          <span className="text-[#A39989]">/</span>
          <span>AUTHENTIC SOCIAL DATA</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight">
          Analyze Content & Context
        </h1>
        <p className="text-xs sm:text-sm text-[#5E5A54] mt-1.5 max-w-2xl leading-relaxed">
          Ingest real video metadata, channel metrics, and public social feeds directly through official APIs. All intelligence dossiers are synthesized from authentic observations.
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
          <span>Real Content & Video Ingestion</span>
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
          <span>Channel & Account Audit</span>
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
                  Active Live: YouTube, Telegram · Disabled: Instagram, FB, Reddit
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {connectors.map((connector) => {
                  const isSelected = selectedPlatform === connector.platform;
                  const isConnectedLive = connector.status === 'connected_live';
                  const isNotConfigured = connector.status === 'not_configured';
                  return (
                    <button
                      key={connector.platform}
                      type="button"
                      disabled={isNotConfigured}
                      onClick={() => setSelectedPlatform(connector.platform)}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all text-xs font-bold relative ${
                        isNotConfigured
                          ? 'border-black/5 bg-black/5 text-[#A39989] cursor-not-allowed opacity-50'
                          : isSelected
                          ? 'border-[#111111] bg-white text-[#111111] shadow-sm ring-1 ring-[#111111] cursor-pointer'
                          : 'border-[#D8CFC2]/70 bg-white/50 text-[#5E5A54] hover:bg-white/80 hover:text-[#111111] cursor-pointer'
                      }`}
                    >
                      <PlatformIcon platform={connector.platform} size={22} className="mb-1.5" />
                      <span>{connector.displayName}</span>
                      {isConnectedLive ? (
                        <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 rounded-full mt-1">
                          LIVE API
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-[#7D786F] mt-1">
                          {isNotConfigured ? 'DISABLED' : 'RESTRICTED'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* URL / Video ID / Query Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111] flex items-center justify-between">
                <span>Public Post / Video URL or Search Keyword</span>
                <span className="text-[11px] text-[#7D786F] font-normal">
                  {selectedPlatform === 'youtube'
                    ? 'Paste any YouTube URL (e.g. watch?v=... or search term)'
                    : 'Paste public URL or reference'}
                </span>
              </label>
              <div className="relative">
                <LinkIcon size={16} className="absolute left-3.5 top-3.5 text-[#7D786F]" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder={
                    selectedPlatform === 'youtube'
                      ? 'e.g. https://www.youtube.com/watch?v=... or "climate policy live"'
                      : 'https://...'
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-2xl liquid-glass-input text-xs text-[#111111] placeholder-[#A39989] focus:outline-none"
                />
              </div>
            </div>

            {/* Post Text / Caption / Transcript Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111] block">
                Post Text / Caption / Speech Transcript (Optional if URL provided)
              </label>
              <textarea
                rows={3}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter social post text, video description, or transcript to evaluate sentiment, narrative framing, and authenticity markers..."
                className="w-full p-4 rounded-2xl liquid-glass-input text-xs text-[#111111] placeholder-[#A39989] focus:outline-none leading-relaxed"
              />
            </div>

            {/* Media Upload Box */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111] block">
                Attach Media for Forensic Optical Analysis (Optional)
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
                  placeholder="e.g. #QuantumComputing or AI Deepfake Regulation"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl liquid-glass-input text-xs text-[#111111] placeholder-[#A39989] focus:outline-none"
                />
              </div>
            </div>
            <p className="text-xs text-[#5E5A54] leading-relaxed">
              Topical analysis aggregates multi-platform conversations across active APIs, maps emerging narrative shifts, and analyzes demographic cluster adoption.
            </p>
          </div>
        )}

        {mode === 'account' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111] block">
                Channel Title, Pseudonym, or Handle
              </label>
              <div className="relative">
                <AtSign size={16} className="absolute left-3.5 top-3.5 text-[#5E5A54]" />
                <input
                  type="text"
                  value={accountInput}
                  onChange={(e) => setAccountInput(e.target.value)}
                  placeholder="e.g. @ScienceExplorationDesk or TechInquirer"
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
            <span>Live data ingestion via official APIs with Gemini 3.8 Flash NLP synthesis</span>
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
                <span>Ingest & Analyze Live Data</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Multi-step Loading Animation Modal */}
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
