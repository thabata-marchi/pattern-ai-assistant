/**
 * HTTP client + adapter for Ollama local API.
 */

/** Strip mistaken path suffixes so `/api/chat` is not doubled (404). */
export function normalizeOllamaBaseUrl(baseUrl) {
  const fallback = 'http://localhost:11434';
  let root = String(baseUrl ?? '').trim().replace(/\/+$/, '') || fallback;
  const suffixes = [
    '/api/chat',
    '/api/tags',
    '/api/generate',
    '/api/embeddings',
    '/api/pull',
    '/api/show',
    '/api/ps',
    '/api/version',
    '/api',
    '/v1/chat/completions',
    '/v1',
  ];
  let changed = true;
  while (changed) {
    changed = false;
    for (const suf of suffixes) {
      if (root.endsWith(suf)) {
        root = root.slice(0, -suf.length).replace(/\/+$/, '');
        changed = true;
        break;
      }
    }
  }
  return root || fallback;
}

async function readOllamaErrorDetail(response) {
  const text = await response.text();
  if (!text) return '';
  try {
    const j = JSON.parse(text);
    if (typeof j.error === 'string') return j.error;
  } catch {
    /* ignore */
  }
  return text.length > 400 ? `${text.slice(0, 400)}…` : text;
}

function ollamaHttpErrorMessage(status, detail, model) {
  const base =
    status === 404
      ? 'URL base deve ser só o host (ex.: http://localhost:11434), sem /api/chat. Em 404 o modelo costuma não estar instalado: rode `ollama list` e `ollama pull` com o mesmo nome do campo "Modelo".'
      : 'Verifique se o Ollama está rodando; no browser use `OLLAMA_ORIGINS=*` se aparecer bloqueio de CORS.';
  const d = detail ? ` ${detail}` : '';
  const m = model ? ` (modelo: ${model})` : '';
  return `Ollama HTTP ${status}${m}${d ? ` —${d}` : ''} — ${base}`;
}

export function adaptOllamaChatResponse(json) {
  return json.message?.content || '';
}

export async function probeOllamaTags(baseUrl) {
  const root = normalizeOllamaBaseUrl(baseUrl);
  return fetch(`${root}/api/tags`, { signal: AbortSignal.timeout(4000) });
}

export async function fetchOllamaChatCompletion({ baseUrl, model, system, user }) {
  const root = normalizeOllamaBaseUrl(baseUrl);
  const r = await fetch(`${root}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      stream: false,
    }),
  });
  if (!r.ok) {
    const detail = await readOllamaErrorDetail(r);
    throw new Error(ollamaHttpErrorMessage(r.status, detail, model));
  }
  const data = await r.json();
  return adaptOllamaChatResponse(data);
}
