
// --- Node ---

function Node(nodeType, size, pathname, filename) {
   this.nodeType = nodeType;
   this.size = size;
   this.pathname = pathname;
   this.filename = filename;
}

Node.prototype.getNodeType = function() {
    return this.nodeType;
}



// --- FileNode ---

function FileNode(size, pathname, filename) {
    Node.call(this, 'file', size, pathname, filename);
}
FileNode.prototype = Object.create(Node.prototype);
FileNode.prototype.constructor = FileNode;


// --- FolderNode ---

// isParentPath and isSelfPath are 'optional' arguments that default to false
function FolderNode(size, pathname, filename, isParentPath, isSelfPath) {
    Node.call(this, 'folder', size, pathname, filename );
    // %TODO: make isParentPath and isSelfPath optional
    this.isParentPath = 'undefined'===typeof(isParentPath) ? false : isParentPath; // the '..' file (in linux)
    this.isSelfPath   = 'undefined'===typeof(isSelfPath)   ? false : isSelfPath; // the '.' folder (in linux)
}
FolderNode.prototype = Object.create(Node.prototype);
FolderNode.prototype.constructor = FolderNode;

