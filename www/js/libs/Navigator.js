
function Navigator(nodes) {
    var i, nIter;
    this.parentNode = null;
    this.selfNode = null;
    this.childNodes = [];

    // set nodes[]
    for ( i = 0 ; i < nodes.length; i++ ) {
        nIter = nodes[i];
        if (nIter.is_file) {
            // files are always children
            this.childNodes.push( new FileNode(nIter.size, nIter.pathname, nIter.filename) );
        } else {
            if (nIter.is_parent_path) {
                this.parentNode = new FolderNode(nIter.size, nIter.pathname, nIter.filename, true, false) );
            } else if (nIter.is_self_path) {
                this.selfNode = new FolderNode(nIter.size, nIter.pathname, nIter.filename, false, true) );
            } else {
                this.childNodes.push( new FolderNode(nIter.size, nIter.pathname, nIter.filename) );
            }
        }
    }
    // set parentNode

    // set childNodes[]
}

// Creates a <ul> list and adds nodes as <li> elements to it
Node.prototype.buildChildList = function(basepath) {
    //  ~ %NOTE: tightly coupled to api response format
    var i, nObj, htmlStr;
    var ul = $('<ul>');

    // Create & append one <li> element per child node
    for (i = 0; i < this.chlidNodes.length; i++) {
        nObj = this.childNodes[i];
        parsed = Utils.parseRelativePath(basepath, nObj.pathname);
        htmlStr = Utils.renderLink( parsed, parsed ) + ' ('+nObj.size+')';
        $('<li>').html(htmlStr).appendTo(ul);
    }
    return ul;
}
