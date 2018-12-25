function Searchtool() {

    return {

        navigator: null,

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

        clearSearch: function(navigationCrate) {
            var thisForm = navigationCrate.find('form.form-search');
            thisForm.hide().trigger('reset');
            $('.search-results').html('');
            navigationCrate.find('.children').show();
            navigationCrate.find('.clickme-to_search').show();
        },

        init: function (navigator) {

            var _this = this;
            _this.navigator = navigator;

            $(document).on('submit', 'form.form-search', function (e) {
                e.preventDefault();
                var thisForm = $(this);
                var payload = {
                    q: thisForm.find('input[name="q"]').val(),
                    src: _this.navigator.currentNode.pathname
                };
                $.getJSON('/api/search.php', payload, function(response) {
                    var searchResults = Utils.createNodeArray(response.nodes);
                    $('.search-results').html( _this.buildList(searchResults, function(nObj) { 
                        var navigationCrate = thisForm.closest('.crate-navigation');
                        _this.clearSearch(navigationCrate); // Clear search form, etc before doing update callback
                        _this.doUpdate(nObj) 
                    }) );
                });
            });
        
            $(document).on('click', '.clickme-to_search', function(e) {
                var navigationCrate = $(this).closest('.crate-navigation');
                navigationCrate.find('.children').hide();
                navigationCrate.find('.clickme-to_search').hide();
                navigationCrate.find('form.form-search').show();
            });
        
            $(document).on('click', 'form.form-search .clickme-to_cancel', function(e) {
                var navigationCrate = $(this).closest('.crate-navigation');
                _this.clearSearch(navigationCrate);
            });

        } // init()

    }
}
