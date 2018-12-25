function Rootinit() {

    return {

        init: function (renderCb) {

            var _this = this;

            $(document).on('submit', 'form.form-edit_root', function (e) {
                e.preventDefault();
                var thisForm = $(this);
                var subcrate = thisForm.closest('.subcrate-root');

                // First check the rootpath via api...
                $.ajax({
                    url: '/api/filetype.php',
                    type: 'POST',
                    dataType: 'json',
                    data    : thisForm.serialize(),
                    success: function (response) {
                        // Get nodes at new rootpath url...
                        (function () {
                            return $.getJSON('/api/index.php', { src: response.rootpath } );
                        })()
                        .then( function(response) {
                            subcrate.find('form').hide();
                            subcrate.find('.root-path').show();
                            renderCb(response.attrs.src, response.nodes);
                        });
                    }
                });
        
            });
        
            $(document).on('click', '.subcrate-root .root-path .clickme-to_edit', function(e) {
                var context = $(this);
                var subcrate = context.closest('.subcrate-root');
                subcrate.find('.root-path').hide();
                subcrate.find('form').show();
            });
        
            $(document).on('click', '.subcrate-root form.form-edit_root .clickme-to_cancel', function(e) {
                var context = $(this);
                var subcrate = context.closest('.subcrate-root');
                subcrate.find('form').hide();
                subcrate.find('.root-path').show();
            });


        } // init()

    }
}
