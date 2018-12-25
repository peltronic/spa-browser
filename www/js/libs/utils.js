var Utils = {

    getAppURL: function() {
        return '//' + location.host + location.pathname;
    },

    // Give a full path and a basepath which is a subset of the full path, parse out the relative path
    // (the part that comes after the basepath).
    parseRelativePath: function(basepath, fullpath) {
        var re = new RegExp(basepath);
        var parsed = fullpath.replace(re, '');
        return parsed.replace(/^\/|\/$/g, ''); // remove any trailing or leading slashes
    },

    // 'Factory'-like method to build a list of nodes from api 'search' results
    createNodeArray: function(nodesIn) {
        var i, nIter, htmlStr, nodeType;
        var nodesOut = [];

        for ( i = 0 ; i < nodesIn.length; i++ ) {
            nIter = nodesIn[i];
            if (nIter.is_file) {
                // files are always children
                nodesOut.push( new FileNode(nIter.size, nIter.pathname, nIter.filename) );
            } else {
                nodesOut.push( new FolderNode(nIter.size, nIter.pathname, nIter.filename) );
            }
        }
        return nodesOut;
    },

    buildSearchList: function(nodes) {
        var i, nObj, htmlStr, parsed;
        var ul = $('<ul>');

        // Create & append one <li> element per child node
        for (i = 0; i < nodes.length; i++) {
            nObj = nodes[i];
            //parsed = Utils.parseRelativePath(this.rootpath, nObj.pathname);
            parsed = nObj.pathname;
            htmlStr = this.renderLink( parsed, parsed ) + ' ('+nObj.size+')';
            $('<li>').attr('data-nodetype', nObj.nodeType).html(htmlStr)
                     //.attr('data-guid', i) // poor-man's hash to locate from associated DOM
                     .appendTo(ul);
        }
        return ul;
    },

    renderLink: function(title, path) {
        // Create markup for a html <a> tag
        var href = Utils.getAppURL()+'?path='+path;
        return '<a href="'+href+'" class="clickme_to_navigate" data-OFF_subpath="'+path+'">' + title + '</a>';
    },

    
    init: function() {
    }
}
