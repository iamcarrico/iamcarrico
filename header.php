---
layout: null
---
<?php

$css = FALSE;
$current_file = "{% asset_path style.css %}";

if (isset($_COOKIE['iC'])) {
  $csspath = "/assets/style-" . htmlspecialchars($_COOKIE['iC'], ENT_QUOTES, 'UTF-8');
  $css = ($csspath == $current_file);
}

$fonts = (isset($_COOKIE['iF']) && $_COOKIE['iF'] == "true");

if ($css) {
  echo '<link rel="stylesheet" href="' . $csspath . '">';
}
else {
  echo file_get_contents('inlines/css.inc');
}
?></head><body class="<?php echo $fonts ? "fonts-loaded" : ""; ?>">
