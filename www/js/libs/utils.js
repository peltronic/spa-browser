var Utils = {

    getAppURL: function() {
        return '//' + location.host + location.pathname;
    },

    countFiles: function(nodes) {
        return nodes.reduce( function(acc, n) {
            return n.is_file ? ++acc : acc;
        }, 0);
    },

    countFolders: function(nodes) {
        return nodes.reduce( function(acc, n) {
            if ( !n.is_file && !n.is_self_path && !n.is_parent_path) {
                acc++; // increase count if a folder except for 'self' (single dot) and 'parent (double dot)
            } 
            return acc;
        }, 0);
    },

    // html builder
    // render: returns html
    // build: returns jquery object
    //  [ ] set basepath in 'class' contructor
    //  %FIXME DRY: just refactor to renderNode (?)
    renderCurrentNode: function(node, basepath) {
        var parsed = this.parseRelativePath(basepath, node.pathname);
        //htmlStr = this.renderLink( parsed, parsed );
        htmlStr = parsed;
        htmlStr += ' ('+node.size+')'; // %FIXME: DRY
        return htmlStr;
    },

    // Create markup for a html <a> tag
    // html builder (??)
    renderLink: function(title, subpath) {
        var href = this.getAppURL()+'?path='+subpath;
        var htmlStr = '<a href="'+href+'" data-subpath="'+subpath+'">';
        htmlStr += title;
        htmlStr += '</a>';
        return htmlStr;
    },

    // html builder
    buildMeta: function(nodes) {
        var ul = $('<ul>');
        var li;
        li = $('<li>').html( 'File count: '+this.countFiles(nodes) ).appendTo(ul);
        li = $('<li>').html( 'Folder count: '+this.countFolders(nodes) ).appendTo(ul);
        return ul;
    },

    // Creates a <ul> list and adds nodes as <li> elements to it
    //  ~ %NOTE: tightly coupled to api response format
    // html builder
    buildChildList: function(nodes,basepath) {
        var ul = $('<ul>');
        var li, n, htmlStr;

        // parent node
        var parentNode = this.findParentNode(nodes);
        var parsed = this.parseRelativePath(basepath, parentNode.pathname);
        htmlStr = this.renderLink( 'parent', parsed );
        htmlStr += ' ('+parentNode.size+')';
        li = $('<li>');
        li.html(htmlStr).appendTo(ul);

        // child nodes
        for (var i = 0; i < nodes.length; i++) {
            n = nodes[i];
            if (n.is_parent_path || n.is_self_path) {
                continue;
            }
            parsed = this.parseRelativePath(basepath, n.pathname);
            htmlStr = this.renderLink( parsed, parsed );
            htmlStr += ' ('+n.size+')';
            li = $('<li>');
            li.html(htmlStr).appendTo(ul);
        }
        return ul;
    },

    // Give a full path and a basepath which is a subset of the full path, parse out the relative path
    // (the part that comes after the basepath).
    parseRelativePath: function(basepath, fullpath) {
        var re = new RegExp(basepath);
        var parsed = fullpath.replace(re, '');
        return parsed.replace(/^\/|\/$/g, ''); // remove any trailing or leading slashes
    },

    // Find parent node if any in a set of nodes returned from the api
    findParentNode: function(nodes) {
        return nodes.find( function(n) {
            return true === n.is_parent_path;
        });
        // %FIXME: handle undefined/doesn't exist case
    },

    findSelfNode: function(nodes) {
        return nodes.find( function(n) {
            return true === n.is_self_path;
        });
    },

    init: function() {
    }
}
