import React, { useState, useEffect } from 'react';
import { AnalysisResult, RiskLevel } from './types/analysis';
import { Sidebar, NavItemKey } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { CommandPalette } from './components/common/CommandPalette';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';
import { HomeView } from './components/views/HomeView';
import { DataSourcesView } from './components/views/DataSourcesView';
import { AnalyzeView } from './components/views/AnalyzeView';
import { CreatorLensView } from './components/views/CreatorLensView';
import { AudienceView } from './components/views/AudienceView';
import { TrendsView } from './components/views/TrendsView';
import { NetworkView } from './components/views/NetworkView';
import { ContentRiskView } from './components/views/ContentRiskView';
import { TimelineView } from './components/views/TimelineView';
import { CrossPlatformView } from './components/views/CrossPlatformView';
import { ReportsView } from './components/views/ReportsView';
import { HistoryView } from './components/views/HistoryView';
import { PrivacySettingsView } from './components/views/PrivacySettingsView';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavItemKey>('home');
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [historyList, setHistoryList] = useState<Array<{
    id: string;
    title: string;
    platform: string;
    risk_level: RiskLevel;
    timestamp: string;
    summary: string;
    views: number;
  }>>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in input or textarea or editable element
      const activeElement = document.activeElement;
      const isInput =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        (activeElement as HTMLElement)?.isContentEditable;

      // Cmd+K or Ctrl+K -> Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Quick navigation shortcuts with Cmd/Ctrl + Shift
      if ((e.metaKey || e.ctrlKey) && e.shiftKey) {
        const key = e.key.toLowerCase();
        if (key === 'a') {
          e.preventDefault();
          setActiveTab('analyze');
        } else if (key === 'p') {
          e.preventDefault();
          setActiveTab('reports');
        } else if (key === 'r') {
          e.preventDefault();
          setActiveTab('risk');
        } else if (key === 'd') {
          e.preventDefault();
          setActiveTab('data-sources');
        } else if (key === 'h') {
          e.preventDefault();
          setActiveTab('home');
        }
        return;
      }

      // Single key '?' shortcut to open shortcuts modal when not in input
      if (!isInput && e.key === '?') {
        e.preventDefault();
        setIsShortcutsModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistoryList(data);
        if (data.length > 0 && !currentAnalysis) {
          handleSelectHistoryItem(data[0].id);
        }
      }
    } catch (e) {
      console.warn('Failed to load history list:', e);
    }
  };

  const handleSelectHistoryItem = async (id: string) => {
    try {
      const res = await fetch(`/api/analysis/${id}`);
      if (res.ok) {
        const data: AnalysisResult = await res.json();
        setCurrentAnalysis(data);
        setActiveTab('home');
      }
    } catch (e) {
      console.warn('Error loading analysis item:', e);
    }
  };

  const handleDeleteHistoryItem = async (id: string) => {
    try {
      await fetch(`/api/history/${id}`, { method: 'DELETE' });
      fetchHistory();
      if (currentAnalysis?.id === id) {
        setCurrentAnalysis(null);
      }
    } catch (e) {
      setHistoryList((prev) => prev.filter((item) => item.id !== id));
      if (currentAnalysis?.id === id) {
        setCurrentAnalysis(null);
      }
    }
  };

  const handleClearAllHistory = async () => {
    try {
      await fetch('/api/history', { method: 'DELETE' });
      setHistoryList([]);
      setCurrentAnalysis(null);
    } catch (e) {
      setHistoryList([]);
      setCurrentAnalysis(null);
    }
  };

  const handleAnalysisCompleted = (newAnalysis: AnalysisResult) => {
    setCurrentAnalysis(newAnalysis);
    fetchHistory();
    setActiveTab('home');
  };

  return (
    <div className="flex min-h-screen bg-[#F3EEE7] text-[#111111]">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          currentAnalysis={currentAnalysis}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onNavigate={setActiveTab}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <ErrorBoundary key={activeTab} onReset={() => setActiveTab('home')}>
            {activeTab === 'home' && (
              <HomeView
                currentAnalysis={currentAnalysis}
                historyList={historyList}
                onSelectHistoryItem={handleSelectHistoryItem}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'data-sources' && (
              <DataSourcesView
                onNavigateToAnalyze={() => setActiveTab('analyze')}
              />
            )}

            {activeTab === 'analyze' && (
              <AnalyzeView
                onAnalysisComplete={handleAnalysisCompleted}
              />
            )}

            {activeTab === 'creator-lens' && (
              <CreatorLensView
                analysis={currentAnalysis}
                onNavigateToAnalyze={() => setActiveTab('analyze')}
              />
            )}

            {activeTab === 'audience' && (
              <AudienceView
                analysis={currentAnalysis}
                onNavigateToAnalyze={() => setActiveTab('analyze')}
              />
            )}

            {activeTab === 'trends' && (
              <TrendsView
                analysis={currentAnalysis}
                onNavigateToAnalyze={() => setActiveTab('analyze')}
              />
            )}

            {activeTab === 'network' && (
              <NetworkView
                analysis={currentAnalysis}
                onNavigateToAnalyze={() => setActiveTab('analyze')}
              />
            )}

            {activeTab === 'risk' && (
              <ContentRiskView
                analysis={currentAnalysis}
                onNavigateToAnalyze={() => setActiveTab('analyze')}
              />
            )}

            {activeTab === 'timeline' && (
              <TimelineView
                analysis={currentAnalysis}
                onNavigateToAnalyze={() => setActiveTab('analyze')}
              />
            )}

            {activeTab === 'cross-platform' && (
              <CrossPlatformView
                analysis={currentAnalysis}
                onNavigateToAnalyze={() => setActiveTab('analyze')}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsView
                analysis={currentAnalysis}
                onNavigateToAnalyze={() => setActiveTab('analyze')}
              />
            )}

            {activeTab === 'history' && (
              <HistoryView
                historyList={historyList}
                onSelectAnalysis={handleSelectHistoryItem}
                onDeleteAnalysis={handleDeleteHistoryItem}
                onClearAll={handleClearAllHistory}
                onNavigateToAnalyze={() => setActiveTab('analyze')}
              />
            )}

            {activeTab === 'privacy' && (
              <PrivacySettingsView />
            )}
          </ErrorBoundary>
        </main>
      </div>

      {/* Global Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setActiveTab}
        onOpenShortcutsHelp={() => setIsShortcutsModalOpen(true)}
      />

      {/* Global Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
    </div>
  );
}
