//= require vendor/loadcss

(function() {
  var iF = document.cookie.replace(/(?:(?:^|.*;\s*)iF\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  if (iF === "true") {
    document.documentElement.className += " fonts-loaded";
  }
});
