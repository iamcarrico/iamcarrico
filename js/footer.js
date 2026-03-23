'use strict';

// Use the native CSS Font Loading API to signal when custom fonts are ready.
// The .fonts-loaded class can be used in CSS to swap to the custom typeface
// while .fonts-unavailable provides a fallback style if loading fails.
document.fonts.ready.then(function() {
  document.documentElement.classList.add('fonts-loaded');
}).catch(function() {
  document.documentElement.classList.add('fonts-unavailable');
});



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

  // Mobile nav toggle.
  document.getElementById("toggle-menu").onclick = function () {
    var nav = document.getElementById('nav');
    var btn = document.querySelector('.menu-toggle');
    var isOpen = nav.classList.toggle('nav-open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    btn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  };

  // Called by the toggle button.
  document.getElementById("toggle-theme").onclick = function () {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  };
})();
