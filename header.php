<?php

$css = FALSE;
$fonts = FALSE;

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

if ($css) {
  echo '<link rel="stylesheet" href="' . $csspath . '">';
}
else {
  echo file_get_contents('inlines/css.inc');
}
?>
