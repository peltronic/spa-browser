<?php

class Browser {

    protected $_rdi = null;

    public function __construct(string $rootNode) 
    {
        // Use PHP's recursive directory iterator for 'indexing'
        //$this->_rdi = new RecursiveDirectoryIterator($rootNode, RecursiveDirectoryIterator::SKIP_DOTS);
        $this->_rdi = new RecursiveDirectoryIterator($rootNode); // include linux 'dot' paths
    }

    public function getNodes()
    {
        $nodes = [];

        foreach ($this->_rdi as $file) {

            $isSelfPath = '.' === $file->getFilename(); // is this node the linux 'single dot' path (same folder)?
            $isParentPath = '..' === $file->getFilename(); // is this node the linux 'double dot' path (parent folder)?
        
            // return attributes for the node
            $nodes[] = [
                'is_file' => $file->isFile(),
                'pathname' => realpath($file->getPathname()), // use realpath to remove '..'
                'filename' => $file->getFilename(),
                'is_parent_path' => $isParentPath,
                'is_self_path' => $isSelfPath,
                'size' => $file->getSize(),
                //'tbd' => $file->key(),
                //'depth' => $this->_rdi->getDepth(),
            ];
            //echo " ├ $file\n";
        }
        return $nodes;
    }

}
