import { STORAGE_KEYS } from '../domain/storage-keys.js';

const AI_SOURCES = ['openrouter', 'anthropic', 'openai', 'ollama'];

export const appState = {
  cloudKeys: {
    openrouter: '',
    anthropic: '',
    openai: '',
  },
  cloudModels: {
    openrouter: 'anthropic/claude-sonnet-4-5',
    anthropic: 'claude-3-5-sonnet-20241022',
    openai: 'gpt-4o',
  },
  saveKey: false,
  aiSource: 'openrouter',
  ollamaUrl: 'http://localhost:11434',
  ollamaModel: 'llama3.1',
  details: { rec: 'quick', det: 'quick' },
  history: [],
  isConnected: false,
  tfjsReady: false,
  studiedPatterns: new Set(),
};

export function hydrateStateFromStorage() {
  const kor = localStorage.getItem(STORAGE_KEYS.apiKey);
  const kant = localStorage.getItem(STORAGE_KEYS.anthropicKey);
  const koai = localStorage.getItem(STORAGE_KEYS.openaiKey);
  const mor = localStorage.getItem(STORAGE_KEYS.model);
  const mant = localStorage.getItem(STORAGE_KEYS.modelAnthropic);
  const moai = localStorage.getItem(STORAGE_KEYS.modelOpenAI);
  const s = localStorage.getItem(STORAGE_KEYS.source);
  const ou = localStorage.getItem(STORAGE_KEYS.ollamaUrl);
  const om = localStorage.getItem(STORAGE_KEYS.ollamaModel);

  if (kor) {
    appState.cloudKeys.openrouter = kor;
    appState.saveKey = true;
    appState.isConnected = true;
  }
  if (kant) appState.cloudKeys.anthropic = kant;
  if (koai) appState.cloudKeys.openai = koai;
  if (mor) appState.cloudModels.openrouter = mor;
  if (mant) appState.cloudModels.anthropic = mant;
  if (moai) appState.cloudModels.openai = moai;
  if (s) appState.aiSource = s;
  if (!AI_SOURCES.includes(appState.aiSource)) appState.aiSource = 'openrouter';
  if (ou) appState.ollamaUrl = ou;
  if (om) appState.ollamaModel = om;
  appState.studiedPatterns = new Set(
    JSON.parse(localStorage.getItem(STORAGE_KEYS.studiedPatterns) || '[]'),
  );
}

export function persistOllamaSettings() {
  localStorage.setItem(STORAGE_KEYS.ollamaUrl, appState.ollamaUrl);
  localStorage.setItem(STORAGE_KEYS.ollamaModel, appState.ollamaModel);
}

export function persistSource() {
  localStorage.setItem(STORAGE_KEYS.source, appState.aiSource);
}
