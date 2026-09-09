import React, { useState, useEffect } from 'react';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import AnalyzePage from './pages/AnalyzePage';
import ProcessingPage from './pages/ProcessingPage';
import ResultsPage from './pages/ResultsPage';
import ResumesPage from './pages/ResumesPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  // Authentication State with LocalStorage Persistence (default authenticated for instant demo)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const authStored = localStorage.getItem('resumex_authenticated');
    return authStored === null ? true : authStored === 'true';
  });

  const [activeTab, setActiveTab] = useState('analyze');
  const [searchQuery, setSearchQuery] = useState('');

  const [resumeData, setResumeData] = useState({
    name: 'Pandi_Resume.pdf',
    size: '1.8 MB',
    targetRole: 'Frontend Developer',
  });

  const [analysisSetup, setAnalysisSetup] = useState({
    name: 'Pandi_Resume.pdf',
    size: '1.8 MB',
    type: 'domain',
    typeLabel: 'Domain Analysis',
    target: 'Frontend Developer',
    targetRole: 'Frontend Developer',
  });

  const [analysisResult, setAnalysisResult] = useState(null);

  const handleNavigate = (tab, data) => {
    if (data) {
      if (tab === 'analyze') {
        setResumeData(data);
      }
      if (tab === 'processing') {
        setAnalysisSetup(data);
      }
      if (tab === 'results') {
        setAnalysisResult(data);
      }
    }
    setActiveTab(tab);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleSignOut = () => {
    localStorage.removeItem('resumex_authenticated');
    setIsAuthenticated(false);
  };

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'upload':
        return <UploadPage onNavigate={handleNavigate} />;
      case 'analyze':
        return (
          <AnalyzePage
            onNavigate={handleNavigate}
            resumeData={resumeData}
            onStartAnalysis={(setupData) => setAnalysisSetup(setupData)}
          />
        );
      case 'processing':
        return (
          <ProcessingPage
            analysisSetup={analysisSetup}
            onNavigate={handleNavigate}
          />
        );
      case 'results':
        return (
          <ResultsPage
            analysisResult={analysisResult}
            analysisSetup={analysisSetup}
            onNavigate={handleNavigate}
          />
        );
      case 'resumes':
        return <ResumesPage onNavigate={handleNavigate} />;
      case 'history':
        return <HistoryPage onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsPage onNavigate={handleNavigate} />;
      default:
        return (
          <AnalyzePage
            onNavigate={handleNavigate}
            resumeData={resumeData}
            onStartAnalysis={(setupData) => setAnalysisSetup(setupData)}
          />
        );
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <AppLayout
      activeTab={activeTab === 'processing' || activeTab === 'results' ? 'analyze' : activeTab}
      onSelectTab={handleNavigate}
      onSearch={setSearchQuery}
      onSignOut={handleSignOut}
    >
      {renderCurrentPage()}
    </AppLayout>
  );
}
