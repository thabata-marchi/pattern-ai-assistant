const MODEL_DISPLAY_NAMES = {
  'anthropic/claude-sonnet-4-5': 'Claude Sonnet 4.5',
  'anthropic/claude-haiku-4-5': 'Claude Haiku 4.5',
  'openai/gpt-4o': 'GPT-4o',
  'openai/gpt-4o-mini': 'GPT-4o Mini',
  'google/gemini-flash-1.5': 'Gemini Flash 1.5',
  'meta-llama/llama-3.1-70b-instruct': 'Llama 3.1 70B',
  'meta-llama/llama-3.1-8b-instruct': 'Llama 3.1 8B',
  'mistralai/mistral-large': 'Mistral Large',
  'claude-3-5-sonnet-20241022': 'Claude 3.5 Sonnet',
  'claude-3-5-haiku-20241022': 'Claude 3.5 Haiku',
  'claude-3-opus-20240229': 'Claude 3 Opus',
  'gpt-4o': 'GPT-4o',
  'gpt-4o-mini': 'GPT-4o Mini',
  'gpt-4-turbo': 'GPT-4 Turbo',
};

export function getModelDisplayName(model) {
  if (MODEL_DISPLAY_NAMES[model]) return MODEL_DISPLAY_NAMES[model];
  if (model.includes('/')) return model.split('/').slice(1).join('/') || model;
  return model;
}
