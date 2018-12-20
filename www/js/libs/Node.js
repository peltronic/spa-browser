
// --- Node ---

function Node(nodeType, size, filename) {
   this.nodeType = nodeType;
   this.size = size;
   this.pathname = pathname;
   this.filename = filename;
}

Node.prototype.getNodeType = function() {
    return this.nodeType;
}

// Node is rendered as the current node (selected folder or file)
Node.prototype.renderAsCurrent = function(basepath) {
    var parsed = Utils.parseRelativePath(basepath, this.pathname);
    return parsed + ' ('+this.size+')'; // %FIXME: DRY
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

// Node is rendered as a parent for navigation purposes (folders only)
FolderNode.prototype.renderAsParent = function(basepath) {
    var parsed = Utils.parseRelativePath(basepath, this.pathname);
    return Utils.renderLink( parsed, parsed );
}
