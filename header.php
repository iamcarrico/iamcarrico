<?php

$css = FALSE;
$fonts = FALSE;

if (isset($_COOKIE['iamCSS'])) {
  $csspath = htmlspecialchars($_COOKIE['iamCSS'], ENT_QUOTES, 'UTF-8');
  $path_to_check = ltrim($csspath, '/');
  $css = file_exists($path_to_check);
}

if (isset($_COOKIE['iamFonts'])) {
  $fontpath = htmlspecialchars($_COOKIE['iamFonts'], ENT_QUOTES, 'UTF-8');
  $font_path_to_check = ltrim($fontpath, '/');
  $fonts = file_exists($font_path_to_check);
}

if (!$css || !$fonts) {
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
