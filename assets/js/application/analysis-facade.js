/**
 * Facade: single entry for validating input and running a completion request.
 */
import { buildPrompt } from './prompt-builder.js';
import { completeWithStrategy } from '../infrastructure/ai-completion-strategy.js';
import { ptBR } from '../i18n/pt-br.js';

function hasCloudKey(state) {
  const src = state.aiSource;
  if (src === 'ollama') return true;
  return !!(state.cloudKeys && state.cloudKeys[src]);
}

export function validateAnalysisInput(tab, input, state) {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      ok: false,
      message: tab === 'rec' ? ptBR.errors.emptyProblem : ptBR.errors.emptyCode,
    };
  }
  if (state.aiSource === 'ollama') {
    return { ok: true };
  }
  if (!hasCloudKey(state)) {
    return { ok: false, message: ptBR.errors.needApiForSource(state.aiSource) };
  }
  return { ok: true };
}

export async function runAnalysisCompletion(state, tab, inputText) {
  const detail = state.details[tab];
  const { system, user } = buildPrompt(tab, inputText, detail);
  const text = await completeWithStrategy(state, { system, user, detail });
  if (!text) throw new Error(ptBR.errors.emptyResponse);
  return { text, detail };
}
