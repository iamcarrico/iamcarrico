<?php

$css = FALSE;
$fonts = FALSE;

// Just going to leave this here for a while.
echo '<script>document.cookie = "iamCSS=; expires=Fri Oct 31 2011 16:48:10 GMT-0500 (CDT)";document.cookie = "iamFonts=; expires=Fri Oct 31 2011 16:48:10 GMT-0500 (CDT)";</script>';

if (isset($_COOKIE['iC'])) {
  $csspath = "/assets/style-" . htmlspecialchars($_COOKIE['iC'], ENT_QUOTES, 'UTF-8');
  $path_to_check = ltrim($csspath, '/');
  $css = file_exists($path_to_check);
}

if (isset($_COOKIE['iF'])) {
  $fontpath = "/assets/fonts/" . htmlspecialchars($_COOKIE['iF'], ENT_QUOTES, 'UTF-8');
  $font_path_to_check = ltrim($fontpath, '/');
  $fonts = file_exists($font_path_to_check);
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
