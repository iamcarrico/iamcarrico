<?php
// This file is generated by Composer
require_once 'vendor/autoload.php';

function return_error() {
  header("Location: https://" . $_SERVER['SERVER_NAME'] . "/50x.html");
  exit;
}

function return_good() {
  header("Location: https://" . $_SERVER['SERVER_NAME'] . "/contact/thank_you/");
  exit;
}

if (empty($_POST)) {
  return_error();
}

@include_once '../settings.php';

if (!defined('AUTH_TOKEN')) {
  return_error();
}

// Get the user input.
$inputs = array(
  'name',
  'phone',
  'message',
);

foreach ($inputs as $var_name) {
  $$var_name = filter_input(INPUT_POST, $var_name, FILTER_SANITIZE_STRING);
}

// Handle email differently.
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);

if (empty($email) || empty($name) || empty($message) || empty($_POST['g-recaptcha-response'])) {
  return_error();
}

$request_ip = $_SERVER['REMOTE_ADDR'];
$x_forwarded = $_SERVER['HTTP_X_FORWARDED_FOR'];

// ReCaptcha, because SPAM bots are killing me.
$recaptcha = new \ReCaptcha\ReCaptcha(RECAPTCHA_SECRET);
$resp = $recaptcha->verify($_POST['g-recaptcha-response'], $request_ip);
if ($resp->isSuccess()) {
    // verified!
} else {
    return_error();
}



$body = <<<EOT
*Name:* $name
*Email:* $email
*Phone:* $phone
*Request IP:* $request_ip
*X Forwarded IP:* $x_forwarded
*Message:*
$message
EOT;


if (IAMPRODUCTION) {
  $client = new \Github\Client();

  $client->authenticate(AUTH_TOKEN, NULL, Github\Client::AUTH_URL_TOKEN);

  $created_issue = $client->api('issue')->create(REPO_OWNER, REPO_NAME, array(
    'title' => 'New message from ' . $name,
    'body' => $body,
    'labels' => array('Form Entry'),
  ));

  if ($created_issue) {
    return_good();
  }
  else {
    return_error();
  }
}
else {
  return_good();
}
