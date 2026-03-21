'use strict';

// Use the native CSS Font Loading API to signal when custom fonts are ready.
// The .fonts-loaded class can be used in CSS to swap to the custom typeface
// while .fonts-unavailable provides a fallback style if loading fails.
document.fonts.ready.then(function() {
  document.documentElement.classList.add('fonts-loaded');
}).catch(function() {
  document.documentElement.classList.add('fonts-unavailable');
});
