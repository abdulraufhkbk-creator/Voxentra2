import React from 'react';
import {
  Compass,
  Search,
  Users,
  TrendingUp,
  Share2,
  ShieldAlert,
  Clock,
  Layers,
  FileText,
  History,
  ShieldCheck,
  Chrome,
  Sparkles,
} from 'lucide-react';

export type NavItemKey =
  | 'home'
  | 'analyze'
  | 'creator-lens'
  | 'audience'
  | 'trends'
  | 'network'
  | 'risk'
  | 'timeline'
  | 'cross-platform'
  | 'reports'
  | 'history'
  | 'privacy'
  | 'companion';

interface SidebarProps {
  activeTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems: Array<{ key: NavItemKey; label: string; icon: React.FC<{ size?: number; className?: string }>; badge?: string }> = [
    { key: 'home', label: 'Home', icon: Compass },
    { key: 'analyze', label: 'Analyze Content', icon: Search },
    { key: 'creator-lens', label: 'Creator Lens', icon: Sparkles, badge: 'NEW' },
    { key: 'audience', label: 'Audience Intelligence', icon: Users },
    { key: 'trends', label: 'Trends & Narratives', icon: TrendingUp },
    { key: 'network', label: 'Network & Influence', icon: Share2 },
    { key: 'risk', label: 'Content Risk', icon: ShieldAlert },
    { key: 'timeline', label: 'Timeline', icon: Clock },
    { key: 'cross-platform', label: 'Cross-Platform', icon: Layers },
    { key: 'reports', label: 'Reports', icon: FileText },
    { key: 'history', label: 'Analysis History', icon: History },
    { key: 'privacy', label: 'Privacy & Settings', icon: ShieldCheck },
    { key: 'companion', label: 'Browser Companion', icon: Chrome, badge: 'v1.0' },
  ];

  const handleSelect = (key: NavItemKey) => {
    onSelectTab(key);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-[#111111]/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 w-64 bg-[#F8F5EF]/85 backdrop-blur-2xl border-r border-[#D8CFC2]/70 flex flex-col z-50 transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand header */}
        <div className="p-6 border-b border-[#D8CFC2]/60 flex items-center justify-between">
          <button
            onClick={() => handleSelect('home')}
            className="flex items-center gap-3.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#111111] text-[#F8F5EF] flex items-center justify-center font-extrabold text-base shadow-sm group-hover:scale-105 transition-transform">
              V
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-[#111111] group-hover:opacity-80 transition-opacity">
                VOXENTRA
              </div>
              <div className="text-[10px] font-semibold tracking-wider text-[#5E5A54] uppercase">
                Social Intelligence
              </div>
            </div>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleSelect(item.key)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#111111] text-[#F8F5EF] shadow-sm'
                    : 'text-[#5E5A54] hover:text-[#111111] hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={16}
                    className={isActive ? 'text-[#F8F5EF]' : 'text-[#7D786F]'}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isActive
                        ? 'bg-white/20 text-[#F8F5EF]'
                        : 'bg-[#E8DFD2] text-[#5E5A54]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Privacy commitment card */}
        <div className="p-4 border-t border-[#D8CFC2]/60">
          <div className="liquid-glass p-3.5 rounded-xl text-[11px] text-[#5E5A54] space-y-1 shadow-xs">
            <div className="flex items-center gap-1.5 text-[#111111] font-bold">
              <ShieldCheck size={14} className="text-[#111111]" />
              <span>Privacy-First Principle</span>
            </div>
            <p className="leading-relaxed">
              Analyze the content, not the person. Zero personal profiling or credential harvesting.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
