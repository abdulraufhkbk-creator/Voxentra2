import React from 'react';
import { Menu, Search, FileText, Command, Keyboard } from 'lucide-react';
import { NavItemKey } from './Sidebar';
import { AnalysisResult } from '../../types/analysis';
import { RiskBadge } from '../common/RiskBadge';

interface NavbarProps {
  currentAnalysis: AnalysisResult | null;
  onOpenMobileMenu: () => void;
  onNavigate: (tab: NavItemKey) => void;
  onOpenCommandPalette?: () => void;
  onOpenShortcutsModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentAnalysis,
  onOpenMobileMenu,
  onNavigate,
  onOpenCommandPalette,
  onOpenShortcutsModal,
}) => {
  return (
    <header className="navbar h-16 border-b border-[#D8CFC2]/70 bg-[#F8F5EF]/90 backdrop-blur-xl px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs w-full">
      {/* Left side: Navigation control & Quick Search Command Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden inline-flex items-center justify-center h-9 w-9 text-[#5E5A54] hover:text-[#111111] bg-white hover:bg-[#F3EFE6] border border-[#D8CFC2] rounded-xl transition-all cursor-pointer shadow-xs"
          aria-label="Open navigation menu"
        >
          <Menu size={18} />
        </button>
        <div className="hidden lg:flex items-center gap-2.5 text-xs font-bold text-[#111111] tracking-tight">
          <span className="w-2 h-2 rounded-full bg-[#111111]" />
          <span className="uppercase text-[11px] font-extrabold text-[#5E5A54] tracking-wider">
            Social Intelligence System
          </span>
        </div>

        {/* Quick Command Palette Search Trigger Button */}
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="hidden md:inline-flex items-center gap-2 h-8 px-3 rounded-xl text-xs font-semibold text-[#5E5A54] bg-white/70 border border-[#D8CFC2]/80 hover:bg-white hover:text-[#111111] hover:border-[#D8CFC2] transition-all cursor-pointer shadow-2xs"
            title="Open Command Palette (⌘K)"
          >
            <Command size={13} className="text-[#111111]" />
            <span className="text-xs">Search commands & views...</span>
            <kbd className="ml-1 px-1.5 py-0.2 text-[10px] font-mono font-bold bg-[#E8DFD2]/60 text-[#111111] border border-[#D8CFC2] rounded">
              ⌘K
            </kbd>
          </button>
        )}
      </div>

      {/* Right side: Unified toolbar controls (Risk -> Data Sources -> Report -> Analyze This) */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1 bg-[#EFE9DF]/60 border border-[#D8CFC2]/80 rounded-2xl shadow-2xs">
        {/* Keyboard Shortcuts Trigger */}
        {onOpenShortcutsModal && (
          <div className="relative group hidden sm:block">
            <button
              onClick={onOpenShortcutsModal}
              className="inline-flex items-center justify-center h-8 w-8 rounded-xl text-[#5E5A54] bg-white/80 hover:bg-white hover:text-[#111111] border border-[#D8CFC2]/70 transition-all cursor-pointer shadow-2xs"
              aria-label="View Keyboard Shortcuts"
            >
              <Keyboard size={14} />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 bg-[#111111]/95 text-[#F8F5EF] text-[11px] font-medium rounded-lg shadow-xl border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 group-hover:translate-y-0 -translate-y-1 transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
              Keyboard shortcuts cheat-sheet (?)
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#111111]/95 rotate-45 border-t border-l border-white/10" />
            </div>
          </div>
        )}

        {/* Risk Status */}
        <div className="relative group">
          <button
            onClick={() => onNavigate('risk')}
            className="inline-flex items-center h-8 cursor-pointer transition-transform hover:scale-[1.02] shrink-0"
            aria-label="Current Content Risk Level"
          >
            <RiskBadge level={currentAnalysis?.risk?.risk_level || 'LOW'} size="sm" />
          </button>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 bg-[#111111]/95 text-[#F8F5EF] text-[11px] font-medium rounded-lg shadow-xl border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 group-hover:translate-y-0 -translate-y-1 transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
            Current threat level & risk assessment
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#111111]/95 rotate-45 border-t border-l border-white/10" />
          </div>
        </div>

        {/* Data Sources */}
        <div className="relative group">
          <button
            onClick={() => onNavigate('data-sources')}
            className="inline-flex items-center gap-1.5 h-8 px-2.5 sm:px-3 rounded-xl text-xs font-bold text-[#111111] bg-white/90 border border-[#D8CFC2]/70 hover:bg-white hover:border-[#D8CFC2] transition-all cursor-pointer shadow-2xs whitespace-nowrap"
            aria-label="Data Sources & API Status"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="hidden sm:inline">Data Sources</span>
            <span className="sm:hidden">Sources</span>
          </button>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 bg-[#111111]/95 text-[#F8F5EF] text-[11px] font-medium rounded-lg shadow-xl border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 group-hover:translate-y-0 -translate-y-1 transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
            Live API connectors, rate limits & platform status
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#111111]/95 rotate-45 border-t border-l border-white/10" />
          </div>
        </div>

        {/* Report */}
        <div className="relative group">
          <button
            onClick={() => onNavigate('reports')}
            className="inline-flex items-center gap-1.5 h-8 px-2.5 sm:px-3 rounded-xl text-xs font-bold text-[#111111] bg-white/90 border border-[#D8CFC2]/70 hover:bg-white hover:border-[#D8CFC2] transition-all cursor-pointer shadow-2xs whitespace-nowrap"
            aria-label="Generate Report"
          >
            <FileText size={14} className="text-[#5E5A54] shrink-0" />
            <span>Report</span>
          </button>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 bg-[#111111]/95 text-[#F8F5EF] text-[11px] font-medium rounded-lg shadow-xl border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 group-hover:translate-y-0 -translate-y-1 transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
            Generate & download executive intelligence brief
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#111111]/95 rotate-45 border-t border-l border-white/10" />
          </div>
        </div>

        {/* Analyze This */}
        <div className="relative group">
          <button
            onClick={() => onNavigate('analyze')}
            className="inline-flex items-center gap-1.5 h-8 px-3 sm:px-3.5 rounded-xl text-xs font-extrabold text-[#F8F5EF] bg-[#111111] hover:bg-[#2A2A2A] transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
            aria-label="Start New Analysis"
          >
            <Search size={13} className="shrink-0" />
            <span>Analyze This</span>
          </button>
          <div className="absolute top-full right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mt-2 px-2.5 py-1 bg-[#111111]/95 text-[#F8F5EF] text-[11px] font-medium rounded-lg shadow-xl border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 group-hover:translate-y-0 -translate-y-1 transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
            Analyze new media URL, text or claim
            <div className="absolute -top-1 right-4 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 w-2 h-2 bg-[#111111]/95 rotate-45 border-t border-l border-white/10" />
          </div>
        </div>
      </div>
    </header>
  );
};

