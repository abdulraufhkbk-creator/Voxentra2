import React from 'react';
import { Menu, Search, FileText, Chrome } from 'lucide-react';
import { NavItemKey } from './Sidebar';
import { AnalysisResult } from '../../types/analysis';
import { DataSourceIndicator } from '../common/DataSourceIndicator';
import { RiskBadge } from '../common/RiskBadge';

interface NavbarProps {
  currentAnalysis: AnalysisResult | null;
  onOpenMobileMenu: () => void;
  onNavigate: (tab: NavItemKey) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentAnalysis,
  onOpenMobileMenu,
  onNavigate,
}) => {
  return (
    <header className="h-16 border-b border-[#D8CFC2]/70 bg-[#F8F5EF]/75 backdrop-blur-xl px-4 lg:px-7 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3.5">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-[#5E5A54] hover:text-[#111111] rounded-lg hover:bg-white/70 cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu size={19} />
        </button>

        {currentAnalysis ? (
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[11px] font-bold text-[#5E5A54] uppercase tracking-wider">
              Focus:
            </span>
            <div className="font-bold text-xs text-[#111111] truncate max-w-[180px] sm:max-w-[340px]">
              {currentAnalysis.title}
            </div>
            <RiskBadge level={currentAnalysis.risk.risk_level} size="sm" />
          </div>
        ) : (
          <div className="text-xs font-semibold text-[#5E5A54]">
            Social Intelligence Analyzer
          </div>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        {currentAnalysis && (
          <div className="hidden md:block">
            <DataSourceIndicator
              sourceType={currentAnalysis.data_source_type}
              aiEngine={currentAnalysis.ai_engine}
            />
          </div>
        )}

        <button
          onClick={() => onNavigate('companion')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#111111] bg-white/70 border border-[#D8CFC2] hover:bg-white transition-all cursor-pointer shadow-xs"
        >
          <Chrome size={13} className="text-[#5E5A54]" />
          <span>Extension</span>
        </button>

        <button
          onClick={() => onNavigate('reports')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#111111] bg-white/70 border border-[#D8CFC2] hover:bg-white transition-all cursor-pointer shadow-xs"
        >
          <FileText size={13} className="text-[#5E5A54]" />
          <span className="hidden xs:inline">Generate</span> Report
        </button>

        <button
          onClick={() => onNavigate('analyze')}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-extrabold text-[#F8F5EF] bg-[#111111] hover:bg-[#2A2A2A] transition-all shadow-sm cursor-pointer"
        >
          <Search size={13} />
          <span>Analyze This</span>
        </button>
      </div>
    </header>
  );
};
