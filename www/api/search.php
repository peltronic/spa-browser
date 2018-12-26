<?php
require_once('../../libs/Utils.php'); // %FIXME

$attrs = $_GET; // eg: GET /search?q=txt
$nodes = [];
$errors = [];

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

$attrs['q'] = empty($attrs['q']) ? '' : trim($attrs['q']);

if ( 0===count($errors) && !empty($attrs['q']) ) {
    $pattern = '/'.$attrs['q'].'/';
    $rdi = new RecursiveDirectoryIterator($attrs['src']);

    $fileList = [];
    foreach(new RecursiveIteratorIterator($rdi) as $file){
        $pathname = realpath($file->getPathname()); // use realpath to remove '..'
        $filename = $file->getFilename();
        $isSelfPath = '.' === $file->getFilename(); // is this node the linux 'single dot' path (same folder)?
        $isParentPath = '..' === $file->getFilename(); // is this node the linux 'double dot' path (parent folder)?

        if ($isParentPath) {
            continue; // otherwise we'll double-count folder matches (. and ..)
        }

        $basename = basename($pathname);

        if ( strpos($basename, $attrs['q']) !== false ) {
            $nodes[] = [
                'is_file' => $file->isFile(),
                'pathname' => $pathname,
                'filename' => $file->getFilename(),
                'basename' => $basename,
                'is_parent_path' => $isParentPath,
                'is_self_path' => $isSelfPath,
                'size' => $file->getSize(),
            ];
        }
    }

} 

$response = [ 'attrs'=>$attrs, 'nodes'=>$nodes, 'errors'=>$errors ];

// ---

// %TODO DRY: ->respondAndExit(...)
header('Content-Type: application/json');
echo json_encode($response);
exit;
