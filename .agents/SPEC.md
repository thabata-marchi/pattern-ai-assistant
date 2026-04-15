# Product specification — Pattern AI Assistant

## Purpose

Single-page web application that combines:

- A **GoF / POEAA pattern library** with Portuguese educational content.
- An **AI assistant** (BYOK) for pattern recommendation and code analysis, using OpenRouter or local Ollama.
- Optional **TensorFlow.js**–based local keyword hints before calling an API.

## Stack

- HTML5, CSS3, JavaScript (ES modules), no bundler.
- TensorFlow.js from CDN (when available).
- External APIs: OpenRouter (`https://openrouter.ai/api/v1/chat/completions`), Ollama (`/api/chat`, `/api/tags`).

## Localization rule

- **User-visible UI** (labels, buttons, errors, placeholders, footers in the app chrome): **Brazilian Portuguese (pt-BR)**.
- **Source code** (identifiers, file names, comments) and **agent/technical docs**: **English**, except where this folder intentionally describes product copy in Portuguese.

## Non-goals

- No backend owned by this repo; API keys stay in the browser (BYOK).
- No authentication or multi-user accounts.

## Running locally

ES modules require HTTP(S). Open the app via a static server (e.g. `python -m http.server` or `npx serve`) or deploy to GitHub Pages. Opening `index.html` via `file://` may block module loading.

## License

Open source under the MIT License — see [`LICENSE`](../LICENSE) at the repository root.
