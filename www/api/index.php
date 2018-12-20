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

/*
if ( is_dir($current) ) {
    $browser = new Browser($current);
    $response = ['nodes'=>$browser->getNodes(), 'attrs'=>$attrs];
} else {
    // File %TODO
    $response = [
        'attrs'=> $attrs,
        'nodes'=> [
            [
               'is_file'=> false,
               'pathname'=> $current,
               'filename'=> '..',
               'is_parent_path'=> true,
               'is_self_path'=> false,
               'size'=> 'tbd',
            ],
            [
               'is_file'=> true,
               'pathname'=> 'tbd',
               'filename'=> 'tbd',
               'is_parent_path'=> false,
               'is_self_path'=> true,
               'size'=> 'tbd',
            ],
        ]
    ];
}
 */

// ---

// %TODO DRY: ->respondAndExit(...)
header('Content-Type: application/json');
echo json_encode($response);
exit;
