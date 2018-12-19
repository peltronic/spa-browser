var Utils = {

    getAppURL: function() {
        return '//' + location.host + location.pathname;
    },

    renderLink: function(title, subpath) {
        var href = this.getAppURL()+'?path='+subpath;
        var html = '<a href="'+href+'" data-subpath="'+subpath+'">';
        html += title;
        html += '</a>';
        return html;
    },

    // Creates a <ul> list and adds nodes as <li> elements to it
    //  ~ %NOTE: tightly coupled to api response format
    buildChildList: function(nodes,basepath) {
        var ul = $('<ul>');
        var li;
        var n;

        // parent node
        var parentNode = this.findParentNode(nodes);
        var parsed = this.parseRelativePath(basepath, parentNode.pathname);
        li = $('<li>');
        li.html( this.renderLink( 'parent', parsed ) ).appendTo(ul);

        // child nodes
        for (var i = 0; i < nodes.length; i++) {
            n = nodes[i];
            if (n.is_parent_path || n.is_self_path) {
                continue;
            }
            parsed = this.parseRelativePath(basepath, n.pathname);
            li = $('<li>');
            li.html( this.renderLink( parsed, parsed ) ).appendTo(ul);
        }
        return ul;
    },

    parseRelativePath: function(basepath, fullpath) {
        var re = new RegExp(basepath);
        var parsed = fullpath.replace(re, '');
        return parsed.replace(/^\/|\/$/g, ''); // remove any trailing or leading slashes
    },

    findParentNode: function(nodes) {
        var parentNode = nodes.find( function(o) {
            return true === o.is_parent_path;
        });
        return parentNode; // %FIXME: handle undefined/doesn't exist case
    },

    init: function() {
    }
}
