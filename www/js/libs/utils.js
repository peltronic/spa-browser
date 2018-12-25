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

    // 'Factory'-like method to build a list of nodes from api results (eg, from search, etc)
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

    init: function() {
    }
}
