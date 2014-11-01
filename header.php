<?php

$css = FALSE;
$fonts = FALSE;

if (isset($_COOKIE['iamCSS']) || isset($_COOKIE['iamFonts'])) {
  // Removing the old syntax.
  echo '<script>document.cookie = "iamCSS=; expires=Fri Oct 31 2014 16:48:10 GMT-0500 (CDT)";document.cookie = "iamFonts=; expires=Fri Oct 31 2014 16:48:10 GMT-0500 (CDT)";</script>';
}

if (isset($_COOKIE['iC'])) {
  $csspath = htmlspecialchars($_COOKIE['iC'], ENT_QUOTES, 'UTF-8');
  $path_to_check = ltrim($csspath, '/');
  $css = file_exists("/assets/style-" . $path_to_check);
}

if (isset($_COOKIE['iF'])) {
  $fontpath = htmlspecialchars($_COOKIE['iF'], ENT_QUOTES, 'UTF-8');
  $font_path_to_check = ltrim($fontpath, '/');
  $fonts = file_exists("/assets/fonts/" . $font_path_to_check);
}

if (!$css || !$fonts) {
  header('x-do-not-cache');
  echo file_get_contents('inlines/loadcss.inc');
}

if ($css) {
  echo '<link rel="stylesheet" href="' . $csspath . '">';
}
else {
  echo file_get_contents('inlines/css.inc');
}

if ($fonts) {
  echo '<link rel="stylesheet" href="' . $fontpath . '">';
}
else {
  echo file_get_contents('inlines/fonts.inc');
}
?>
