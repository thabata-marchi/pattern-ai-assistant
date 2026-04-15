export function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function mdToHtml(md) {
  let h = md
    .replace(/```[\w]*\n?([\s\S]*?)```/g, (_, c) => `<pre><code>${esc(c.trim())}</code></pre>`)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^---$/gm, '<hr>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^\s*[-*] (.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
  return `<p>${h}</p>`
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<[hup])/g, '$1')
    .replace(/(<\/[hup][^>]*>)<\/p>/g, '$1')
    .replace(/<p>(<pre|<hr|<block)/g, '$1')
    .replace(/(<\/pre>|<hr>|<\/blockquote>)<\/p>/g, '$1');
}
