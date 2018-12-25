<?php

class Utils {

    public static function checkPath($path,$requiredType=null)
    {
        $errors = [];
        if ( !file_exists($path) ) {
            $errors[] = "Path ".$path." is not a valid path";
        } else if ( ('file'===$requiredType) && !is_file($path) ) {
            $errors[] = "Path ".$path." is not a valid file path";
        } else if ( ('folder'===$requiredType) && !is_dir($path) ) {
            $errors[] = "Path ".$path." is not a valid folder path";
        }

        if ( !self::isWhitelisted($path) ) {
            $errors[] = "Access denied for path ".$path;
        }

        return $errors;
    }

    // To avoid major security holes for this app, only allow access to
    // folders including or under the 'MapLarge' sandbox
    //   ~ Adopted from https://stackoverflow.com/questions/1628699/test-if-a-directory-is-a-sub-directory-of-another-folder
    public static function isWhitelisted($thisPath=null)
    {
        $parentFolder = '/Users/petergorgone/workspace/study/MapLarge';
        return self::isSubfolder($parentFolder, $thisPath);
    }

    public static function isSubfolder($parentFolder, $thisPath)
    {
        //Get directory path minus last folder
        $dir = dirname($thisPath);
        $folder = substr($thisPath, strlen($dir));
    
        //Check if base dir is valid
        $dir = realpath($dir);
    
        //Only allow valid filename characters
        $folder = preg_replace('/[^a-z0-9\.\-_]/i', '', $folder);
    
        //If this is a bad path or a bad end folder name
        if( !$dir OR !$folder OR $folder === '.') {
            return false;
        }
    
        //Rebuild path
        $thisPath = $dir.'/'. $folder;
    
        //If this path is higher than the parent folder
        if( strcasecmp($thisPath, $parentFolder) > 0 ) {
            return $thisPath;
        }
    
        return false;
    }
}
