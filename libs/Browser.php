<?php

class Browser {

    protected $_rdi = null;

    public function __construct(string $rootNode) 
    {
        //$this->_rdi = new RecursiveDirectoryIterator($rootNode, RecursiveDirectoryIterator::SKIP_DOTS);
        $this->_rdi = new RecursiveDirectoryIterator($rootNode);
    }

    public function getAll()
    {
        $nodes = [];

        foreach ($this->_rdi as $file) {

            $isSelfPath = '.' === $file->getFilename();
            $isParentPath = '..' === $file->getFilename();
        
            $nodes[] = [
                'is_file' => $file->isFile(),
                'pathname' => realpath($file->getPathname()), // use realpath to remove '..'
                'filename' => $file->getFilename(),
                'is_parent_path' => $isParentPath,
                'is_self_path' => $isSelfPath,
                //'tbd' => $file->key(),
                //'depth' => $this->_rdi->getDepth(),
            ];
            //echo " ├ $file\n";
        }

        return [
            'nodes' => $nodes,
        ];
    }

}
