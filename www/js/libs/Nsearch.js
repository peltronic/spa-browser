function Searchtool() {

    return {

        buildList: function(nodes, clickHandler) {
            var div = $('<div>');
            var ul = $('<ul>').addClass('list-search');;
            var i, nObj, htmlStr, parsed;
    
            // Create & append one <li> element per child node
            for (i = 0; i < nodes.length; i++) {
                nObj = nodes[i];
    
                var cbWrapper = function(nObj) { // helper method for looping so we bind to the correct nObj in the callback below
                    return function(e) {
                        clickHandler(nObj);
                    };
                };
                //parsed = Utils.parseRelativePath(this.rootpath, nObj.pathname);
                parsed = nObj.pathname;
    
                li = $('<li>').attr('data-nodetype', nObj.nodeType);
    
                htmlStr = parsed + ' ('+nObj.size+')';
                a = $('<a>').addClass('tag-search').html( htmlStr ).appendTo(li);
                li.on('click', 'a.tag-search', cbWrapper(nObj));
                li.appendTo(ul);
            }
            return $('<div>').append('<h4>SearchResults</h4>').append(ul);
        },


        init: function () {
        }

    }
}
