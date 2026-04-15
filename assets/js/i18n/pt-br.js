/**
 * User-visible strings (Brazilian Portuguese).
 * Code identifiers and comments elsewhere remain in English.
 */
export const ptBR = {
  config: {
    tabOpenRouter: '☁️ OpenRouter',
    tabAnthropic: '🅰️ Claude (API)',
    tabOpenAI: '🤖 OpenAI',
    tabOllama: '🦙 Ollama (local)',
    apiKeyLabel: 'API Key (OpenRouter)',
    anthropicKeyLabel: 'API Key (Anthropic)',
    openaiKeyLabel: 'API Key (OpenAI)',
    modelLabel: 'Modelo',
    connectOpenRouter: 'Conectar →',
    connectAnthropic: 'Conectar →',
    connectOpenAI: 'Conectar →',
    rememberKey: 'Lembrar chaves neste dispositivo',
    securityNote:
      '<strong>🔒 Segurança:</strong> Sua chave vai direto do browser para o provedor escolhido. Nunca passa por servidor nosso. Código aberto — você pode verificar. <strong>⚠️ Não ative "lembrar" em computadores compartilhados.</strong>',
    directApiCorsNote:
      '<strong>🌐 Navegador:</strong> APIs diretas da Anthropic/OpenAI costumam bloquear chamadas do browser (CORS). Se falhar, use <strong>OpenRouter</strong> (projetado para uso no browser) ou um proxy/backend.',
    ollamaUrlLabel: 'URL do Ollama',
    ollamaModelLabel: 'Modelo instalado',
    testOllama: 'Testar conexão →',
    statusDisconnected: 'Não conectado',
    statusConnected: 'Conectado',
    connectedCloudBrief:
      '✓ Conectado. A chave foi registrada — use Recomendar Pattern ou Detectar Pattern abaixo.',
    connectVerifying: 'Verificando chave na API…',
    connectSuccessOpenRouter: '✓ Chave válida na OpenRouter. Pode usar Recomendar / Detectar.',
    connectSuccessAnthropic: '✓ Chave aceita pela Anthropic. Pode usar Recomendar / Detectar.',
    connectSuccessOpenAI: '✓ Chave aceita pela OpenAI. Pode usar Recomendar / Detectar.',
    connectSuccessOllama: (modelsPreview) =>
      `✓ Ollama respondeu. Modelos: ${modelsPreview}`,
    connectFailedPrefix: '✗ ',
    connectSavedNetworkBlocked:
      '⚠ Não foi possível testar a chave daqui (rede ou CORS). Ela foi salva neste app — faça uma análise; se falhar, use OpenRouter ou um proxy.',
    statusConnectedModels: (models) => `Conectado · Modelos: ${models}`,
    testing: 'Testando...',
    ollamaHelp:
      '<strong>🦙 Ollama:</strong> Roda LLMs localmente, grátis, offline. Instale em <a href="https://ollama.ai" target="_blank">ollama.ai</a> e execute: <code style="color:#6af5c0">ollama run llama3.1</code> ou <code style="color:#6af5c0">ollama run codellama</code><br><strong>⚠️ CORS:</strong> Adicione <code style="color:#6af5c0">OLLAMA_ORIGINS=*</code> nas variáveis de ambiente do Ollama para permitir acesso do browser.',
  },
  errors: {
    needApiKey: 'Insira sua API Key do OpenRouter.',
    needApiOrOllama: 'Configure uma API Key (aba atual) ou conecte ao Ollama antes de usar.',
    needApiForSource: (src) => {
      const m = {
        openrouter: 'Insira e conecte sua API Key da OpenRouter.',
        anthropic: 'Insira e conecte sua API Key da Anthropic (Claude).',
        openai: 'Insira e conecte sua API Key da OpenAI.',
      };
      return m[src] || 'Configure sua API Key antes de usar.';
    },
    emptyProblem: 'Descreva seu problema antes de continuar.',
    emptyCode: 'Cole seu código antes de continuar.',
    emptyResponse: 'Resposta vazia. Tente novamente.',
    prefix: 'Erro: ',
  },
  analysis: {
    loading: (providerLabel) => `Analisando com ${providerLabel}...`,
  },
  tfjs: {
    loading: 'Carregando pré-classificador...',
    ready: 'Pronto · Pré-classificação local ativa',
    unavailable: 'TF.js não disponível (usando só a API)',
    similarityPrefix: '🧠 TF.js detectou similaridade com: ',
  },
  response: {
    detailQuick: '⚡ Rápido',
    detailFull: '📖 Completo',
    detailFlutter: '🐦 Flutter',
    sourceOllama: '🦙 Ollama',
    sourceOpenRouter: '☁️ OpenRouter',
    sourceAnthropic: '🅰️ Anthropic',
    sourceOpenAI: '🤖 OpenAI',
    copy: 'Copiar',
    copied: '✓ Copiado',
    savedLabel: 'Salvo',
  },
  history: {
    title: 'Histórico da sessão',
    clear: 'Limpar',
    tabRec: 'Rec',
    tabDet: 'Det',
  },
  progress: {
    studied: (done, total) => `${done} / ${total} estudados`,
    short: (done, total) => `${done} / ${total}`,
  },
};
