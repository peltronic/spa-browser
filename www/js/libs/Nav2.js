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
        
        buildParentList: function(clickHandler) {
            var ul = $('<ul>').addClass('tag-parent');
            var nObj, htmlStr, parsed, li, a;
        
            // Create & append a single <li> element representing parent node
            nObj = this.parentNode;
            //parsed = Utils.parseRelativePath(this.rootpath, nObj.pathname); // %FIXME: could be empty string case when root
            parsed = nObj.pathname;

            var cbWrapper = function(nObj) { // helper method for looping so we bind to the correct nObj in the callback below
                return function(e) {
                    clickHandler(nObj);
                };
            };

            li = $('<li>').attr('data-nodetype', nObj.nodeType);

            //htmlStr = Utils.renderLink( parsed, parsed ) + ' ('+nObj.size+')';
            htmlStr = parsed + ' ('+nObj.size+')';
            if ( this.currentNode.pathname === this.rootpath ) {
                li.html(htmlStr);
            } else {
                a = $('<a>').addClass('tag-parent').html( htmlStr ).appendTo(li);
                li.on('click', 'a.tag-parent', cbWrapper(nObj));
            }

            li.appendTo(ul);

            return ul;
        },
        
        // Creates a <ul> list and adds nodes as <li> elements to it
        //  ~ clickHanlder is a callback that takes care of app-level DOM manipulation
        buildChildList: function(clickHandler) {
            var ul = $('<ul>').addClass('tag-children');
            var i, nObj, htmlStr, parsed, li, a;
            var _this = this;
        
            if ('folder' === this.currentNode.nodeType) {
                // Create & append one <li> element per child node
                for (i = 0; i < this.childNodes.length; i++) {
                    nObj = this.childNodes[i];
                    var cbWrapper = function(nObj) { // helper method for looping so we bind to the correct nObj in the callback below
                        return function(e) {
                            clickHandler(nObj);
                        };
                    };
                    //parsed = Utils.parseRelativePath(this.rootpath, nObj.pathname);
                    parsed = nObj.pathname;

                    li = $('<li>').attr('data-nodetype', nObj.nodeType);

                    htmlStr = parsed + ' ('+nObj.size+')';
                    a = $('<a>').addClass('tag-child').html( htmlStr ).appendTo(li);
                    li.on('click', 'a.tag-child', cbWrapper(nObj));
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
