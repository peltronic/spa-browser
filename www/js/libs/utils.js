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
