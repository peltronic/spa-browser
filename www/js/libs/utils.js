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

    init: function() {
    }
}
