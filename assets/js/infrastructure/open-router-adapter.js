/**
 * HTTP client + adapter for OpenRouter chat completions API.
 */

/** GET /key — valida a chave no browser (CORS permitido pela OpenRouter). */
export async function verifyOpenRouterApiKey(apiKey) {
  const r = await fetch('https://openrouter.ai/api/v1/key', {
    method: 'GET',
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) {
    throw new Error(body?.error?.message || `HTTP ${r.status}`);
  }
  return body;
}

export function adaptOpenRouterResponse(json) {
  return json.choices?.[0]?.message?.content || '';
}

export async function fetchOpenRouterCompletion({
  apiKey,
  model,
  system,
  user,
  maxTokens,
  referer,
  title,
}) {
  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': referer,
      'X-Title': title,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      max_tokens: maxTokens,
      temperature: 0.4,
    }),
  });
  if (!r.ok) {
    const errBody = await r.json().catch(() => ({}));
    throw new Error(errBody?.error?.message || `HTTP ${r.status}`);
  }
  const data = await r.json();
  return adaptOpenRouterResponse(data);
}
