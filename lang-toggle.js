/* ═══════════════════════════════════════════════════
   PILOT VALUE — Language Toggle (JP / EN)
   Key: pv-lang  |  Values: 'ja' | 'en'
   ═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Page map: JA canonical path → EN path ── */
  var PAGE_MAP = {
    '/':                          '/en/',
    '/index.html':                '/en/index.html',
    '/airlines/emirates.html':    '/en/airlines/emirates.html'
    /* Add more as EN pages are created */
  };

  /* ── Reverse map: EN path → JA path ── */
  var REVERSE_MAP = {};
  Object.keys(PAGE_MAP).forEach(function (k) { REVERSE_MAP[PAGE_MAP[k]] = k; });

  /* ── Detect current state ── */
  var raw = location.pathname.replace(/\/$/, '') || '/';
  var isEN = raw.indexOf('/en') === 0;
  var jaPath = isEN ? (raw.replace(/^\/en/, '') || '/') : raw;
  var enPath = isEN ? raw : (PAGE_MAP[raw] || '/en/');

  /* ── Auto-redirect based on saved preference ── */
  var saved = localStorage.getItem('pv-lang');
  if (saved === 'en' && !isEN && PAGE_MAP[jaPath]) {
    location.replace(PAGE_MAP[jaPath]);
    return;
  }
  if (saved === 'ja' && isEN) {
    var jaTarget = REVERSE_MAP[raw] || REVERSE_MAP[raw + '/'] || '/';
    if (jaTarget) { location.replace(jaTarget); return; }
  }

  /* ── Inject button after DOM ready ── */
  function injectBtn() {
    if (document.getElementById('lang-toggle')) return;
    var themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;

    var btn = document.createElement('button');
    btn.id = 'lang-toggle';
    btn.className = 'lang-toggle';
    btn.setAttribute('aria-label', isEN ? 'Switch to Japanese' : 'Switch to English');
    btn.innerHTML = isEN
      ? '<span aria-hidden="true" style="font-size:1.05em">🇺🇸</span> EN'
      : '<span aria-hidden="true" style="font-size:1.05em">🇯🇵</span> JP';

    themeBtn.parentNode.insertBefore(btn, themeBtn.nextSibling);

    btn.addEventListener('click', function () {
      if (isEN) {
        localStorage.setItem('pv-lang', 'ja');
        location.href = REVERSE_MAP[raw] || REVERSE_MAP[raw + '/'] || '/';
      } else {
        localStorage.setItem('pv-lang', 'en');
        location.href = PAGE_MAP[jaPath] || '/en/';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectBtn);
  } else {
    injectBtn();
  }
})();
