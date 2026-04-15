/**
 * LLM system/user messages (Brazilian Portuguese instructions to the model).
 */

export function buildPrompt(tab, input, detail) {
  const di = {
    quick: 'Seja direto. 2-3 parágrafos. Sem código.',
    full: 'Seja completo. Use markdown com títulos.',
    flutter: 'Completo + exemplo de código Flutter/Dart comentado em bloco markdown.',
  };
  const sys = `Você é especialista em Design Patterns com foco em Flutter e Dart. Base: GoF 1994 e Fowler 2002. Responda sempre em português brasileiro. Use Markdown. ${di[detail]}`;
  if (tab === 'rec') {
    return {
      system: sys,
      user: `Problema descrito:\n"${input}"\n\n1. Qual Design Pattern é mais adequado?\n2. Por que resolve este problema?\n3. Alternativas e quando escolher cada uma?${detail === 'flutter' ? '\n4. Exemplo de implementação em Flutter/Dart.' : ''}`,
    };
  }
  return {
    system: sys,
    user: `Analise este código Dart/Flutter:\n\`\`\`dart\n${input}\n\`\`\`\n\n1. Qual(is) Design Pattern(s) estão implementados?\n2. A implementação está correta?\n3. Pontos fortes e melhorias sugeridas.${detail === 'flutter' ? '\n4. Versão melhorada em Dart 3+.' : ''}`,
  };
}
