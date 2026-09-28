import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  LayoutDashboard,
  ShieldAlert,
  Database,
  FileText,
  Video,
  Users,
  TrendingUp,
  Share2,
  Clock,
  Globe,
  History,
  Lock,
  Sparkles,
  Command,
  ArrowRight,
  X,
  Keyboard
} from 'lucide-react';
import { NavItemKey } from '../layout/Sidebar';

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Navigation' | 'Actions' | 'Analysis Views';
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavItemKey) => void;
  onOpenShortcutsHelp: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenShortcutsHelp,
}) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const commands: CommandItem[] = [
    {
      id: 'action-analyze',
      title: 'Analyze New Content or URL',
      subtitle: 'Run deepfake detection, risk evaluation & sentiment analysis',
      category: 'Actions',
      icon: <Sparkles className="w-4 h-4 text-emerald-600" />,
      shortcut: '⌘ Shift A',
      action: () => {
        onNavigate('analyze');
        onClose();
      },
    },
    {
      id: 'action-report',
      title: 'Generate Executive Intelligence Report',
      subtitle: 'Download PDF or print intelligence dossier',
      category: 'Actions',
      icon: <FileText className="w-4 h-4 text-indigo-600" />,
      shortcut: '⌘ Shift P',
      action: () => {
        onNavigate('reports');
        onClose();
      },
    },
    {
      id: 'action-shortcuts',
      title: 'View Keyboard Shortcuts',
      subtitle: 'See all key combinations and quick navigation commands',
      category: 'Actions',
      icon: <Keyboard className="w-4 h-4 text-[#5E5A54]" />,
      shortcut: '?',
      action: () => {
        onClose();
        onOpenShortcutsHelp();
      },
    },
    {
      id: 'nav-home',
      title: 'Executive Dashboard',
      subtitle: 'System overview, threat velocity & top insights',
      category: 'Navigation',
      icon: <LayoutDashboard className="w-4 h-4 text-[#111111]" />,
      shortcut: '⌘ Shift H',
      action: () => {
        onNavigate('home');
        onClose();
      },
    },
    {
      id: 'nav-risk',
      title: 'Content Risk Assessment',
      subtitle: 'Misinformation threat matrix & deepfake score',
      category: 'Analysis Views',
      icon: <ShieldAlert className="w-4 h-4 text-amber-600" />,
      shortcut: '⌘ Shift R',
      action: () => {
        onNavigate('risk');
        onClose();
      },
    },
    {
      id: 'nav-data-sources',
      title: 'Data Sources & API Status',
      subtitle: 'Live API connectors & endpoint rate limits',
      category: 'Navigation',
      icon: <Database className="w-4 h-4 text-emerald-600" />,
      shortcut: '⌘ Shift D',
      action: () => {
        onNavigate('data-sources');
        onClose();
      },
    },
    {
      id: 'nav-creator',
      title: 'Creator & Channel Lens',
      subtitle: 'Account authenticity & historical footprint',
      category: 'Analysis Views',
      icon: <Video className="w-4 h-4 text-blue-600" />,
      action: () => {
        onNavigate('creator-lens');
        onClose();
      },
    },
    {
      id: 'nav-audience',
      title: 'Audience & Bot Sentiment',
      subtitle: 'Synthetic amplification & bot ratio analysis',
      category: 'Analysis Views',
      icon: <Users className="w-4 h-4 text-purple-600" />,
      action: () => {
        onNavigate('audience');
        onClose();
      },
    },
    {
      id: 'nav-trends',
      title: 'Narrative Trends & Virality',
      subtitle: 'Topic growth rates & key phrase velocity',
      category: 'Analysis Views',
      icon: <TrendingUp className="w-4 h-4 text-rose-600" />,
      action: () => {
        onNavigate('trends');
        onClose();
      },
    },
    {
      id: 'nav-network',
      title: 'Propagation Network Dynamics',
      subtitle: 'Visual node graphs & seed channel mapping',
      category: 'Analysis Views',
      icon: <Share2 className="w-4 h-4 text-cyan-600" />,
      action: () => {
        onNavigate('network');
        onClose();
      },
    },
    {
      id: 'nav-timeline',
      title: 'Temporal Evolution Timeline',
      subtitle: 'Chronological message spread and milestones',
      category: 'Analysis Views',
      icon: <Clock className="w-4 h-4 text-amber-700" />,
      action: () => {
        onNavigate('timeline');
        onClose();
      },
    },
    {
      id: 'nav-cross',
      title: 'Cross-Platform Spread',
      subtitle: 'YouTube, TikTok, Telegram & Reddit contagion',
      category: 'Analysis Views',
      icon: <Globe className="w-4 h-4 text-teal-600" />,
      action: () => {
        onNavigate('cross-platform');
        onClose();
      },
    },
    {
      id: 'nav-history',
      title: 'Analysis History Log',
      subtitle: 'Archived dossiers and past content scans',
      category: 'Navigation',
      icon: <History className="w-4 h-4 text-[#5E5A54]" />,
      action: () => {
        onNavigate('history');
        onClose();
      },
    },
    {
      id: 'nav-privacy',
      title: 'Privacy & Governance Settings',
      subtitle: 'Data retention policies & AI model disclaimers',
      category: 'Navigation',
      icon: <Lock className="w-4 h-4 text-[#5E5A54]" />,
      action: () => {
        onNavigate('privacy');
        onClose();
      },
    },
  ];

  // Filter commands by search string
  const filteredCommands = commands.filter((cmd) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;
    return (
      cmd.title.toLowerCase().includes(query) ||
      (cmd.subtitle && cmd.subtitle.toLowerCase().includes(query)) ||
      cmd.category.toLowerCase().includes(query)
    );
  });

  // Handle keyboard navigation inside command palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#F8F5EF] border border-[#D8CFC2] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-all"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#D8CFC2]/70 bg-white/80 gap-3">
          <Search className="w-5 h-5 text-[#5E5A54] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search commands, views, or actions... (Try 'Analyze' or 'Risk')"
            className="w-full bg-transparent border-none outline-none text-sm font-semibold text-[#111111] placeholder:text-[#5E5A54]/60 placeholder:font-normal"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-[#5E5A54] hover:text-[#111111] p-1 rounded-lg hover:bg-[#E8DFD2]/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold text-[#5E5A54] bg-[#E8DFD2]/60 border border-[#D8CFC2] rounded-md shadow-2xs shrink-0">
            ESC
          </kbd>
        </div>

        {/* Command List Container */}
        <div ref={listRef} className="overflow-y-auto p-2 space-y-1 divide-y divide-[#D8CFC2]/30">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#5E5A54]">
              No matching commands or views found for &ldquo;{search}&rdquo;.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#111111] text-[#F8F5EF] shadow-sm translate-x-0.5'
                      : 'text-[#111111] hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected ? 'bg-white/10 text-white' : 'bg-white border border-[#D8CFC2]/80'
                      }`}
                    >
                      {cmd.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold truncate">{cmd.title}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-mono uppercase tracking-wider ${
                            isSelected
                              ? 'bg-white/20 text-[#F8F5EF]'
                              : 'bg-[#E8DFD2]/70 text-[#5E5A54]'
                          }`}
                        >
                          {cmd.category}
                        </span>
                      </div>
                      {cmd.subtitle && (
                        <p
                          className={`text-xs truncate ${
                            isSelected ? 'text-[#F8F5EF]/80' : 'text-[#5E5A54]'
                          }`}
                        >
                          {cmd.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {cmd.shortcut && (
                      <kbd
                        className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                          isSelected
                            ? 'bg-white/20 text-[#F8F5EF]'
                            : 'bg-[#E8DFD2] text-[#5E5A54] border border-[#D8CFC2]'
                        }`}
                      >
                        {cmd.shortcut}
                      </kbd>
                    )}
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'translate-x-0.5 opacity-100' : 'opacity-0'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2.5 bg-[#EFE9DF] border-t border-[#D8CFC2]/80 flex items-center justify-between text-xs text-[#5E5A54] font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-white border border-[#D8CFC2] rounded">↑</kbd>
              <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-white border border-[#D8CFC2] rounded">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-white border border-[#D8CFC2] rounded">↵</kbd>
              <span>to select</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Command className="w-3.5 h-3.5 text-[#111111]" />
            <span className="font-bold text-[#111111]">Voxentra Command Palette</span>
          </div>
        </div>
      </div>
    </div>
  );
};
