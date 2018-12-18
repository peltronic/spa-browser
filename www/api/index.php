<?php
// %FIXME: should be under api folder
//require_once('config.php');
$basepath = "/Users/petergorgone/workspace/study/MapLarge";
$home = $basepath."/"."treeroot";

$attrs = $_GET;

//GET     /index?src=root/foo/bar
if ( empty($attrs['src']) ) {
    $root = $home;
} else {
    $root = $basepath."/".$attrs['src']; // %FIXME: verify valid & exists
}

$results = [];
$dir   = new RecursiveDirectoryIterator($root, RecursiveDirectoryIterator::SKIP_DOTS);
//echo "[$root]\n";
foreach ($dir as $file) {
    $results[] = [
        'is_file' => $file->isFile(),
        'pathname' => $file->getPathname(),
        'filename' => $file->getFilename(),
        //'depth' => $dir->getDepth(),
    ];
    //echo " ├ $file\n";
}

// ---

$response = [
    'attrs' => $attrs,
    'results' => $results,
    'current_view' => 'tbd',
    'parent_view' => 'tbd',
    'children' => ['tbd1','tbd2'],
];

// ---

header('Content-Type: application/json');
echo json_encode($response);
exit;
