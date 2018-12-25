<?php
require_once('../../libs/Utils.php'); // %FIXME
require_once('../../libs/Browser.php'); // %FIXME

// NOTE: can only browse to folders, not files. Ie the 'src' parameter
//   can only be a folder path not a file path

$attrs = $_GET; // eg: GET /index?src=root/foo/bar
$nodes = [];
$errors = [];

if ( empty($attrs['src']) ) {
    $errors[] = "Missing required parameter 'src'";
} else {
    $e = Utils::checkPath($attrs['src']);
    if ( count($e) ) {
        $errors = array_merge($errors,$e);
    } else {
        $browser = new Browser($attrs['src']);
        $nodes = $browser->getNodes();
    }
}

// extra safety check
if ( !Utils::isWhitelisted($attrs['src']) ) {
    throw new \Exception("Access denied");
}

$response = [ 'attrs'=>$attrs, 'nodes'=>$nodes, 'errors'=>$errors ];

// ---

// %TODO DRY: ->respondAndExit(...)
header('Content-Type: application/json');
echo json_encode($response);
exit;
