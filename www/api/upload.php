<?php
require_once('../../libs/Utils.php'); // %FIXME
require_once('../../libs/Browser.php'); // %FIXME

$basepath = "/Users/petergorgone/workspace/study/MapLarge"; // %FIXME: take from constant file DRY
//$home = $basepath."/"."treeroot";

$attrs = $_POST;
$errors = [];


try { 
    if ( empty($attrs['dst']) ) {
        throw new Exception('Destination path parameter required');
    }
    if ( !is_dir($attrs['dst']) ) {
        throw new Exception('Destination directory '.$attrs['dst'].' is not a valid path');
    }
    if ( !is_writable($attrs['dst']) ) {
        throw new Exception('Destination directory '.$attrs['dst'].' is not writable');
    }
    //print_r($attrs, $_FILES);

    // extra safety check
    if ( !Utils::isWhitelisted($attrs['dst']) ) {
        throw new \Exception("Access denied");
    }

    if ( 0 < $_FILES['file']['error'] ) {
        $errors[] = $_FILES['file']['error'];
        throw new Exception('File error');
    } else {
        move_uploaded_file($_FILES['file']['tmp_name'], $attrs['dst'].'/'.$_FILES['file']['name']);
    }
    
    $browser = new Browser($attrs['dst']);
    $response = ['nodes'=>$browser->getNodes(), 'attrs'=>$attrs];
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
