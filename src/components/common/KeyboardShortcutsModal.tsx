import React from 'react';
import { X, Command, Keyboard, Sparkles } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcutsList = [
    {
      category: 'Command Palette & Help',
      items: [
        { key: '⌘ K  or  Ctrl K', desc: 'Open Command Palette' },
        { key: '?', desc: 'Toggle Keyboard Shortcuts Modal' },
        { key: 'ESC', desc: 'Close open modal or dropdown' },
      ],
    },
    {
      category: 'Primary Actions',
      items: [
        { key: '⌘ Shift A', desc: 'Start New Analysis ("Analyze This")' },
        { key: '⌘ Shift P', desc: 'Generate & Export Intelligence Report' },
        { key: '⌘ Shift D', desc: 'View Data Sources & API Status' },
        { key: '⌘ Shift R', desc: 'View Content Risk Matrix' },
        { key: '⌘ Shift H', desc: 'Navigate to Executive Overview' },
      ],
    },
    {
      category: 'Analysis Navigation',
      items: [
        { key: '1', desc: 'Switch to Creator Lens' },
        { key: '2', desc: 'Switch to Audience Sentiment' },
        { key: '3', desc: 'Switch to Narrative Trends' },
        { key: '4', desc: 'Switch to Propagation Network' },
        { key: '5', desc: 'Switch to Temporal Timeline' },
        { key: '6', desc: 'Switch to Cross-Platform Spread' },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#F8F5EF] border border-[#D8CFC2] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D8CFC2]/70 bg-white/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#111111] text-[#F8F5EF] rounded-xl">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#111111]">Keyboard Shortcuts</h3>
              <p className="text-xs text-[#5E5A54]">Quick key combinations for rapid navigation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#5E5A54] hover:text-[#111111] hover:bg-[#E8DFD2]/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts grid */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {shortcutsList.map((sec) => (
            <div key={sec.category} className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#5E5A54] border-b border-[#D8CFC2]/40 pb-1">
                {sec.category}
              </h4>
              <div className="space-y-2">
                {sec.items.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between text-sm px-3 py-2 rounded-xl bg-white/70 border border-[#D8CFC2]/60"
                  >
                    <span className="font-semibold text-[#111111] text-xs sm:text-sm">{item.desc}</span>
                    <kbd className="px-2.5 py-1 text-xs font-mono font-bold text-[#111111] bg-[#E8DFD2] border border-[#D8CFC2] rounded-lg shadow-2xs">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#EFE9DF] border-t border-[#D8CFC2]/80 flex items-center justify-between text-xs text-[#5E5A54]">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Pro tip: Press <kbd className="px-1.5 py-0.5 bg-white border border-[#D8CFC2] rounded font-bold">⌘K</kbd> anywhere to search</span>
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#111111] text-[#F8F5EF] rounded-lg font-bold hover:bg-[#2A2A2A] transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
