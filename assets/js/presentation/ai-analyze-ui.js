import { appState } from '../application/app-state.js';
import { validateAnalysisInput, runAnalysisCompletion } from '../application/analysis-facade.js';
import { EXAMPLES } from '../application/examples-data.js';
import { getModelDisplayName } from '../domain/model-labels.js';
import { preClassifyWithKeywords } from '../infrastructure/tfjs-service.js';
import { ptBR } from '../i18n/pt-br.js';
import { esc } from './markdown.js';
import { renderResp, showErr2 } from './response-ui.js';
import { eventTargetElement } from './ai-config-ui.js';

export function setDetail(tab, level) {
  appState.details[tab] = level;
  document.querySelectorAll(`[data-tab="${tab}"]`).forEach((b) => {
    b.classList.toggle('active', b.dataset.lv === level);
  });
}

export function cc(taId, countId) {
  const ta = document.getElementById(taId);
  const countEl = document.getElementById(countId);
  if (!ta || !countEl) return;
  countEl.textContent = `${ta.value.length}/${ta.maxLength}`;
  if (appState.tfjsReady) {
    const hints = preClassifyWithKeywords(ta.value, appState.tfjsReady);
    const preEl = document.getElementById(taId.replace('Ta', 'PreClassify'));
    if (preEl) {
      if (hints && hints.length) {
        preEl.style.display = 'block';
        preEl.textContent = ptBR.tfjs.similarityPrefix + hints.join(', ');
      } else {
        preEl.style.display = 'none';
      }
    }
  }
}

export function fillEx(tab, idx) {
  const ta = document.getElementById(`${tab}Ta`);
  const ccId = `${tab}CC`;
  if (ta) {
    ta.value = EXAMPLES[tab][idx];
    cc(`${tab}Ta`, ccId);
  }
}

export async function analyze(tab) {
  const inputEl = document.getElementById(`${tab}Ta`);
  const respEl = document.getElementById(`${tab}Resp`);
  const btn = document.getElementById(`${tab}Btn`);
  if (!inputEl || !respEl || !btn) return;
  const input = inputEl.value.trim();
  const v = validateAnalysisInput(tab, input, appState);
  if (!v.ok) {
    showErr2(respEl, v.message);
    return;
  }
  const model =
    appState.aiSource === 'ollama'
      ? appState.ollamaModel
      : appState.cloudModels[appState.aiSource];
  const providerLabel =
    appState.aiSource === 'ollama' ? `Ollama/${model}` : getModelDisplayName(model);
  respEl.innerHTML = `<div class="response-wrap"><div class="loading-wrap"><div class="dots"><span></span><span></span><span></span></div><div class="loading-text">${ptBR.analysis.loading(providerLabel)}</div></div></div>`;
  btn.disabled = true;
  try {
    const { text, detail } = await runAnalysisCompletion(appState, tab, input);
    const displayName =
      appState.aiSource === 'ollama'
        ? `Ollama/${model}`
        : getModelDisplayName(model);
    renderResp(respEl, text, tab, detail, displayName);
    addHistory(tab, input, text);
    appState.isConnected = true;
  } catch (e) {
    showErr2(respEl, ptBR.errors.prefix + e.message);
    if (appState.aiSource !== 'ollama') appState.isConnected = false;
  } finally {
    btn.disabled = false;
  }
}

function addHistory(tab, input, response) {
  const item = {
    tab,
    input: input.substring(0, 70) + (input.length > 70 ? '...' : ''),
    response,
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  };
  appState.history.unshift(item);
  renderHistory(tab);
}

export function renderHistory(tab) {
  const el = document.getElementById(`${tab}History`);
  if (!el) return;
  const items = appState.history.filter((i) => i.tab === tab);
  if (!items.length) {
    el.innerHTML = '';
    return;
  }
  el.innerHTML = `<div class="history-wrap"><div class="history-head"><span class="history-title">${ptBR.history.title}</span><button type="button" class="btn-clear-h" data-clear-history="${tab}">${ptBR.history.clear}</button></div><div class="history-list">${items
    .map(
      (i, idx) =>
        `<div class="history-item" data-restore-history="${tab}" data-restore-idx="${idx}"><span class="h-type h-${i.tab === 'rec' ? 'rec' : 'det'}">${i.tab === 'rec' ? ptBR.history.tabRec : ptBR.history.tabDet}</span><span class="h-prev">${esc(i.input)}</span><span class="h-time">${i.time}</span></div>`,
    )
    .join('')}</div></div>`;
}

export function restoreHistory(tab, idx) {
  const items = appState.history.filter((i) => i.tab === tab);
  const item = items[idx];
  if (!item) return;
  const el = document.getElementById(`${tab}Resp`);
  if (!el) return;
  const modelName =
    appState.aiSource === 'ollama' ? 'Ollama' : ptBR.response.savedLabel;
  renderResp(el, item.response, tab, appState.details[tab], modelName);
}

export function clearHistory(tab) {
  appState.history = appState.history.filter((i) => i.tab !== tab);
  renderHistory(tab);
}

export function clearPanel(tab) {
  const ta = document.getElementById(`${tab}Ta`);
  const resp = document.getElementById(`${tab}Resp`);
  const ccEl = document.getElementById(`${tab}CC`);
  const max = tab === 'rec' ? 1000 : 3000;
  if (ta) ta.value = '';
  if (resp) resp.innerHTML = '';
  if (ccEl) ccEl.textContent = `0/${max}`;
  const pre = document.getElementById(`${tab}PreClassify`);
  if (pre) pre.style.display = 'none';
}

export function bindHistoryEvents() {
  const onHistoryClick = (e) => {
    const el = eventTargetElement(e);
    if (!el) return;
    const clearBtn = el.closest('[data-clear-history]');
    if (clearBtn) {
      clearHistory(clearBtn.getAttribute('data-clear-history'));
      return;
    }
    const item = el.closest('[data-restore-history]');
    if (item) {
      const tab = item.getAttribute('data-restore-history');
      const idx = parseInt(item.getAttribute('data-restore-idx'), 10);
      restoreHistory(tab, idx);
    }
  };
  document.getElementById('recHistory')?.addEventListener('click', onHistoryClick);
  document.getElementById('detHistory')?.addEventListener('click', onHistoryClick);
}