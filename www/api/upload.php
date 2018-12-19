<?php
$basepath = "/Users/petergorgone/workspace/study/MapLarge"; // %FIXME: take from constant file DRY
//$home = $basepath."/"."treeroot";

$attrs = $_POST;
$errors = [];

try { 
    if ( empty($attrs['dst']) ) {
        throw new Exception('Destination path parameter required');
    }
    $current = $basepath."/".$attrs['dst'];
    if ( !is_dir($current) ) {
        throw new Exception('Destination directory '.$current.' is not a valid path');
    }
    if ( !is_writable($current) ) {
        throw new Exception('Destination directory '.$current.' is not writable');
    }
    //print_r($attrs, $_FILES);

    if ( 0 < $_FILES['file']['error'] ) {
        $errors[] = $_FILES['file']['error'];
        throw new Exception('File error');
    } else {
        move_uploaded_file($_FILES['file']['tmp_name'], $current.'/'.$_FILES['file']['name']);
    }
    // DRY: include index.php code here, send back same response & re-render ul list
    $response = ['ok'];
    $code = 200;
} catch (Exception $e) {
    $response = [
        'errors'=> $errors,
        'exception'=>$e->getMessage(),
    ];
    $code = 400; // %FIXME
}

// ---

header('Content-Type: application/json');
http_response_code($code);
echo json_encode($response);
exit;
