import { appState, persistOllamaSettings, persistSource } from '../application/app-state.js';
import { STORAGE_KEYS } from '../domain/storage-keys.js';
import { ptBR } from '../i18n/pt-br.js';
import { verifyAnthropicApiKey } from '../infrastructure/anthropic-adapter.js';
import { normalizeOllamaBaseUrl, probeOllamaTags } from '../infrastructure/ollama-adapter.js';
import { verifyOpenAIApiKey } from '../infrastructure/openai-api-adapter.js';
import { verifyOpenRouterApiKey } from '../infrastructure/open-router-adapter.js';

const SOURCES = ['openrouter', 'anthropic', 'openai', 'ollama'];

/** Clicks on button text/emojis can set `target` to a Text node — Text has no `.closest`. */
export function eventTargetElement(e) {
  const n = e.target;
  return n instanceof Element ? n : n.parentElement;
}

function inputTrim(id) {
  const el = document.getElementById(id);
  return (el?.value ?? '').trim();
}

function connectErrText(e) {
  const raw = e?.message || String(e);
  return raw;
}

function looksLikeAuthFailure(msg) {
  return /\b(401|403)\b/.test(msg) || /invalid|unauthor|incorrect api key/i.test(msg);
}

function looksLikeNetworkOrCors(msg) {
  return /Failed to fetch|NetworkError|Load failed|network|CORS/i.test(msg);
}

/**
 * @param {'or'|'ant'|'oai'|'ollama'} which
 * @param {'off'|'loading'|'success'|'warning'|'error'} variant
 */
function setPanelConnectFeedback(which, variant, text) {
  const idBase = which === 'ollama' ? 'ollamaFeedback' : `cloudMsg-${which}`;
  ['rec', 'det'].forEach((panelId) => {
    const el = document.getElementById(`${idBase}-${panelId}`);
    if (!el) return;
    el.classList.remove('is-loading', 'is-success', 'is-error', 'is-warning');
    if (variant === 'off' || !text) {
      el.style.display = 'none';
      el.textContent = '';
      return;
    }
    const map = { loading: 'is-loading', success: 'is-success', warning: 'is-warning', error: 'is-error' };
    el.classList.add(map[variant] || 'is-error');
    el.textContent = text;
    el.style.display = 'block';
  });
}

export function setConnected(v) {
  appState.isConnected = v;
}

export function renderConfigBoxes() {
  ['rec', 'det'].forEach((t) => {
    const el = document.getElementById(`${t}-config`);
    if (!el) return;
    el.innerHTML = configHTML(t);
  });
  document.querySelectorAll('select[id^="modelSel"]').forEach((el) => {
    const id = el.id;
    if (id.startsWith('modelSelAnt')) {
      el.addEventListener('change', () => {
        appState.cloudModels.anthropic = el.value;
      });
    } else if (id.startsWith('modelSelOai')) {
      el.addEventListener('change', () => {
        appState.cloudModels.openai = el.value;
      });
    } else if (id.startsWith('modelSel-')) {
      el.addEventListener('change', () => {
        appState.cloudModels.openrouter = el.value;
      });
    }
  });
}

function configHTML(t) {
  const c = ptBR.config;
  const k = appState.cloudKeys;
  const m = appState.cloudModels;
  return `<div class="ai-config-box">
  <div class="ai-source-tabs">
    <button type="button" class="ai-source-tab active" id="srcTab-${t}-openrouter" data-src-tab="${t}" data-src="openrouter">${c.tabOpenRouter}</button>
    <button type="button" class="ai-source-tab" id="srcTab-${t}-anthropic" data-src-tab="${t}" data-src="anthropic">${c.tabAnthropic}</button>
    <button type="button" class="ai-source-tab" id="srcTab-${t}-openai" data-src-tab="${t}" data-src="openai">${c.tabOpenAI}</button>
    <button type="button" class="ai-source-tab" id="srcTab-${t}-ollama" data-src-tab="${t}" data-src="ollama">${c.tabOllama}</button>
  </div>
  <label class="save-toggle-row save-toggle-below-tabs" data-toggle-save="${t}">
    <div class="toggle" id="saveToggle-${t}"></div>
    <span>${c.rememberKey}</span>
  </label>
  <div class="ai-source-panel active" id="srcPanel-${t}-openrouter">
    <div class="config-row config-row-3">
      <div class="field-group">
        <label class="field-label">${c.apiKeyLabel}</label>
        <input type="password" class="field-input" id="apiKeyInput-${t}" placeholder="sk-or-v1-..." autocomplete="off" value="${k.openrouter}">
      </div>
      <div class="field-group">
        <label class="field-label">${c.modelLabel}</label>
        <select class="field-input" id="modelSel-${t}">
          <optgroup label="Anthropic">
            <option value="anthropic/claude-sonnet-4-5">Claude Sonnet 4.5</option>
            <option value="anthropic/claude-haiku-4-5">Claude Haiku 4.5</option>
          </optgroup>
          <optgroup label="OpenAI">
            <option value="openai/gpt-4o">GPT-4o</option>
            <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
          </optgroup>
          <optgroup label="Google">
            <option value="google/gemini-flash-1.5">Gemini Flash 1.5</option>
          </optgroup>
          <optgroup label="Meta (Open Source)">
            <option value="meta-llama/llama-3.1-70b-instruct">Llama 3.1 70B</option>
            <option value="meta-llama/llama-3.1-8b-instruct">Llama 3.1 8B</option>
          </optgroup>
          <optgroup label="Mistral">
            <option value="mistralai/mistral-large">Mistral Large</option>
          </optgroup>
        </select>
      </div>
      <button type="button" class="btn-primary" data-connect-or="${t}">${c.connectOpenRouter}</button>
    </div>
    <div class="panel-connect-feedback" id="cloudMsg-or-${t}" style="display:none" role="status"></div>
    <div class="security-note">${c.securityNote}</div>
  </div>
  <div class="ai-source-panel" id="srcPanel-${t}-anthropic">
    <div class="config-row config-row-3">
      <div class="field-group">
        <label class="field-label">${c.anthropicKeyLabel}</label>
        <input type="password" class="field-input" id="anthropicKeyInput-${t}" placeholder="sk-ant-api03-..." autocomplete="off" value="${k.anthropic}">
      </div>
      <div class="field-group">
        <label class="field-label">${c.modelLabel}</label>
        <select class="field-input" id="modelSelAnt-${t}">
          <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
          <option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku</option>
          <option value="claude-3-opus-20240229">Claude 3 Opus</option>
        </select>
      </div>
      <button type="button" class="btn-primary" data-connect-anthropic="${t}">${c.connectAnthropic}</button>
    </div>
    <div class="panel-connect-feedback" id="cloudMsg-ant-${t}" style="display:none" role="status"></div>
    <div class="security-note">${c.directApiCorsNote}</div>
  </div>
  <div class="ai-source-panel" id="srcPanel-${t}-openai">
    <div class="config-row config-row-3">
      <div class="field-group">
        <label class="field-label">${c.openaiKeyLabel}</label>
        <input type="password" class="field-input" id="openaiKeyInput-${t}" placeholder="sk-..." autocomplete="off" value="${k.openai}">
      </div>
      <div class="field-group">
        <label class="field-label">${c.modelLabel}</label>
        <select class="field-input" id="modelSelOai-${t}">
          <option value="gpt-4o">GPT-4o</option>
          <option value="gpt-4o-mini">GPT-4o Mini</option>
          <option value="gpt-4-turbo">GPT-4 Turbo</option>
        </select>
      </div>
      <button type="button" class="btn-primary" data-connect-openai="${t}">${c.connectOpenAI}</button>
    </div>
    <div class="panel-connect-feedback" id="cloudMsg-oai-${t}" style="display:none" role="status"></div>
    <div class="security-note">${c.directApiCorsNote}</div>
  </div>
  <div class="ai-source-panel" id="srcPanel-${t}-ollama">
    <div class="config-row">
      <div class="field-group">
        <label class="field-label">${c.ollamaUrlLabel}</label>
        <input type="text" class="field-input" id="ollamaUrl-${t}" value="${appState.ollamaUrl}" placeholder="http://localhost:11434">
      </div>
      <div class="field-group">
        <label class="field-label">${c.ollamaModelLabel}</label>
        <input type="text" class="field-input" id="ollamaModel-${t}" value="${appState.ollamaModel}" placeholder="llama3.1, codellama, mistral...">
      </div>
    </div>
    <div class="status-row">
      <div class="status-indicator"><div class="status-dot" id="statusDot-${t}"></div><span id="statusText-${t}">${c.statusDisconnected}</span></div>
      <button type="button" class="btn-primary" data-connect-ollama="${t}">${c.testOllama}</button>
    </div>
    <div class="panel-connect-feedback" id="ollamaFeedback-${t}" style="display:none" role="status"></div>
    <div class="ollama-note">${c.ollamaHelp}</div>
  </div>
</div>`;
}

function syncSaveToggleClasses(t) {
  document.getElementById(`saveToggle-${t}`)?.classList.toggle('on', appState.saveKey);
}

/**
 * Updates tab UI for both Recommender and Detector so they stay in sync.
 * @param {string} _whichPanel — unused; kept for call-site compatibility
 */
export function setSourceTab(_whichPanel, source, save = true) {
  ['rec', 'det'].forEach((panelId) => {
    SOURCES.forEach((s) => {
      const tab = document.getElementById(`srcTab-${panelId}-${s}`);
      const panel = document.getElementById(`srcPanel-${panelId}-${s}`);
      if (tab) tab.classList.toggle('active', s === source);
      if (panel) panel.classList.toggle('active', s === source);
    });
    syncSaveToggleClasses(panelId);
  });
  if (save) {
    appState.aiSource = source;
    persistSource();
  }
}

function persistOpenRouterKey(key, model) {
  if (!appState.saveKey) return;
  localStorage.setItem(STORAGE_KEYS.apiKey, key);
  localStorage.setItem(STORAGE_KEYS.model, model);
}

function persistAnthropic(key, model) {
  if (!appState.saveKey) return;
  localStorage.setItem(STORAGE_KEYS.anthropicKey, key);
  localStorage.setItem(STORAGE_KEYS.modelAnthropic, model);
}

function persistOpenaiKey(key, model) {
  if (!appState.saveKey) return;
  localStorage.setItem(STORAGE_KEYS.openaiKey, key);
  localStorage.setItem(STORAGE_KEYS.modelOpenAI, model);
}

export async function connectOpenRouter(t) {
  if (!t) return;
  const key = inputTrim(`apiKeyInput-${t}`);
  const model = document.getElementById(`modelSel-${t}`)?.value;
  if (!key) {
    setPanelConnectFeedback('or', 'error', ptBR.errors.needApiKey);
    return;
  }
  setPanelConnectFeedback('or', 'loading', ptBR.config.connectVerifying);
  try {
    await verifyOpenRouterApiKey(key);
  } catch (e) {
    const msg = connectErrText(e);
    setConnected(false);
    setPanelConnectFeedback('or', 'error', ptBR.config.connectFailedPrefix + msg);
    return;
  }
  appState.cloudKeys.openrouter = key;
  appState.cloudModels.openrouter = model || appState.cloudModels.openrouter;
  appState.aiSource = 'openrouter';
  persistSource();
  persistOpenRouterKey(key, appState.cloudModels.openrouter);
  setConnected(true);
  setPanelConnectFeedback('or', 'success', ptBR.config.connectSuccessOpenRouter);
  setSourceTab('rec', 'openrouter', false);
}

export async function connectAnthropic(t) {
  if (!t) return;
  const key = inputTrim(`anthropicKeyInput-${t}`);
  const model = document.getElementById(`modelSelAnt-${t}`)?.value;
  if (!key) {
    setPanelConnectFeedback('ant', 'error', ptBR.errors.needApiForSource('anthropic'));
    return;
  }
  setPanelConnectFeedback('ant', 'loading', ptBR.config.connectVerifying);
  try {
    await verifyAnthropicApiKey(key);
    appState.cloudKeys.anthropic = key;
    appState.cloudModels.anthropic = model || appState.cloudModels.anthropic;
    appState.aiSource = 'anthropic';
    persistSource();
    persistAnthropic(key, appState.cloudModels.anthropic);
    setConnected(true);
    setPanelConnectFeedback('ant', 'success', ptBR.config.connectSuccessAnthropic);
    setSourceTab('rec', 'anthropic', false);
  } catch (e) {
    const msg = connectErrText(e);
    if (looksLikeAuthFailure(msg)) {
      setConnected(false);
      setPanelConnectFeedback('ant', 'error', ptBR.config.connectFailedPrefix + msg);
      return;
    }
    if (looksLikeNetworkOrCors(msg)) {
      appState.cloudKeys.anthropic = key;
      appState.cloudModels.anthropic = model || appState.cloudModels.anthropic;
      appState.aiSource = 'anthropic';
      persistSource();
      persistAnthropic(key, appState.cloudModels.anthropic);
      setConnected(true);
      setPanelConnectFeedback('ant', 'warning', ptBR.config.connectSavedNetworkBlocked);
      setSourceTab('rec', 'anthropic', false);
      return;
    }
    setConnected(false);
    setPanelConnectFeedback('ant', 'error', ptBR.config.connectFailedPrefix + msg);
  }
}

export async function connectOpenai(t) {
  if (!t) return;
  const key = inputTrim(`openaiKeyInput-${t}`);
  const model = document.getElementById(`modelSelOai-${t}`)?.value;
  if (!key) {
    setPanelConnectFeedback('oai', 'error', ptBR.errors.needApiForSource('openai'));
    return;
  }
  setPanelConnectFeedback('oai', 'loading', ptBR.config.connectVerifying);
  try {
    await verifyOpenAIApiKey(key);
    appState.cloudKeys.openai = key;
    appState.cloudModels.openai = model || appState.cloudModels.openai;
    appState.aiSource = 'openai';
    persistSource();
    persistOpenaiKey(key, appState.cloudModels.openai);
    setConnected(true);
    setPanelConnectFeedback('oai', 'success', ptBR.config.connectSuccessOpenAI);
    setSourceTab('rec', 'openai', false);
  } catch (e) {
    const msg = connectErrText(e);
    if (looksLikeAuthFailure(msg)) {
      setConnected(false);
      setPanelConnectFeedback('oai', 'error', ptBR.config.connectFailedPrefix + msg);
      return;
    }
    if (looksLikeNetworkOrCors(msg)) {
      appState.cloudKeys.openai = key;
      appState.cloudModels.openai = model || appState.cloudModels.openai;
      appState.aiSource = 'openai';
      persistSource();
      persistOpenaiKey(key, appState.cloudModels.openai);
      setConnected(true);
      setPanelConnectFeedback('oai', 'warning', ptBR.config.connectSavedNetworkBlocked);
      setSourceTab('rec', 'openai', false);
      return;
    }
    setConnected(false);
    setPanelConnectFeedback('oai', 'error', ptBR.config.connectFailedPrefix + msg);
  }
}

export async function connectOllama(t) {
  const rawUrl = document.getElementById(`ollamaUrl-${t}`)?.value || appState.ollamaUrl;
  const url = normalizeOllamaBaseUrl(rawUrl);
  const model = document.getElementById(`ollamaModel-${t}`)?.value || appState.ollamaModel;
  appState.ollamaUrl = url;
  appState.ollamaModel = model;
  const urlInput = document.getElementById(`ollamaUrl-${t}`);
  if (urlInput && urlInput.value.trim() !== url) urlInput.value = url;
  const dot = document.getElementById(`statusDot-${t}`);
  const txt = document.getElementById(`statusText-${t}`);
  setPanelConnectFeedback('ollama', 'loading', ptBR.config.connectVerifying);
  if (txt) txt.textContent = ptBR.config.testing;
  try {
    const r = await probeOllamaTags(url);
    if (r.ok) {
      const d = await r.json();
      const models = d.models?.map((m) => m.name).join(', ') || 'nenhum';
      dot?.classList.add('on');
      if (txt) txt.textContent = ptBR.config.statusConnectedModels(models);
      setConnected(true);
      appState.aiSource = 'ollama';
      persistOllamaSettings();
      persistSource();
      setPanelConnectFeedback('ollama', 'success', ptBR.config.connectSuccessOllama(models));
      setSourceTab('rec', 'ollama', false);
    } else {
      throw new Error(`HTTP ${r.status}`);
    }
  } catch (e) {
    dot?.classList.remove('on');
    const errLine = connectErrText(e);
    if (txt) txt.textContent = `${ptBR.errors.prefix}${errLine}`;
    setPanelConnectFeedback('ollama', 'error', ptBR.config.connectFailedPrefix + errLine);
  }
}

export function toggleSave(t) {
  appState.saveKey = !appState.saveKey;
  syncSaveToggleClasses(t);
  if (!appState.saveKey) {
    localStorage.removeItem(STORAGE_KEYS.apiKey);
    localStorage.removeItem(STORAGE_KEYS.model);
    localStorage.removeItem(STORAGE_KEYS.anthropicKey);
    localStorage.removeItem(STORAGE_KEYS.modelAnthropic);
    localStorage.removeItem(STORAGE_KEYS.openaiKey);
    localStorage.removeItem(STORAGE_KEYS.modelOpenAI);
  }
}

export function bindConfigEvents() {
  const onConfigClick = (e) => {
    const el = eventTargetElement(e);
    if (!el) return;

    const srcBtn = el.closest('[data-src-tab]');
    if (srcBtn) {
      const source = srcBtn.getAttribute('data-src');
      if (source) setSourceTab('rec', source, true);
      return;
    }
    const or = el.closest('[data-connect-or]');
    if (or) {
      void connectOpenRouter(or.getAttribute('data-connect-or'));
      return;
    }
    const ant = el.closest('[data-connect-anthropic]');
    if (ant) {
      void connectAnthropic(ant.getAttribute('data-connect-anthropic'));
      return;
    }
    const oai = el.closest('[data-connect-openai]');
    if (oai) {
      void connectOpenai(oai.getAttribute('data-connect-openai'));
      return;
    }
    const ol = el.closest('[data-connect-ollama]');
    if (ol) {
      void connectOllama(ol.getAttribute('data-connect-ollama'));
      return;
    }
    const sv = el.closest('[data-toggle-save]');
    if (sv) {
      toggleSave(sv.getAttribute('data-toggle-save'));
    }
  };
  ['rec-config', 'det-config'].forEach((id) => {
    document.getElementById(id)?.addEventListener('click', onConfigClick, true);
  });
}
