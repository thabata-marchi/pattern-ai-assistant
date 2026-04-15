import { mdToHtml } from './markdown.js';
import { ptBR } from '../i18n/pt-br.js';
import { appState } from '../application/app-state.js';

function detailLabel(detail) {
  const m = {
    quick: ptBR.response.detailQuick,
    full: ptBR.response.detailFull,
    flutter: ptBR.response.detailFlutter,
  };
  return m[detail] || detail;
}

function responseSourceLabel() {
  const s = appState.aiSource;
  if (s === 'ollama') return ptBR.response.sourceOllama;
  if (s === 'anthropic') return ptBR.response.sourceAnthropic;
  if (s === 'openai') return ptBR.response.sourceOpenAI;
  return ptBR.response.sourceOpenRouter;
}

export function renderResp(el, md, tab, detail, modelName) {
  const dLabel = detailLabel(detail);
  const srcLabel = responseSourceLabel();
  el.innerHTML = `<div class="response-wrap"><div class="response-head"><div class="response-head-left"><span class="r-badge rb-model">${modelName}</span><span class="r-badge rb-detail">${dLabel}</span><span class="r-badge rb-source">${srcLabel}</span></div><button type="button" class="btn-copy-r" data-copy-response="1">${ptBR.response.copy}</button></div><div class="response-body" id="rb-${Date.now()}">${mdToHtml(md)}</div></div>`;
  const btn = el.querySelector('[data-copy-response]');
  if (btn) btn.addEventListener('click', () => copyResp(btn));
}

export function showErr2(el, msg) {
  el.innerHTML = `<div class="error-box">❌ ${msg}</div>`;
}

export function showErr(containerId, msg) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const parent = el.parentElement;
  parent?.querySelectorAll('.error-box[data-config-err]').forEach((n) => n.remove());
  el.insertAdjacentHTML(
    'afterend',
    `<div class="error-box" data-config-err="1" style="margin-top:10px">❌ ${msg}</div>`,
  );
}

export function copyResp(btn) {
  const body = btn.closest('.response-wrap')?.querySelector('.response-body');
  if (!body) return;
  navigator.clipboard.writeText(body.innerText).then(() => {
    btn.textContent = ptBR.response.copied;
    setTimeout(() => {
      btn.textContent = ptBR.response.copy;
    }, 2000);
  });
}
