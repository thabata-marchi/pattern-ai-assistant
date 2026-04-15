# Pattern AI Assistant

Single-page web app that combines an educational **Design Patterns** library (GoF and POEAA) with **Brazilian Portuguese** learning content, plus an **AI assistant** (BYOK — bring your own API key) for pattern recommendations and code analysis, with **OpenRouter** or local **Ollama** support. Optional **TensorFlow.js** keyword hints can run before calling an API.

## Features

- **Library** — Browse GoF patterns and related topics with didactic content in pt-BR.
- **Recommender** — Suggests patterns based on the problem you describe.
- **Detector** — Assisted analysis of code snippets or design descriptions.

## Stack

- HTML5, CSS3, JavaScript (ES modules), no bundler.
- TensorFlow.js from CDN when enabled.
- External APIs: OpenRouter and Ollama (`/api/chat`, `/api/tags`).

## Running locally

ES modules must be served over **HTTP(S)**. Opening `index.html` via `file://` may block module loading.

Examples:

```bash
python -m http.server 8080
```

or

```bash
npx serve .
```

Then open the URL shown in the terminal (for example `http://localhost:8080`).

## Testing Recommender and Detector

These steps match the current UI (`index.html` + `assets/js/`). If your build differs, check the labels on the page.

1. **Serve the app over HTTP** (see [Running locally](#running-locally)). Use `http://localhost:…` in the browser — not `file://`, or ES modules may not load.
2. In the top bar, open **Recommender** or **Detector**.
3. **Configure an AI backend** (you need at least one working path before analysis):
   - **OpenRouter:** choose the OpenRouter tab, paste your [OpenRouter](https://openrouter.ai) API key, pick a model, then use the connect action. Optionally use the “remember key” toggle only on trusted devices.
   - **Ollama:** choose the Ollama tab, set the base URL (default `http://localhost:11434`), model name, then test the connection. Ollama must be running locally; browser access often requires CORS (see the note in the Ollama panel in the app, e.g. `OLLAMA_ORIGINS=*`).
4. **Recommender:** set the detail level (quick / full / Flutter-style), describe your problem in the text area (or use an example chip), then click **Recomendar Pattern**. Wait for the Markdown response; use **Copiar** if shown.
5. **Detector:** set the detail level, paste Dart/Flutter code (or load an example), then click **Detectar Pattern**. Optional TF.js status appears in the bar when the CDN script loads; it only adds local keyword hints — the main answer still comes from the API you configured.

**If something fails:** confirm the URL is `http://…` (not `file://`), check the browser **Console** and **Network** tabs for failed loads (e.g. `assets/js/main.js`), and verify OpenRouter or Ollama is reachable from your machine.

## API keys and privacy (BYOK)

API keys stay in the **browser** (bring your own key). This repository has no first-party backend or user accounts — see [`.agents/SPEC.md`](.agents/SPEC.md).

## License

Open source under the [MIT License](LICENSE).

Copyright (c) 2026 Thabata Marchi.
