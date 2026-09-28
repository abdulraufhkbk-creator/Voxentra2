import React, { useState } from 'react';
import { RiskLevel, SocialPlatform } from '../../types/analysis';
import { RiskBadge } from '../common/RiskBadge';
import { PlatformIcon, getPlatformName } from '../common/PlatformIcon';
import {
  History,
  Search,
  Trash2,
  ArrowRight,
  Filter,
  CheckCircle,
  Eye,
  Sparkles,
} from 'lucide-react';

interface HistoryItem {
  id: string;
  title: string;
  platform: string;
  risk_level: RiskLevel;
  timestamp: string;
  summary: string;
  views: number;
}

interface HistoryViewProps {
  historyList: HistoryItem[];
  onSelectAnalysis: (id: string) => void;
  onDeleteAnalysis: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  historyList,
  onSelectAnalysis,
  onDeleteAnalysis,
  onClearAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const filtered = historyList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform =
      platformFilter === 'all' || item.platform.toLowerCase() === platformFilter.toLowerCase();
    const matchesRisk =
      riskFilter === 'all' || item.risk_level.toLowerCase() === riskFilter.toLowerCase();
    return matchesSearch && matchesPlatform && matchesRisk;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-9 max-w-7xl mx-auto space-y-8 text-[#111111]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#111111] mb-1">
            <span>PERSISTENT STORAGE</span>
            <span className="text-[#A39989]">/</span>
            <span>AUDIT TRAIL</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight">
            Analysis History
          </h1>
          <p className="text-xs sm:text-sm text-[#5E5A54] mt-1.5">
            Re-open previous intelligence dossiers, inspect past risk signals, or export audit logs.
          </p>
        </div>

        {historyList.length > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-rose-50 text-[#5E5A54] hover:text-rose-700 text-xs font-bold border border-[#D8CFC2] hover:border-rose-300 transition-colors cursor-pointer w-fit shadow-2xs"
          >
            <Trash2 size={14} />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="liquid-glass rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs border border-white/80 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-3 text-[#7D786F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past analyses..."
            className="w-full pl-9 pr-4 py-2 bg-white/90 border border-[#D8CFC2] rounded-xl text-[#111111] placeholder-[#A39989] focus:outline-none focus:border-[#111111] text-xs font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="bg-white/90 border border-[#D8CFC2] rounded-xl px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer text-xs font-medium shadow-2xs"
          >
            <option value="all">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="x">X (Twitter)</option>
            <option value="telegram">Telegram</option>
            <option value="reddit">Reddit</option>
            <option value="youtube">YouTube</option>
            <option value="facebook">Facebook</option>
          </select>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-white/90 border border-[#D8CFC2] rounded-xl px-3 py-2 text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer text-xs font-medium shadow-2xs"
          >
            <option value="all">All Risk Levels</option>
            <option value="high">HIGH</option>
            <option value="caution">CAUTION</option>
            <option value="low">LOW</option>
          </select>
        </div>
      </div>

      {/* History Items List */}
      {filtered.length > 0 ? (
        <div className="space-y-3.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white/90 border border-[#D8CFC2] rounded-2xl p-5 hover:border-[#111111]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-2xs"
            >
              <div
                onClick={() => onSelectAnalysis(item.id)}
                className="space-y-1.5 cursor-pointer flex-1"
              >
                <div className="flex items-center gap-2">
                  <PlatformIcon platform={item.platform} size={16} />
                  <span className="font-bold text-[#111111] text-sm group-hover:text-black transition-colors">
                    {item.title}
                  </span>
                </div>

                <p className="text-xs text-[#5E5A54] line-clamp-2 max-w-3xl leading-relaxed">
                  {item.summary}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-[#7D786F] pt-1">
                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                  <span>·</span>
                  <span>{item.views.toLocaleString()} interactions observed</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <RiskBadge level={item.risk_level} size="sm" />

                <button
                  onClick={() => onSelectAnalysis(item.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-[#F8F5EF] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <span>Re-open</span>
                  <ArrowRight size={13} />
                </button>

                <button
                  onClick={() => onDeleteAnalysis(item.id)}
                  className="p-1.5 text-[#A39989] hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                  title="Delete from history"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="liquid-glass rounded-3xl p-12 text-center text-[#5E5A54] space-y-2 border border-white/80 shadow-xs">
          <History size={32} className="mx-auto text-[#A39989] mb-2" />
          <div className="font-bold text-[#111111]">No analyses found</div>
          <p className="text-xs max-w-sm mx-auto">
            Try adjusting your search query or run a new content analysis from the Analyze tab.
          </p>
        </div>
      )}
    </div>
  );
};
