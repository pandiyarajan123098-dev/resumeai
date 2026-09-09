// ResumeX AI LocalStorage Data Storage & Synchronization Utility

const STORAGE_KEY_RESUMES = 'resumex_resumes';
const STORAGE_KEY_HISTORY = 'resumex_history';

// Default initial mock resumes if localStorage is empty
const INITIAL_RESUMES = [
  {
    id: 'res-1',
    name: 'Pandi_Resume.pdf',
    type: 'PDF',
    size: '1.8 MB',
    uploadedAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    targetRole: 'Frontend Developer',
    latestScore: 78,
  },
  {
    id: 'res-2',
    name: 'UIUX_Resume.pdf',
    type: 'PDF',
    size: '2.1 MB',
    uploadedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    targetRole: 'UI/UX Designer',
    latestScore: 65,
  },
  {
    id: 'res-3',
    name: 'Data_Analyst_Resume.pdf',
    type: 'PDF',
    size: '1.4 MB',
    uploadedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    targetRole: 'Data Analyst',
    latestScore: 52,
  },
];

/**
 * Retrieve all resumes from LocalStorage (initializes with default mock list if empty)
 */
export function getResumes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RESUMES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_RESUMES, JSON.stringify(INITIAL_RESUMES));
      return INITIAL_RESUMES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read resumes from LocalStorage:', e);
    return INITIAL_RESUMES;
  }
}

/**
 * Save a new resume entry or update an existing entry in LocalStorage
 */
export function saveResume(resume) {
  try {
    const current = getResumes();
    const existingIndex = current.findIndex(
      (r) => r.id === resume.id || r.name.toLowerCase() === resume.name.toLowerCase()
    );

    let updatedList;
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      // Update existing
      updatedList = [...current];
      updatedList[existingIndex] = {
        ...updatedList[existingIndex],
        ...resume,
        updatedAt: now,
      };
    } else {
      // Create new
      const newEntry = {
        id: resume.id || `res-${Date.now()}`,
        name: resume.name || 'Untitled_Resume.pdf',
        type: resume.type || 'PDF',
        size: resume.size || '1.5 MB',
        uploadedAt: now,
        updatedAt: now,
        targetRole: resume.targetRole || 'General',
        latestScore: resume.latestScore !== undefined ? resume.latestScore : null,
      };
      updatedList = [newEntry, ...current];
    }

    localStorage.setItem(STORAGE_KEY_RESUMES, JSON.stringify(updatedList));
    return updatedList;
  } catch (e) {
    console.error('Failed to save resume to LocalStorage:', e);
    return getResumes();
  }
}

/**
 * Update specific fields of a resume by ID
 */
export function updateResume(id, updatedFields) {
  try {
    const current = getResumes();
    const updatedList = current.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          ...updatedFields,
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    });

    localStorage.setItem(STORAGE_KEY_RESUMES, JSON.stringify(updatedList));
    return updatedList;
  } catch (e) {
    console.error('Failed to update resume:', e);
    return getResumes();
  }
}

/**
 * Delete a resume by ID
 */
export function deleteResume(id) {
  try {
    const current = getResumes();
    const updatedList = current.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY_RESUMES, JSON.stringify(updatedList));
    return updatedList;
  } catch (e) {
    console.error('Failed to delete resume:', e);
    return getResumes();
  }
}

/**
 * Save an analysis result and automatically update the corresponding resume's latest score & target role
 */
export function syncAnalysisToResume(analysis) {
  try {
    if (!analysis) return;
    const resumes = getResumes();
    const matched = resumes.find(
      (r) => r.name.toLowerCase() === (analysis.resumeName || '').toLowerCase()
    );

    if (matched) {
      updateResume(matched.id, {
        latestScore: analysis.score,
        targetRole: analysis.targetRole || analysis.target || matched.targetRole,
      });
    }
  } catch (e) {
    console.error('Failed to sync analysis to resume:', e);
  }
}

/**
 * Format date nicely for display (e.g. "Today", "Yesterday", or "Aug 28, 2026")
 */
export function formatDisplayDate(dateString) {
  if (!dateString) return 'Recent';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const now = new Date();
  const diffHours = (now - date) / (1000 * 60 * 60);

  if (diffHours < 24 && date.getDate() === now.getDate()) {
    return 'Today';
  } else if (diffHours < 48 && date.getDate() === now.getDate() - 1) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
