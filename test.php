<?php
/*
$filelist = glob("*",0);
echo "Glob: \n";
print_r($filelist);
echo "\n";
 */

$root = "./treeroot";

/**
 * Example 1: DirectoryIterator
 */
$dir = new DirectoryIterator($root);
echo "[$root]\n";
foreach ($dir as $file) {
    echo " ├ $file\n";
}
echo "\n ================= \n";

/**
 * Example 6: Recursion Mode
 */
$dir   = new RecursiveDirectoryIterator($root, RecursiveDirectoryIterator::SKIP_DOTS);
$files = new RecursiveIteratorIterator($dir, RecursiveIteratorIterator::SELF_FIRST);
echo "[$root]\n";
foreach ($files as $file) {
    $indent = str_repeat('   ', $files->getDepth());
    echo $indent, " ├ $file\n";
}
die;

$it = new RecursiveDirectoryIterator($root);
$it->setFlags(RecursiveDirectoryIterator::SKIP_DOTS);
$suffixes = [ 'txt', 'jpg' ];
$results = [];
/*
print_r($it)."\n"; die;
foreach ( $it as $fileinfo ) {
    print_r($fileinfo)."\n"; die;
}
die;
 */

foreach ( new RecursiveIteratorIterator($it) as $file ) {
    /*
    print_r($file)."\n";
    $list = explode('.', $file);
    $fSuffix = array_pop($list);
     */
    /*
    if ( in_array( strtolower($fSuffix), $suffixes ) ) {
        $results[] = $file;
    }
     */
    $results[] = $file;
}
print_r($results)."\n";
die;
echo "A1: ".(!empty($results[1]->isFile())?"file":"dir")."\n";
echo "A2: ".(!empty($results[1]->isDir())?"dir":"file")."\n";
print_r($results[1]->getPathname()."\n");
echo "\n";
die;

echo "B: \n";
print_r($results[0]->getFilename());
echo "\n";

echo "C: \n";
print_r($results);
echo "\n";
