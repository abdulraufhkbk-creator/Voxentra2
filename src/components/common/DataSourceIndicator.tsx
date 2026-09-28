import React from 'react';
import { Database, Cpu, Radio, UserCheck } from 'lucide-react';

interface DataSourceIndicatorProps {
  sourceType: 'LIVE/CONNECTED DATA' | 'SIMULATED DATA' | 'USER-PROVIDED DATA' | 'AI-INFERRED DATA';
  aiEngine?: string;
  className?: string;
}

export const DataSourceIndicator: React.FC<DataSourceIndicatorProps> = ({
  sourceType,
  aiEngine,
  className = '',
}) => {
  if (sourceType === 'LIVE/CONNECTED DATA') {
    return (
      <div className={`inline-flex items-center gap-2 text-[11px] text-[#111111] bg-white/70 backdrop-blur-md border border-[#111111]/15 px-3 py-1 rounded-full shadow-xs ${className}`}>
        <Radio size={12} className="text-[#111111] animate-pulse" />
        <span className="font-bold tracking-wide uppercase">LIVE · CONNECTED FEED</span>
      </div>
    );
  }

  if (sourceType === 'USER-PROVIDED DATA') {
    return (
      <div className={`inline-flex items-center gap-2 text-[11px] text-[#111111] bg-white/70 backdrop-blur-md border border-[#111111]/15 px-3 py-1 rounded-full shadow-xs ${className}`}>
        <UserCheck size={12} className="text-[#5E5A54]" />
        <span className="font-bold tracking-wide uppercase">USER PROVIDED CONTENT</span>
      </div>
    );
  }

  if (sourceType === 'AI-INFERRED DATA') {
    return (
      <div className={`inline-flex items-center gap-2 text-[11px] text-[#111111] bg-white/70 backdrop-blur-md border border-[#111111]/15 px-3 py-1 rounded-full shadow-xs ${className}`}>
        <Cpu size={12} className="text-[#5E5A54]" />
        <span className="font-bold tracking-wide uppercase">AI INFERRED ({aiEngine || 'GEMINI 3.8 FLASH'})</span>
      </div>
    );
  }

  // SIMULATED DATA default
  return (
    <div
      className={`inline-flex items-center gap-2 text-[11px] text-[#5E5A54] bg-white/60 backdrop-blur-md border border-[#D8CFC2] px-3 py-1 rounded-full shadow-xs ${className}`}
      title="Verified high-fidelity seeded dataset. Live connectors active for X, YouTube, and Telegram."
    >
      <Database size={12} className="text-[#5E5A54]" />
      <span className="font-bold tracking-wide uppercase">SIMULATED DATASET</span>
    </div>
  );
};
