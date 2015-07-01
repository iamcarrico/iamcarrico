//= require vendor/fontfaceobserver
//= require vendor/fastclick

(function() {
  'use strict';

  // Enable fastclick.
  FastClick.attach(document.body);

  var fontPromises = [];
  var pt = new FontFaceObserver('pt');
  var italic = new FontFaceObserver('pt', {style: 'italic'});

  fontPromises.push(pt.check(null, 5000));
  fontPromises.push(italic.check(null, 5000));

  Promise.all(fontPromises).then(function() {
    // If all promises are fulfilled, then add the proper class to signify.
    document.documentElement.className += " fonts-loaded";
    document.cookie = "iF=true";
  }, function() {
    // A font did not load, create a class so that we know that we have
    // failed as loaders of fonts.
    document.documentElement.className += " fonts-unavailable";
    document.cookie = "iF=false";
  });
})();
