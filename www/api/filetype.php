<?php
require_once('../../libs/Utils.php'); // %FIXME
// returns file, folder, or invalid (doesn't exist, or not writable, readable, etc)

$attrs = $_POST; // query params

$errors = [];
$rootpath = null; // init value (null returned on error)


if ( empty($attrs['rootpath']) ) {
    $errors[] = "Missing required parameter 'rootpath'";
} else {
    $attrs['rootpath'] = trim($attrs['rootpath']);
    $e = Utils::checkPath($attrs['rootpath'],'folder');
    if ( count($e) ) {
        $errors = array_merge($errors,$e);
    } else if ( !is_writable($attrs['rootpath']) ) {
        $errors[] = "Rootpath ".$attrs['rootpath']." is not a writable folder path";
    } else {
        $rootpath = $attrs['rootpath'];
    }
}

$response = [
    'errors' => $errors,
    'rootpath' => $rootpath,
];

// ---

header('Content-Type: application/json');
echo json_encode($response);
exit;
