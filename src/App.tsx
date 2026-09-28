import React, { useState, useEffect } from 'react';
import { AnalysisResult, AnalysisScenario, RiskLevel } from './types/analysis';
import { SCENARIO_1_DEEPFAKE, SEEDED_SCENARIOS } from './data/seedScenarios';
import { Sidebar, NavItemKey } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { HomeView } from './components/views/HomeView';
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
import { CompanionSimulatorView } from './components/views/CompanionSimulatorView';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavItemKey>('home');
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult>(SCENARIO_1_DEEPFAKE);
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

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistoryList(data);
      }
    } catch (e) {
      console.warn('Failed to load history list:', e);
      // Fallback to seeded scenarios
      setHistoryList(
        SEEDED_SCENARIOS.map((s) => ({
          id: s.data.id,
          title: s.data.title,
          platform: s.platform,
          risk_level: s.risk_badge,
          timestamp: s.data.timestamp,
          summary: s.data.answers.what_is_happening,
          views: s.data.content.engagement.views,
        }))
      );
    }
  };

  const handleSelectScenario = (scenario: AnalysisScenario) => {
    setCurrentAnalysis(scenario.data);
    setActiveTab('home');
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
      const fallback = SEEDED_SCENARIOS.find((s) => s.data.id === id);
      if (fallback) {
        setCurrentAnalysis(fallback.data);
        setActiveTab('home');
      }
    }
  };

  const handleDeleteHistoryItem = async (id: string) => {
    try {
      await fetch(`/api/history/${id}`, { method: 'DELETE' });
      fetchHistory();
    } catch (e) {
      setHistoryList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleClearAllHistory = async () => {
    try {
      await fetch('/api/history', { method: 'DELETE' });
      setHistoryList([]);
    } catch (e) {
      setHistoryList([]);
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
        />

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'home' && (
            <HomeView
              currentAnalysis={currentAnalysis}
              historyList={historyList}
              onSelectScenario={handleSelectScenario}
              onSelectHistoryItem={handleSelectHistoryItem}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'analyze' && (
            <AnalyzeView
              onAnalysisComplete={handleAnalysisCompleted}
              onSelectScenario={handleSelectScenario}
            />
          )}

          {activeTab === 'creator-lens' && (
            <CreatorLensView analysis={currentAnalysis} />
          )}

          {activeTab === 'audience' && (
            <AudienceView analysis={currentAnalysis} />
          )}

          {activeTab === 'trends' && (
            <TrendsView analysis={currentAnalysis} />
          )}

          {activeTab === 'network' && (
            <NetworkView analysis={currentAnalysis} />
          )}

          {activeTab === 'risk' && (
            <ContentRiskView analysis={currentAnalysis} />
          )}

          {activeTab === 'timeline' && (
            <TimelineView analysis={currentAnalysis} />
          )}

          {activeTab === 'cross-platform' && (
            <CrossPlatformView analysis={currentAnalysis} />
          )}

          {activeTab === 'reports' && (
            <ReportsView analysis={currentAnalysis} />
          )}

          {activeTab === 'history' && (
            <HistoryView
              historyList={historyList}
              onSelectAnalysis={handleSelectHistoryItem}
              onDeleteAnalysis={handleDeleteHistoryItem}
              onClearAll={handleClearAllHistory}
            />
          )}

          {activeTab === 'privacy' && (
            <PrivacySettingsView />
          )}

          {activeTab === 'companion' && (
            <CompanionSimulatorView
              onLoadSimulatedAnalysis={(result) => {
                setCurrentAnalysis(result);
                setActiveTab('risk');
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
