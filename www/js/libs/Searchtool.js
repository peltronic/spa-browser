"use strict";

function Searchtool() {

    return {

        navigator: null,


        clearSearch: function(navigationCrate) {
            var thisForm = navigationCrate.find('form.form-search');
            thisForm.hide().trigger('reset');
            //$('.search-results').html('');
            navigationCrate.find('.children').show();
            navigationCrate.find('.clickme-to_search').show();
        },

        init: function (navigator, renderCb) {

            var _this = this;
            _this.navigator = navigator;

            // Handle search form submit
            $(document).on('submit', 'form.form-search', function (e) {
                e.preventDefault();
                var thisForm = $(this);
                var payload = {
                    q: thisForm.find('input[name="q"]').val(),
                    src: _this.navigator.currentNode.pathname
                };
                $.getJSON('/api/search.php', payload, function(response) {
                    renderCb(response.nodes);
                });
            });
        
            // Handle clicking link to display search form
            $(document).on('click', '.clickme-to_search', function(e) {
                var navigationCrate = $(this).closest('.crate-navigation');
                navigationCrate.find('.children').hide();
                navigationCrate.find('.clickme-to_search').hide();
                navigationCrate.find('form.form-search').show();
            });
        
            // Handle search form cancel
            $(document).on('click', 'form.form-search .clickme-to_cancel', function(e) {
                var navigationCrate = $(this).closest('.crate-navigation');
                _this.clearSearch(navigationCrate);
            });

        } // init()

    }
}
