<?php
$basepath = "/Users/petergorgone/workspace/study/MapLarge";
$home = "treeroot";

$configs = [
    'basepath' => $basepath,
    'home'     => $home
];
$response = [
    'configs' => $configs,
];

// ---

header('Content-Type: application/json');
echo json_encode($response);
exit;
