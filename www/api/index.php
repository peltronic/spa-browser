<?php
require_once('../../libs/Browser.php'); // %FIXME
$basepath = "/Users/petergorgone/workspace/study/MapLarge";
$home = $basepath."/"."treeroot";

$attrs = $_GET;

//GET     /index?src=root/foo/bar
if ( empty($attrs['src']) ) {
    $current = $home;
} else {
    $current = $basepath."/".$attrs['src']; // %FIXME: verify valid & exists
}

$browser = new Browser($current);
$response = ['nodes'=>$browser->getNodes(), 'attrs'=>$attrs];

// ---

// %TODO DRY: ->respondAndExit(...)
header('Content-Type: application/json');
echo json_encode($response);
exit;
