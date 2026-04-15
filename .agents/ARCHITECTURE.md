# Architecture — Pattern AI Assistant

## Clean architecture (frontend)

Dependencies point **inward**: presentation and application depend on domain concepts; infrastructure implements technical details (HTTP, `localStorage`, TF.js).

| Layer | Responsibility | Location |
|-------|----------------|----------|
| **Domain** | Constants, pure data, no I/O | [`assets/js/domain/`](../assets/js/domain/) |
| **Application** | Use cases: prompts, analysis facade, app state | [`assets/js/application/`](../assets/js/application/) |
| **Infrastructure** | HTTP adapters, AI completion strategy, TF.js helpers | [`assets/js/infrastructure/`](../assets/js/infrastructure/) |
| **Presentation** | DOM, navigation, config UI, analysis UI | [`assets/js/presentation/`](../assets/js/presentation/) |

## Module entry

- [`assets/js/main.js`](../assets/js/main.js) — bootstrap; exposes a small set of functions on `window` for inline HTML handlers (vanilla-friendly).

## Internationalization

- `assets/js/i18n/pt-br.js` exports Portuguese strings for UI only.

## Assets

- `assets/css/main.css` — application styles extracted from the HTML shell.
- `index.html` — structure and static content (pattern library markup).

## Design patterns in code

See [`PATTERNS-IN-CODE.md`](PATTERNS-IN-CODE.md) (Strategy for AI providers, Adapters for HTTP responses, Facade for the analysis flow).
