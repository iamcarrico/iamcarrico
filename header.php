<?php

$css = FALSE;

if (isset($_COOKIE['iamCSS'])) {
  $csspath = htmlspecialchars($_COOKIE['iamCSS'], ENT_QUOTES, 'UTF-8');
  $path_to_check = ltrim($csspath, '/');
  $css = file_exists($path_to_check);
}

if ($css) {
  echo '<link rel="stylesheet" href="' . $csspath . '">';
}
else {
  echo file_get_contents('inlines/style.inc');
}

?>
