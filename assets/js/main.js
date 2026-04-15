/**
 * Application entry (ES module). Exposes minimal functions on window for inline HTML handlers.
 */
import { appState, hydrateStateFromStorage } from './application/app-state.js';
import {
  bindConfigEvents,
  renderConfigBoxes,
  setSourceTab,
} from './presentation/ai-config-ui.js';
import {
  analyze,
  bindHistoryEvents,
  cc,
  clearPanel,
  fillEx,
  setDetail,
} from './presentation/ai-analyze-ui.js';
import { bootstrapTensorFlow } from './presentation/tfjs-bootstrap.js';
import {
  scrollToPattern,
  searchPatterns,
  showPage,
  toggleGroup,
  toggleSidebar,
  updateActiveSidebarLinks,
  updateProgress,
} from './presentation/library-controller.js';

function syncUiAfterHydrate() {
  ['rec', 'det'].forEach((t) => {
    const sk = document.getElementById(`saveToggle-${t}`);
    if (sk && appState.saveKey) sk.classList.add('on');
    const sd = document.getElementById(`statusDot-${t}`);
    if (sd && appState.isConnected) sd.classList.add('on');
    const sel = document.getElementById(`modelSel-${t}`);
    if (sel) sel.value = appState.cloudModels.openrouter;
    const selAnt = document.getElementById(`modelSelAnt-${t}`);
    if (selAnt) selAnt.value = appState.cloudModels.anthropic;
    const selOai = document.getElementById(`modelSelOai-${t}`);
    if (selOai) selOai.value = appState.cloudModels.openai;
    const keyIn = document.getElementById(`apiKeyInput-${t}`);
    if (keyIn && appState.cloudKeys.openrouter) keyIn.value = appState.cloudKeys.openrouter;
    const kAnt = document.getElementById(`anthropicKeyInput-${t}`);
    if (kAnt && appState.cloudKeys.anthropic) kAnt.value = appState.cloudKeys.anthropic;
    const kOai = document.getElementById(`openaiKeyInput-${t}`);
    if (kOai && appState.cloudKeys.openai) kOai.value = appState.cloudKeys.openai;
    const ou = document.getElementById(`ollamaUrl-${t}`);
    if (ou) ou.value = appState.ollamaUrl;
    const om = document.getElementById(`ollamaModel-${t}`);
    if (om) om.value = appState.ollamaModel;
  });
  setSourceTab('rec', appState.aiSource, false);
}

function init() {
  hydrateStateFromStorage();
  renderConfigBoxes();
  syncUiAfterHydrate();
  updateProgress();
  bootstrapTensorFlow();
  updateActiveSidebarLinks();
  bindConfigEvents();
  bindHistoryEvents();
}

document.addEventListener('DOMContentLoaded', init);

Object.assign(window, {
  showPage,
  toggleGroup,
  toggleSidebar,
  scrollToPattern,
  searchPatterns,
  setDetail,
  cc,
  fillEx,
  analyze,
  clearPanel,
});
