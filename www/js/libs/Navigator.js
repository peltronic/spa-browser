//
// Navigator 'class'. Creates a tree map of nodes from the point of view of
// the 'current' node
//


// Instantiate with a array of nodes returned from the api
function Navigator() {
    this.rootpath = null;
    this.parentNode = null;
    this.currentNode = null;
    this.childNodes = [];
    this.folderCount = 0; // children only
    this.fileCount = 0;

    /*
    if ( 'undefined'!==typeof(nodes) ) {
        // %TODO: check if array
        this.update(nodes);
    }
    */
}

Navigator.prototype.setRootpath = function(rootpath) {
    this.rootpath = rootpath;
}

// Update with a array of nodes returned from the api
// API format for a node should include the following attributes:
//  .is_file
//  .size
//  .pathname
//  .filename
// %TODO :rename to refreshFromAPI or etc (?)
Navigator.prototype.update = function(nodes) {

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
}

// Push down to a child node which is a file and refresh
// %FIXME: how is this going to work clicking on a file in search results?
Navigator.prototype.pushFile = function(fileNode) {
    this.parentNode = this.currentNode;
    this.currentNode = fileNode;
    //this.childNodes = []; // no, keep child nodes there, just don't show them
}

// Return from file child node to its folder parent
Navigator.prototype.popFile = function() {
    this.currentNode = this.parentNode;
    //this.parentNode = ; // ???
    //this.childNodes = []; // no, keep child nodes there, just don't show them
}

Navigator.prototype.buildParentList = function() {
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
}

// Creates a <ul> list and adds nodes as <li> elements to it
Navigator.prototype.buildChildList = function() {
    var i, nObj, htmlStr, parsed;
    var ul = $('<ul>');

    if ('folder' === this.currentNode.nodeType) {
        // Create & append one <li> element per child node
        for (i = 0; i < this.childNodes.length; i++) {
            nObj = this.childNodes[i];
            parsed = Utils.parseRelativePath(this.rootpath, nObj.pathname);
            htmlStr = Utils.renderLink( parsed, parsed ) + ' ('+nObj.size+')';
            $('<li>').attr('data-nodetype', nObj.nodeType).html(htmlStr)
                     .attr('data-guid', i) // poor-man's hash to locate from associated DOM (%FIXME: explain better)
                     .appendTo(ul);
        }
    } // otherwise, files have no children...
    return ul;
}


Navigator.prototype.buildMeta = function() {
    var ul = $('<ul>');
    $('<li>').html( 'File count: '+this.fileCount ).appendTo(ul);
    $('<li>').html( 'Folder count: '+this.folderCount ).appendTo(ul);
    return ul;
}


// Render node as the current node (selected folder or file)
// %TODO: what to do in file case? or , this can only be folder, have other mechanism
// for highlighting a file (?)
Navigator.prototype.renderCurrent = function() {
    //var parsed = Utils.parseRelativePath(this.rootpath, this.currentNode.pathname);
    var parsed = this.currentNode.pathname;
    return parsed + ' ('+this.currentNode.size+')'; // %FIXME: DRY
}

Navigator.prototype.doReset = function() {
    this.parentNode = null;
    this.currentNode = null;
    this.childNodes = [];
    this.folderCount = 0; // children only
    this.fileCount = 0;
}


