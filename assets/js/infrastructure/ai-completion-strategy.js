/**
 * Strategy: choose OpenRouter, direct Anthropic/OpenAI, or Ollama without duplicating call sites.
 */
import { fetchAnthropicMessages } from './anthropic-adapter.js';
import { fetchOpenAIChatCompletion } from './openai-api-adapter.js';
import { fetchOpenRouterCompletion } from './open-router-adapter.js';
import { fetchOllamaChatCompletion } from './ollama-adapter.js';

export function maxTokensForDetail(detail) {
  if (detail === 'quick') return 800;
  if (detail === 'full') return 1600;
  return 2400;
}

/**
 * @param {object} state - App state snapshot (cloudKeys, aiSource, ollamaUrl, etc.)
 * @param {{ system: string, user: string, detail: string }} params
 * @returns {Promise<string>}
 */
export async function completeWithStrategy(state, { system, user, detail }) {
  const maxTokens = maxTokensForDetail(detail);
  if (state.aiSource === 'ollama') {
    return fetchOllamaChatCompletion({
      baseUrl: state.ollamaUrl,
      model: state.ollamaModel,
      system,
      user,
    });
  }
  if (state.aiSource === 'anthropic') {
    return fetchAnthropicMessages({
      apiKey: state.cloudKeys.anthropic,
      model: state.cloudModels.anthropic,
      system,
      user,
      maxTokens,
    });
  }
  if (state.aiSource === 'openai') {
    return fetchOpenAIChatCompletion({
      apiKey: state.cloudKeys.openai,
      model: state.cloudModels.openai,
      system,
      user,
      maxTokens,
    });
  }
  return fetchOpenRouterCompletion({
    apiKey: state.cloudKeys.openrouter,
    model: state.cloudModels.openrouter,
    system,
    user,
    maxTokens,
    referer: typeof location !== 'undefined' ? location.href : '',
    title: 'Pattern AI Assistant',
  });
}
