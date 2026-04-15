# Design patterns used in this codebase

## Product content

The in-app **library** documents the **Gang of Four** catalog (creational, structural, behavioral) plus **POEAA** (e.g. Repository). That educational content is separate from the patterns below, which describe **how the app itself is structured**.

## Strategy

**AI completion** switches between **OpenRouter** and **Ollama** without duplicating the analysis workflow. The application calls a single completion entry point; infrastructure provides provider-specific behavior.

## Adapter

HTTP responses from OpenRouter and Ollama differ. Small adapter functions normalize them to a **plain text completion** for the application layer.

## Facade

`analysis-facade.js` (or equivalent) provides a **single place** for the “analyze / recommend” flow: validate input, build prompts, call completion, render Markdown, append history. Subsystems (clients, markdown, history store) stay behind this facade.

## Relation to SOLID

- **Open/closed**: Add a new provider by implementing the same completion contract and registering it in the strategy module.
- **Dependency inversion**: Use cases depend on the abstract “complete chat” behavior, not on vendor-specific JSON shapes.
