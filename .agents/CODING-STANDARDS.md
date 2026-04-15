# Coding standards — Pattern AI Assistant

## SOLID (practical)

- **S** — One module per concern (e.g. OpenRouter client separate from Ollama client).
- **O** — New AI backends extend the completion strategy without editing unrelated modules.
- **L** — Strategy implementations remain substitutable behind the same async contract.
- **I** — Small, focused exports; avoid “god” modules.
- **D** — Application logic depends on abstractions (`completeChat` / strategy), not concrete `fetch` details.

## Language

- **UI strings**: Portuguese (`assets/js/i18n/pt-br.js`).
- **Code, comments, commit messages**: English.

## Naming

- JavaScript: `camelCase` for variables and functions; `PascalCase` only if a construct reads like a class.
- Files: `kebab-case.js`.

## Style

- Prefer early returns and small functions.
- Avoid comments that repeat the code; document non-obvious behavior and public contracts.
- No drive-by refactors outside the task scope.

## HTML

- `lang="pt-BR"` on the document.
- Inline `onclick` is allowed sparingly for vanilla compatibility; prefer wiring extra listeners in JS when touching related code.
