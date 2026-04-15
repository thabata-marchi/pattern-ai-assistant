/**
 * Classic (non-module) bootstrap: navigation works even when ES modules fail (e.g. file://).
 * Overwritten by main.js when the app module loads successfully.
 */
(function () {
  function showPage(page) {
    document.querySelectorAll('.page').forEach(function (p) {
      p.classList.remove('active');
    });
    document.querySelectorAll('.nav-tab').forEach(function (b) {
      b.classList.remove('active');
    });
    var pe = document.getElementById('page-' + page);
    var ne = document.getElementById('navtab-' + page);
    if (pe) pe.classList.add('active');
    if (ne) ne.classList.add('active');
  }

  window.showPage = showPage;

  function bindNav() {
    document.querySelectorAll('.nav-tab[data-nav-page]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var page = btn.getAttribute('data-nav-page');
        if (window.showPage) window.showPage(page);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindNav);
  } else {
    bindNav();
  }
})();
