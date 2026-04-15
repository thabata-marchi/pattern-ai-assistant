/**
 * Direct OpenAI Chat Completions. Browser calls may be blocked by CORS.
 */

export function adaptOpenAIChatResponse(json) {
  return json.choices?.[0]?.message?.content || '';
}

/** Lista modelos — valida a chave; pode falhar por CORS no browser. */
export async function verifyOpenAIApiKey(apiKey) {
  const r = await fetch('https://api.openai.com/v1/models?limit=1', {
    method: 'GET',
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) {
    throw new Error(body?.error?.message || `HTTP ${r.status}`);
  }
  return body;
}

export async function fetchOpenAIChatCompletion({ apiKey, model, system, user, maxTokens }) {
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
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
  return adaptOpenAIChatResponse(data);
}
