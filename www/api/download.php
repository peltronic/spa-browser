<?php
require_once('../../libs/Utils.php');

$attrs = $_REQUEST; // query params

if ( empty($attrs['src']) ) {
    $errors[] = "Missing required parameter 'src'";
} else if ( !Utils::isWhitelisted($attrs['src']) ) {
    throw new \Exception("Access denied");
} else {
    $e = Utils::checkPath($attrs['src']);
    if ( count($e) ) {
        $errors = array_merge($errors,$e);
    }
}
//print_r($attrs); die;

header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename='.$attrs['filename']);
readfile($attrs['src']); 
//header('Content-Disposition: attachment; filename='.$_REQUEST['f']);
//readfile('../some_folder/some_subfolder/'.$_REQUEST['f']); 
exit;
