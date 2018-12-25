function BrowserApp() {

    return {

        searchtool: null,
        navigator: null,

        // helper function for common code
        updateUIMisc: function() {
            $('#val-current').html( this.navigator.renderCurrent() );
            $('.meta').html( this.buildMeta() );
            $('.children').html( this.buildChildList() );
            $('.parent').html( this.buildParentList() );
        },
    
        doUpdate: function(selectedNode) {

            var _this = this;

            if ( 'file' == selectedNode.nodeType ) {
                // navigating into file
                this.navigator.pushFile(selectedNode);
                this.updateUIMisc();
            } else {
                // navigating into a folder
                (function () {
                    // Call index api to get list of parent & child nodes at url associated with selected node
                    return $.getJSON('/api/index.php', { src: selectedNode.pathname } );
                })()
                .then( function(response) {
                    // Process response of 'index' API call 
                    _this.navigator.update(response.nodes); 
                    window.history.replaceState( {}, 'MapLarge App', Utils.getAppURL()+'?path='+_this.navigator.currentNode.pathname ); // update browser URL %TODO: encasualte in function
                    _this.updateUIMisc();
                });
            }
        },

        buildParentList: function() {
            var ul = $('<ul>').addClass('list-parent');
            var nObj, htmlStr, parsed, li, a;
            var _this = this;
        
            // Create & append a single <li> element representing parent node
            nObj = this.navigator.parentNode;
            //parsed = Utils.parseRelativePath(this.rootpath, nObj.pathname); // %FIXME: could be empty string case when root
            parsed = nObj.pathname;

            var cbWrapper = function(nObj) { // helper method for looping so we bind to the correct nObj in the callback below
                return function(e) {
                    _this.doUpdate(nObj);
                };
            };

            li = $('<li>').attr('data-nodetype', nObj.nodeType);

            htmlStr = parsed + ' ('+nObj.size+')';
            if ( this.navigator.currentNode.pathname === this.rootpath ) {
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
        buildChildList: function() {
            var ul = $('<ul>').addClass('list-children');
            var i, nObj, htmlStr, parsed, li, a;
            var _this = this;
        
            if ('folder' === this.navigator.currentNode.nodeType) {
                // Create & append one <li> element per child node
                for (i = 0; i < this.navigator.childNodes.length; i++) {
                    nObj = this.navigator.childNodes[i];
                    var cbWrapper = function(nObj) { // helper method for looping so we bind to the correct nObj in the callback below
                        return function(e) {
                            _this.doUpdate(nObj);
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
            var ul = $('<ul>').addClass('list-meta');
            $('<li>').html( 'Type: '+this.navigator.currentNode.nodeType ).appendTo(ul);
            if ( 'file' === this.navigator.currentNode.nodeType ) {
                htmlStr = '<a class="clickme-to_move">Move</a>' ;
                htmlStr += ' | <a class="clickme-to_copy">Copy</a>' ;
                htmlStr += ' | <a class="clickme-to_delete">Delete</a>' ;
                htmlStr += ' | <a class="clickme-to_download">Download</a>' ;
                $('<li>').html( htmlStr ).appendTo(ul);
            } else {
                $('<li>').html( 'File count: '+this.fileCount ).appendTo(ul);
                $('<li>').html( 'Folder count: '+this.folderCount ).appendTo(ul);
                htmlStr = '<a class="clickme-to_upload">Upload</a>' ;
                $('<li>').html( htmlStr ).appendTo(ul);
            }
            return ul;
        },


        init: function () {
            this.navigator = Navigator();
            this.searchtool = Searchtool();
            this.uploader = Uploader();
            this.rootinit = Rootinit();
            var _this = this;

            _this.searchtool.init(_this.navigator);
            _this.uploader.init(_this.navigator, function() {
                // render callback (so the uploaded file shows up in child list)
                _this.doUpdate(_this.navigator.currentNode);
                $('.children').html( _this.buildChildList() );
            });
            _this.rootinit.init(function(rootpath, nodes) {
                // render callback after calling API to update rootpath and retrieving nodes
                _this.navigator.setRootpath(rootpath); // update the rootpath 
                _this.navigator.update(nodes); // update navigator *after* setting rootpath!
                window.sessionStorage.setItem("rootpath", _this.navigator.rootpath);
                window.history.replaceState( {}, 'MapLarge App', Utils.getAppURL()+'?path='+_this.navigator.rootpath ); // update browser URL to new rootpath
                $('.root-path .show-val').html(_this.navigator.rootpath);
                _this.updateUIMisc();
            });


            // Handle app initialization on page load
    
            // 'rootpath' is the top node, set via the UI and persistently stored in browser session. Navigation
            //    above root node is not allowed.
            // %FIXME: can they hack rootpath directly in session Storage??
            var rootpath = window.sessionStorage.getItem("rootpath");
            if ( null === rootpath ) {
                return; // do nothing...user needs to set a rootpath via UI
            }
    
            // Load page based on link in browser (deep-linking)...
            var urlParams = new URLSearchParams(window.location.search);
            var browserURL = urlParams.has('path') ? urlParams.get('path') : rootpath; // default to rootpath if not set or valid
    
            _this.navigator.setRootpath(rootpath);
            $('.root-path .show-val').html(_this.navigator.rootpath); // update UI
    
            // Call index api to get list of child & parent nodes at url in browser or default
            (function () {
                return $.getJSON('/api/index.php', { src: browserURL } );
            })()
            .then( function(response) {
                _this.navigator.update(response.nodes); // update navigator state
                window.history.replaceState( {}, 'MapLarge App', Utils.getAppURL()+'?path='+browserURL ); // update browser URL (deep-linking)
                _this.updateUIMisc();
            });

            // --- Download (file only) ---
        
            $(document).on('click', '.list-meta .clickme-to_download', function(e) {
                e.preventDefault();
                var url = '/api/download.php';
                url += '?src='+_this.navigator.currentNode.pathname;
                url += '&filename='+_this.navigator.currentNode.filename;
                window.location.href = url;
                return false;
            });

        } // init()

    }
}
