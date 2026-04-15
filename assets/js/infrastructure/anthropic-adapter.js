/**
 * Direct Anthropic Messages API (Claude). Browser calls may be blocked by CORS.
 */

export function adaptAnthropicResponse(json) {
  const block = json.content?.find((b) => b.type === 'text');
  return block?.text || '';
}

/** Lista modelos — valida a chave; pode falhar por CORS no browser. */
export async function verifyAnthropicApiKey(apiKey) {
  const r = await fetch('https://api.anthropic.com/v1/models', {
    method: 'GET',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) {
    throw new Error(body?.error?.message || `HTTP ${r.status}`);
  }
  return body;
}

export async function fetchAnthropicMessages({ apiKey, model, system, user, maxTokens }) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });
  if (!r.ok) {
    const errBody = await r.json().catch(() => ({}));
    throw new Error(errBody?.error?.message || `HTTP ${r.status}`);
  }
  const data = await r.json();
  return adaptAnthropicResponse(data);
}
