function Navigator() {

    //var button = $("#someButton");

    return {

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
        
        buildParentList: function() {
            var nObj, htmlStr, parsed;
            var ul = $('<ul>');
        
            // Create & append a single <li> element representing parent node
            nObj = this.parentNode;
            //parsed = Utils.parseRelativePath(this.rootpath, nObj.pathname); // %FIXME: could be empty string case when root
            parsed = nObj.pathname;
            if ( this.currentNode.pathname === this.rootpath ) {
                htmlStr = parsed + ' ('+nObj.size+')';
            } else {
                htmlStr = Utils.renderLink( parsed, parsed ) + ' ('+nObj.size+')';
            }
            $('<li>').attr('data-nodetype', nObj.nodeType).html(htmlStr)
                    .attr('data-guid', 'parent') // poor-man's hash to locate from associated DOM (%FIXME: explain better)
                    .appendTo(ul);
            return ul;
        },
        
        // Creates a <ul> list and adds nodes as <li> elements to it
        buildChildList: function(clickHandler) {
            var i, nObj, htmlStr, parsed;
            var ul = $('<ul>');
            var li;
            var _this = this;
        
            if ('folder' === this.currentNode.nodeType) {
                // Create & append one <li> element per child node
                for (i = 0; i < this.childNodes.length; i++) {
                    nObj = this.childNodes[i];
                    var cbWrapper = function(nObj) { // helper method so we bind to the correct nObj in the callback below
                        return function(e) {
                            clickHandler(nObj);
                        };
                    };
                    //parsed = Utils.parseRelativePath(this.rootpath, nObj.pathname);
                    parsed = nObj.pathname;
                    li = $('<li>').attr('data-nodetype', nObj.nodeType)
                                  .attr('data-guid', i) // poor-man's hash to locate from associated DOM (%FIXME: explain better)
                                  .html(htmlStr);
                    $('<a>').bind('click', cbWrapper(nObj))
                            .addClass('clickme_to_navigate')
                            .html( parsed+' ('+nObj.size+')' )
                            .appendTo(li);
                    li.appendTo(ul);
                }
            } // otherwise, files have no children...

            return ul;
        },
        
        
        buildMeta: function() {
            var htmlStr = '';
            var ul = $('<ul>').addClass('tag-meta');
            $('<li>').html( 'File count: '+this.fileCount ).appendTo(ul);
            $('<li>').html( 'Folder count: '+this.folderCount ).appendTo(ul);
            $('<li>').html( 'Type: '+this.currentNode.nodeType ).appendTo(ul);
            if ( 'file' === this.currentNode.nodeType ) {
                htmlStr = '<a class="clickme-to_move">Move</a>' ;
                htmlStr += ' | <a class="clickme-to_copy">Copy</a>' ;
                htmlStr += ' | <a class="clickme-to_delete">Delete</a>' ;
                htmlStr += ' | <a class="clickme-to_download">Download</a>' ;
                $('<li>').html( htmlStr ).appendTo(ul);
            } else {
                htmlStr = '<a class="clickme-to_upload">Upload</a>' ;
                $('<li>').html( htmlStr ).appendTo(ul);
            }
            return ul;
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

        /*
        initialise: function () {
            button.click(function () {
                // I want "this.clearSelection();" to target the 
                // "clearSelection" function below.
                // Instead, it targets the button itself.
                // How can i refer to it?
                this.clearSelection();
            });
        },

        clearSelection: function () {
            this.populateList($("#stuff"), someData);
            $("#adiv").empty();
            console.log("clearSelection");
        },

        populateList: function (var1, var2) {
            //do something to a list
        },
        */

        init: function () {
        }

    }
}
