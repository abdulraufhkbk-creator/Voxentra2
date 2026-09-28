import React from 'react';
import { Search, LucideIcon } from 'lucide-react';

interface EmptyAnalysisStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyAnalysisState: React.FC<EmptyAnalysisStateProps> = ({
  title = 'No Live Data Available',
  description = 'No active analysis is currently loaded. Ingest live video content or submit text in the Analyze section to generate this intelligence view.',
  icon: Icon = Search,
  actionLabel = 'Start Live Ingestion',
  onAction,
}) => {
  return (
    <div className="p-8 sm:p-12 max-w-2xl mx-auto text-center space-y-5 liquid-glass rounded-3xl border border-white/80 shadow-xs my-8">
      <div className="w-14 h-14 rounded-2xl bg-[#111111] text-[#F8F5EF] flex items-center justify-center mx-auto shadow-md">
        <Icon size={24} />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-xl font-black text-[#111111] tracking-tight">{title}</h2>
        <p className="text-xs sm:text-sm text-[#5E5A54] max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      </div>
      {onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-[#F8F5EF] text-xs font-extrabold transition-all shadow-sm cursor-pointer inline-flex items-center gap-2"
        >
          <Search size={13} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
