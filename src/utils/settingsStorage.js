// ResumeX AI Settings & Data Management LocalStorage Utility

const STORAGE_KEY_PROFILE = 'resumex_profile';
const STORAGE_KEY_PREFERENCES = 'resumex_preferences';
const STORAGE_KEY_RESUMES = 'resumex_resumes';
const STORAGE_KEY_HISTORY = 'resumex_history';

const DEFAULT_PROFILE = {
  name: 'Pandi',
  email: 'pandi@example.com',
};

const DEFAULT_PREFERENCES = {
  defaultTargetRole: 'Frontend Developer',
  defaultAnalysisType: 'domain',
};

/**
 * Retrieve user profile settings
 */
export function getProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read profile:', e);
    return DEFAULT_PROFILE;
  }
}

/**
 * Save user profile settings
 */
export function saveProfile(profileData) {
  try {
    const updated = {
      ...getProfile(),
      ...profileData,
    };
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updated));

    // Dispatch custom storage event for instant UI sync
    window.dispatchEvent(new Event('resumex_profile_updated'));
    return updated;
  } catch (e) {
    console.error('Failed to save profile:', e);
    return getProfile();
  }
}

/**
 * Retrieve application analysis preferences
 */
export function getPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFERENCES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PREFERENCES, JSON.stringify(DEFAULT_PREFERENCES));
      return DEFAULT_PREFERENCES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read preferences:', e);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Save application analysis preferences
 */
export function savePreferences(preferencesData) {
  try {
    const updated = {
      ...getPreferences(),
      ...preferencesData,
    };
    localStorage.setItem(STORAGE_KEY_PREFERENCES, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save preferences:', e);
    return getPreferences();
  }
}

/**
 * Export all user data (profile, preferences, resume metadata, analysis history) as JSON
 */
export function exportAllData() {
  try {
    const profile = getProfile();
    const preferences = getPreferences();
    const resumes = JSON.parse(localStorage.getItem(STORAGE_KEY_RESUMES) || '[]');
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY) || '[]');

    const dataPayload = {
      app: 'ResumeX AI',
      exportedAt: new Date().toISOString(),
      profile,
      preferences,
      resumes,
      analysisHistory: history,
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataPayload, null, 2)
    )}`;

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `resumex_ai_data_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    return true;
  } catch (e) {
    console.error('Failed to export data:', e);
    return false;
  }
}

/**
 * Clear all demo data (removes resumes & analysis history while preserving settings)
 */
export function clearAllDemoData() {
  try {
    localStorage.removeItem(STORAGE_KEY_RESUMES);
    localStorage.removeItem(STORAGE_KEY_HISTORY);

    // Re-initialize empty lists
    localStorage.setItem(STORAGE_KEY_RESUMES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify([]));

    // Dispatch event for UI updates
    window.dispatchEvent(new Event('resumex_data_cleared'));
    return true;
  } catch (e) {
    console.error('Failed to clear demo data:', e);
    return false;
  }
}
