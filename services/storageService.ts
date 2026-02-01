
import { SurveyResponse, AdminProfile, Survey, Winner, CryptoLog } from '../types';

const STORAGE_KEYS = {
  RESPONSES: 'local_survey_responses',
  ADMIN: 'local_admin_profile',
  SURVEYS: 'local_surveys_list',
  PARTICIPATED: 'local_participated_surveys',
  BLOCKED_ATTEMPTS: 'local_blocked_attempts',
  WINNERS: 'local_survey_winners',
  CRYPTO_LOGS: 'local_crypto_payout_logs'
};

const getFingerprint = () => {
  return btoa([
    navigator.userAgent,
    screen.width,
    screen.height,
    navigator.language
  ].join('|')).slice(0, 16);
};

export const storageService = {
  saveAdmin: (profile: AdminProfile) => {
    localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(profile));
  },
  getAdmin: (): AdminProfile | null => {
    const data = localStorage.getItem(STORAGE_KEYS.ADMIN);
    return data ? JSON.parse(data) : null;
  },

  saveSurvey: (survey: Survey) => {
    const surveys = storageService.getAllSurveys();
    const index = surveys.findIndex(s => s.id === survey.id);
    if (index >= 0) surveys[index] = survey;
    else surveys.unshift(survey);
    localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(surveys));
  },
  getAllSurveys: (): Survey[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SURVEYS);
    return data ? JSON.parse(data) : [];
  },
  getSurveyById: (id: string): Survey | null => {
    return storageService.getAllSurveys().find(s => s.id === id) || null;
  },
  getActiveSurvey: (): Survey | null => {
    const surveys = storageService.getAllSurveys();
    return surveys.find(s => s.status === 'PUBLISHED') || null;
  },

  hasParticipated: (surveyId: string): boolean => {
    const data = localStorage.getItem(STORAGE_KEYS.PARTICIPATED);
    const list = data ? JSON.parse(data) : [];
    const responses = storageService.getResponsesBySurvey(surveyId);
    const fingerprint = getFingerprint();
    const fingerprintMatch = responses.some(r => r.metadata.fingerprint === fingerprint);
    return list.includes(surveyId) || fingerprintMatch;
  },

  recordParticipation: (surveyId: string) => {
    const data = localStorage.getItem(STORAGE_KEYS.PARTICIPATED);
    const list = data ? JSON.parse(data) : [];
    if (!list.includes(surveyId)) {
      list.push(surveyId);
      localStorage.setItem(STORAGE_KEYS.PARTICIPATED, JSON.stringify(list));
    }
  },

  recordBlockedAttempt: (surveyId: string) => {
    const data = localStorage.getItem(STORAGE_KEYS.BLOCKED_ATTEMPTS);
    const map = data ? JSON.parse(data) : {};
    map[surveyId] = (map[surveyId] || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.BLOCKED_ATTEMPTS, JSON.stringify(map));
  },

  getBlockedAttempts: (surveyId: string): number => {
    const data = localStorage.getItem(STORAGE_KEYS.BLOCKED_ATTEMPTS);
    const map = data ? JSON.parse(data) : {};
    return map[surveyId] || 0;
  },

  // Lottery Logic
  drawWinners: (surveyId: string, count: number): Winner[] => {
    const responses = storageService.getResponsesBySurvey(surveyId);
    const valid = responses.filter(r => Object.keys(r.answers).length > 0);
    
    const arr = [...valid];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    
    const picked = arr.slice(0, count);
    const winners: Winner[] = picked.map(p => ({
      userId: p.metadata.fingerprint || p.id,
      surveyId,
      status: 'PENDING',
      notified: false,
      timestamp: Date.now()
    }));

    const allWinners = storageService.getAllWinners();
    const filtered = allWinners.filter(w => w.surveyId !== surveyId);
    const updated = [...filtered, ...winners];
    localStorage.setItem(STORAGE_KEYS.WINNERS, JSON.stringify(updated));
    return winners;
  },

  getAllWinners: (): Winner[] => {
    const data = localStorage.getItem(STORAGE_KEYS.WINNERS);
    return data ? JSON.parse(data) : [];
  },

  getWinnersBySurvey: (surveyId: string): Winner[] => {
    return storageService.getAllWinners().filter(w => w.surveyId === surveyId);
  },

  updateWinnerStatus: (surveyId: string, userId: string, updates: Partial<Winner>) => {
    const all = storageService.getAllWinners();
    const idx = all.findIndex(w => w.surveyId === surveyId && w.userId === userId);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...updates };
      localStorage.setItem(STORAGE_KEYS.WINNERS, JSON.stringify(all));
    }
  },

  // Crypto Logs
  addCryptoLog: (log: CryptoLog) => {
    const data = localStorage.getItem(STORAGE_KEYS.CRYPTO_LOGS);
    const logs = data ? JSON.parse(data) : [];
    // Remove duplicate hash logs for same survey if they exist
    const filtered = logs.filter((l: CryptoLog) => l.txHash !== log.txHash);
    filtered.push(log);
    localStorage.setItem(STORAGE_KEYS.CRYPTO_LOGS, JSON.stringify(filtered));
  },

  updateCryptoLog: (surveyId: string, txHash: string, updates: Partial<CryptoLog>) => {
    const data = localStorage.getItem(STORAGE_KEYS.CRYPTO_LOGS);
    const logs = data ? JSON.parse(data) : [];
    const idx = logs.findIndex((l: CryptoLog) => l.surveyId === surveyId && l.txHash === txHash);
    if (idx >= 0) {
      logs[idx] = { ...logs[idx], ...updates };
      localStorage.setItem(STORAGE_KEYS.CRYPTO_LOGS, JSON.stringify(logs));
    }
  },

  getCryptoLogs: (surveyId: string): CryptoLog[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CRYPTO_LOGS);
    const logs = data ? JSON.parse(data) : [];
    return logs.filter((l: CryptoLog) => l.surveyId === surveyId);
  },

  getFingerprint,

  saveResponse: (response: SurveyResponse) => {
    const existing = storageService.getAllResponses();
    const enrichedResponse = {
      ...response,
      metadata: {
        ...response.metadata,
        fingerprint: getFingerprint()
      }
    };
    const updated = [...existing, enrichedResponse];
    localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(updated));
    storageService.recordParticipation(response.surveyId);
    
    const surveys = storageService.getAllSurveys();
    const sIdx = surveys.findIndex(s => s.id === response.surveyId);
    if (sIdx >= 0) {
      surveys[sIdx].totalParticipants = (surveys[sIdx].totalParticipants || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(surveys));
    }
  },
  getAllResponses: (): SurveyResponse[] => {
    const data = localStorage.getItem(STORAGE_KEYS.RESPONSES);
    return data ? JSON.parse(data) : [];
  },
  getResponsesBySurvey: (surveyId: string): SurveyResponse[] => {
    return storageService.getAllResponses().filter(r => r.surveyId === surveyId);
  },

  exportResponsesCSV: (surveyId: string) => {
    const responses = storageService.getResponsesBySurvey(surveyId);
    if (responses.length === 0) return alert('내보낼 데이터가 없습니다.');

    const headers = ['Time', 'ResponseID', 'AgeGroup', 'Gender', 'TimeBucket', 'Fingerprint(Hash)'];
    const rows = responses.map(r => [
      new Date(r.timestamp).toISOString(),
      r.id,
      r.metadata.ageGroup,
      r.metadata.gender,
      r.metadata.timeBucket,
      r.metadata.fingerprint
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `survey_fairness_log_${surveyId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
