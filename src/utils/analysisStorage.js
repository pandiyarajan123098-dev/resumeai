// ResumeX AI Analysis History LocalStorage Storage & Synchronization Utility
import { syncAnalysisToResume } from './resumeStorage';

const STORAGE_KEY_HISTORY = 'resumex_history';

// Initial mock analysis history entries for testing & immediate usability
const INITIAL_HISTORY = [
  {
    id: 'hist-1',
    resumeId: 'res-1',
    resumeName: 'Pandi_Resume.pdf',
    analysisType: 'domain',
    typeLabel: 'Domain Analysis',
    target: 'Frontend Developer',
    targetRole: 'Frontend Developer',
    score: 78,
    breakdown: [
      { name: 'Skills Match', value: 85, color: 'var(--success)' },
      { name: 'Experience', value: 72, color: 'var(--primary)' },
      { name: 'Projects', value: 68, color: 'var(--secondary)' },
      { name: 'Keywords', value: 60, color: 'var(--warning)' },
      { name: 'Resume Structure', value: 90, color: 'var(--success)' },
    ],
    strengths: [
      { title: 'Strong Technical Foundation', desc: 'Your resume demonstrates relevant frontend development skills.' },
      { title: 'Good Resume Structure', desc: 'Your sections are clear and easy to scan.' },
      { title: 'Relevant Development Experience', desc: 'Your experience aligns well with the selected role.' },
    ],
    improvements: [
      { title: 'Improve Keyword Coverage', desc: 'Add relevant terms such as React, TypeScript, APIs, and testing where applicable.', priority: 'High', priorityVariant: 'danger' },
      { title: 'Add Stronger Project Details', desc: 'Explain your contribution and technologies used.', priority: 'Medium', priorityVariant: 'warning' },
      { title: 'Include Measurable Results', desc: 'Show impact using numbers where possible.', priority: 'Low', priorityVariant: 'indigo' },
    ],
    recommendedSkills: ['TypeScript', 'Next.js', 'REST APIs', 'Testing', 'State Management'],
    createdAt: new Date().toISOString(), // Today
  },
  {
    id: 'hist-2',
    resumeId: 'res-1',
    resumeName: 'Pandi_Resume.pdf',
    analysisType: 'domain',
    typeLabel: 'Domain Analysis',
    target: 'Frontend Developer',
    targetRole: 'Frontend Developer',
    score: 66,
    breakdown: [
      { name: 'Skills Match', value: 78, color: 'var(--primary)' },
      { name: 'Experience', value: 70, color: 'var(--primary)' },
      { name: 'Projects', value: 55, color: 'var(--warning)' },
      { name: 'Keywords', value: 52, color: 'var(--warning)' },
      { name: 'Resume Structure', value: 85, color: 'var(--success)' },
    ],
    strengths: [
      { title: 'Solid CSS & Layout Foundation', desc: 'Clear semantic HTML structures.' },
      { title: 'Readable Work History', desc: 'Clean chronological formatting.' },
    ],
    improvements: [
      { title: 'Low Keyword Density', desc: 'Missing core modern framework terms.', priority: 'High', priorityVariant: 'danger' },
      { title: 'Project Metrics Missing', desc: 'No quantifiable outcomes.', priority: 'High', priorityVariant: 'danger' },
    ],
    recommendedSkills: ['React', 'TypeScript', 'Git', 'Webpack'],
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  },
  {
    id: 'hist-3',
    resumeId: 'res-2',
    resumeName: 'UIUX_Resume.pdf',
    analysisType: 'company',
    typeLabel: 'Company + Role',
    target: 'Figma (UI/UX Designer)',
    targetRole: 'UI/UX Designer',
    company: 'Figma',
    score: 65,
    breakdown: [
      { name: 'Skills Match', value: 70, color: 'var(--secondary)' },
      { name: 'Experience', value: 60, color: 'var(--warning)' },
      { name: 'Projects', value: 75, color: 'var(--primary)' },
      { name: 'Keywords', value: 55, color: 'var(--warning)' },
      { name: 'Resume Structure', value: 82, color: 'var(--success)' },
    ],
    strengths: [
      { title: 'Strong Portfolio Links', desc: 'Direct links to case studies.' },
      { title: 'Design System Competency', desc: 'Figma component auto-layout mastery.' },
    ],
    improvements: [
      { title: 'User Testing Evidence', desc: 'Include usability test metrics.', priority: 'High', priorityVariant: 'danger' },
    ],
    recommendedSkills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(), // Aug 28
  },
  {
    id: 'hist-4',
    resumeId: 'res-3',
    resumeName: 'Data_Analyst_Resume.pdf',
    analysisType: 'domain',
    typeLabel: 'Domain Analysis',
    target: 'Data Analyst',
    targetRole: 'Data Analyst',
    score: 52,
    breakdown: [
      { name: 'Skills Match', value: 55, color: 'var(--warning)' },
      { name: 'Experience', value: 50, color: 'var(--warning)' },
      { name: 'Projects', value: 48, color: 'var(--danger)' },
      { name: 'Keywords', value: 45, color: 'var(--danger)' },
      { name: 'Resume Structure', value: 70, color: 'var(--primary)' },
    ],
    strengths: [
      { title: 'Basic SQL Knowledge', desc: 'Mentions basic relational querying.' },
    ],
    improvements: [
      { title: 'Missing Python & Tableau', desc: 'Add data visualization tools.', priority: 'High', priorityVariant: 'danger' },
    ],
    recommendedSkills: ['Python', 'SQL', 'Tableau', 'Pandas', 'PowerBI'],
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(), // Aug 25
  },
];

/**
 * Get all saved analysis history items from LocalStorage
 */
export function getAnalyses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(INITIAL_HISTORY));
      return INITIAL_HISTORY;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read analysis history:', e);
    return INITIAL_HISTORY;
  }
}

/**
 * Save a NEW analysis result entry into LocalStorage (never overwrites old entries!)
 * Also automatically syncs latest score to the corresponding resume in resumeStorage.
 */
export function saveAnalysis(analysisData) {
  try {
    const current = getAnalyses();
    const newEntry = {
      id: analysisData.id || `hist-${Date.now()}`,
      resumeId: analysisData.resumeId || 'res-1',
      resumeName: analysisData.resumeName || 'Pandi_Resume.pdf',
      analysisType: analysisData.analysisType || 'domain',
      typeLabel: analysisData.typeLabel || 'Domain Analysis',
      target: analysisData.target || 'Frontend Developer',
      targetRole: analysisData.targetRole || 'Frontend Developer',
      company: analysisData.company || '',
      score: analysisData.score || 78,
      breakdown: analysisData.breakdown || [],
      strengths: analysisData.strengths || [],
      improvements: analysisData.improvements || [],
      recommendedSkills: analysisData.recommendedSkills || [],
      createdAt: analysisData.createdAt || new Date().toISOString(),
    };

    // Prepend to history so newest appears first
    const updatedHistory = [newEntry, ...current];
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedHistory));

    // Automatically sync score to corresponding resume
    syncAnalysisToResume(newEntry);

    return updatedHistory;
  } catch (e) {
    console.error('Failed to save analysis history:', e);
    return getAnalyses();
  }
}

/**
 * Get a specific analysis history item by ID
 */
export function getAnalysisById(id) {
  const current = getAnalyses();
  return current.find((a) => a.id === id) || null;
}

/**
 * Get all historical analyses for a specific resume (sorted chronologically)
 */
export function getResumeAnalyses(resumeName) {
  const current = getAnalyses();
  return current
    .filter((a) => a.resumeName.toLowerCase() === (resumeName || '').toLowerCase())
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

/**
 * Calculate the score change percentage comparing an analysis item with the previous analysis for the same resume.
 * Returns object: { changeVal: 12, changeText: '+12%', isPositive: true, hasPrev: true }
 */
export function calculateScoreChange(item, allAnalyses) {
  if (!item || !allAnalyses) return { hasPrev: false, changeText: '—' };

  // Filter analyses for the exact same resume, sorted oldest to newest
  const sameResumeAnalyses = allAnalyses
    .filter((a) => a.resumeName.toLowerCase() === item.resumeName.toLowerCase())
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const itemIndex = sameResumeAnalyses.findIndex((a) => a.id === item.id);

  if (itemIndex <= 0) {
    return { hasPrev: false, changeText: '—' }; // First analysis for this resume
  }

  const prevAnalysis = sameResumeAnalyses[itemIndex - 1];
  const diff = item.score - prevAnalysis.score;

  return {
    hasPrev: true,
    prevScore: prevAnalysis.score,
    prevAnalysis,
    diff,
    changeText: diff > 0 ? `+${diff}%` : diff < 0 ? `${diff}%` : '0%',
    isPositive: diff > 0,
    isNegative: diff < 0,
  };
}

/**
 * Delete an analysis entry by ID
 */
export function deleteAnalysis(id) {
  try {
    const current = getAnalyses();
    const updated = current.filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete analysis history:', e);
    return getAnalyses();
  }
}
