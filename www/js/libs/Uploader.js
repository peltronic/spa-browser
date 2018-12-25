"use strict";

function Uploader() {

    return {

        navigator: null,

        init: function (navigator, renderCb) {

            var _this = this;
            _this.navigator = navigator;

            $(document).on('submit', 'form.form-upload_file', function (e) {
                e.preventDefault();

                var thisForm = $(this);
                var formdata = new FormData(thisForm[0]);
                
                formdata.append("dst", _this.navigator.currentNode.pathname);
        
                //$("#clickme-to_submit").prop("disabled", true);
        
                $.ajax({
                    type: 'POST',
                    url: '/api/upload.php',
                    data: formdata,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        thisForm.hide().trigger('reset');
                        renderCb();
                        /*
                        _this.doUpdate(_this.navigator.currentNode);
                        $('.children').html( _this.buildChildList() );
                        */
                    }
                });
        
            });
        
            $(document).on('click', '.clickme-to_upload', function(e) {
                $('.subcrate-upload').find('form').show();
            });
        
            $(document).on('click', 'form.form-upload_file .clickme-to_cancel', function(e) {
                var thisForm = $(this).closest('form');
                thisForm.hide().trigger('reset');
            });

        } // init()

    }
}
