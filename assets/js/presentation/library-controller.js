import { appState } from '../application/app-state.js';
import { ptBR } from '../i18n/pt-br.js';

const PATTERN_TOTAL = 24;
const NAV_HEIGHT = 52;
const SCROLL_EXTRA = 16;

export function showPage(page) {
  document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach((b) => b.classList.remove('active'));
  document.getElementById(`page-${page}`)?.classList.add('active');
  document.getElementById(`navtab-${page}`)?.classList.add('active');
}

export function toggleGroup(id) {
  document.getElementById(id)?.classList.toggle('collapsed');
}

export function toggleSidebar() {
  document.getElementById('libSidebar')?.classList.toggle('open');
}

export function scrollToPattern(id) {
  showPage('library');
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) {
      const top =
        el.getBoundingClientRect().top + window.pageYOffset - NAV_HEIGHT - SCROLL_EXTRA;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    updateActiveSidebarLinks(id);
  }, 80);
  document.getElementById('libSidebar')?.classList.remove('open');
}

export function updateActiveSidebarLinks(activeId = '') {
  document.querySelectorAll('.sidebar-link').forEach((l) => {
    const onClick = l.getAttribute('onclick') || '';
    l.classList.toggle('active', onClick.includes(activeId) && activeId !== '');
  });
}

export function updateProgress() {
  const done = appState.studiedPatterns.size;
  const pct = Math.round((done / PATTERN_TOTAL) * 100);
  const pt = document.getElementById('progressText');
  const bar = document.getElementById('progressBar');
  const heroBar = document.getElementById('heroProgressBar');
  const heroText = document.getElementById('heroProgressText');
  if (pt) pt.textContent = ptBR.progress.studied(done, PATTERN_TOTAL);
  if (bar) bar.style.width = `${pct}%`;
  if (heroBar) heroBar.style.width = `${pct}%`;
  if (heroText) heroText.textContent = ptBR.progress.short(done, PATTERN_TOTAL);
}

export function searchPatterns(q) {
  const lower = q.toLowerCase();
  document.querySelectorAll('.sidebar-link').forEach((el) => {
    const text = el.textContent.toLowerCase();
    el.style.display = !q || text.includes(lower) ? '' : 'none';
  });
}
