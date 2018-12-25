function Navigator() {

    return {

        rootpath: null,
        parentNode: null,
        currentNode: null,
        childNodes: [],
        folderCount: 0, // children only
        fileCount: 0,
        selectedNode: null, // for move, copy, delete ops

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
        // %FIXME: how is this going to work clicking on a file in search results?
        pushFile: function(fileNode) {
            this.parentNode = this.currentNode;
            this.currentNode = fileNode;
            //this.childNodes = []; // no, keep child nodes there, just don't show them
        },
        
        // Return from file child node to its folder parent
        popFile: function() {
            this.currentNode = this.parentNode;
            //this.parentNode = ; // ???
            //this.childNodes = []; // no, keep child nodes there, just don't show them
        },
        
        
        
        // Render node as the current node (selected folder or file)
        // %TODO: what to do in file case? or , this can only be folder, have other mechanism
        // for highlighting a file (?)
        renderCurrent: function() {
            //var parsed = Utils.parseRelativePath(this.rootpath, this.currentNode.pathname);
            var parsed = this.currentNode.pathname;
            return parsed + ' ('+this.currentNode.size+')'; // %FIXME: DRY
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
