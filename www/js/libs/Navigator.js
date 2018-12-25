"use strict";

function Navigator() {

    // The Navigator object holds an array of the child nodes, plus the parent node, based on the
    //   current node. It also tracks to roothpath and misc. associated data

    return {

        rootpath: null,
        parentNode: null,
        currentNode: null,
        childNodes: [],
        folderCount: 0, // children only
        fileCount: 0,
        selectedNode: null, // for move, copy, delete ops %TODO

        setRootpath: function(rootpath) {
            this.rootpath = rootpath;
        },

        // Update with a array of nodes returned from the api
        // API format for a node should include the following attributes:
        //  .is_file
        //  .size
        //  .pathname
        //  .filename
        // %TODO :rename to refreshFromAPI or etc (?)
        update: function(nodes) {
        
            var i, nIter;
        
            this.doReset();
        
            // set nodes[]
            for ( i = 0 ; i < nodes.length; i++ ) {
                nIter = nodes[i];
                if (nIter.is_file) {
                    // files are always children
                    this.childNodes.push( new FileNode(nIter.size, nIter.pathname, nIter.filename) );
                    ++this.fileCount;
                } else {
                    // Only a folder can be parent or current node
                    if (nIter.is_parent_path) {
                        this.parentNode = new FolderNode(nIter.size, nIter.pathname, nIter.filename, true, false);
                    } else if (nIter.is_self_path) {
                        this.currentNode = new FolderNode(nIter.size, nIter.pathname, nIter.filename, false, true);
                    } else {
                        this.childNodes.push( new FolderNode(nIter.size, nIter.pathname, nIter.filename) );
                        ++this.folderCount; // only count children
                    }
                }
            }
        },
        
        // Push down to a child node which is a file and refresh
        // %TODO: how is this going to work clicking on a file in search results?
        pushFile: function(fileNode) {
            this.parentNode = this.currentNode;
            this.currentNode = fileNode;
        },
        
        // Return from file child node to its folder parent
        popFile: function() {
            this.currentNode = this.parentNode;
        },
        
        doReset: function() {
            this.parentNode = null;
            this.currentNode = null;
            this.childNodes = [];
            this.folderCount = 0; // children only
            this.fileCount = 0;
        },

        init: function () {
        }

    }
}
