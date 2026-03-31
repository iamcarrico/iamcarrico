// Theme initialization — runs immediately in <head> to prevent FOUC.
(function () {
  var stored = localStorage.getItem('theme');
  var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

// Interactive behavior — deferred until DOM is ready.
(function () {
  'use strict';

  var STORAGE_KEY = 'theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Use the native CSS Font Loading API to signal when custom fonts are ready.
  document.fonts.ready.then(function () {
    document.documentElement.classList.add('fonts-loaded');
  }).catch(function () {
    document.documentElement.classList.add('fonts-unavailable');
  });

  // Listen for system preference changes only when the user hasn't set a manual override.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('toggle-menu').onclick = function () {
      var nav = document.getElementById('nav');
      var btn = document.querySelector('.menu-toggle');
      var isOpen = nav.classList.toggle('nav-open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      btn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    };

    document.getElementById('toggle-theme').onclick = function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
    };
  });
})();
