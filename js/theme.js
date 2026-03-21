/**
 * Theme toggle — light / dark mode.
 * The initial theme is set inline in <head> (see head.njk) to prevent FOUC.
 * This file provides the toggle function and system preference listener.
 */
(function () {
  var STORAGE_KEY = 'theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Listen for system preference changes only when the user hasn't set a manual override.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Called by the toggle button.
  window.toggleTheme = function () {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  };
})();
