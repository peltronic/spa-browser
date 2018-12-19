<?php
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
//$dir   = new RecursiveDirectoryIterator($root, RecursiveDirectoryIterator::SKIP_DOTS);
$dir   = new RecursiveDirectoryIterator($root);
//echo "[$root]\n";
foreach ($dir as $file) {
    $isSelfPath = '.' === $file->getFilename();
    $isParentPath = '..' === $file->getFilename();

    $results[] = [
        'is_file' => $file->isFile(),
        'pathname' => realpath($file->getPathname()), // use realpath to remove '..'
        'filename' => $file->getFilename(),
        'is_parent_path' => $isParentPath,
        'is_self_path' => $isSelfPath,
        //'tbd' => $file->key(),
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
