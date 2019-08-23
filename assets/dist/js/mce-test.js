(function() {
    if (typeof tinymce !== 'undefined') {
        tinymce.PluginManager.add('mce_hbg_buttons', function(editor, url) {
            editor.addButton('mce_hbg_buttons', {
                text: 'Button',
                icon: '',
                context: 'insert',
                tooltip: 'Add button',
                cmd: 'mce_hbg_buttons',
            });

            editor.addCommand('mce_hbg_buttons', function() {
                editor.windowManager.open(
                    {
                        title: 'Add button',
                        url:
                            mce_hbg_buttons.themeUrl +
                            '/library/Admin/TinyMce/MceButtons/mce-buttons-template.php',
                        width: 500,
                        height: 420,
                        buttons: [
                            {
                                text: 'Insert',
                                onclick: function(e) {
                                    var $iframe = jQuery(
                                        '.mce-container-body.mce-window-body.mce-abs-layout iframe'
                                    ).contents();
                                    var btnClass = $iframe.find('#preview a').attr('class');
                                    var btnText = $iframe.find('#btnText').val();
                                    var btnLink = $iframe.find('#btnLink').val();
                                    var button =
                                        '<a href="' +
                                        btnLink +
                                        '" class="' +
                                        btnClass +
                                        '">' +
                                        btnText +
                                        '</a>';
                                    editor.insertContent(button);
                                    editor.windowManager.close();
                                    return true;
                                },
                            },
                        ],
                    },
                    {
                        stylesSheet: mce_hbg_buttons.styleSheet,
                    }
                );
            });
        });
    }
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtY2UtdGVzdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAodHlwZW9mIHRpbnltY2UgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGlueW1jZS5QbHVnaW5NYW5hZ2VyLmFkZCgnbWNlX2hiZ19idXR0b25zJywgZnVuY3Rpb24oZWRpdG9yLCB1cmwpIHtcclxuICAgICAgICAgICAgZWRpdG9yLmFkZEJ1dHRvbignbWNlX2hiZ19idXR0b25zJywge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogJ0J1dHRvbicsXHJcbiAgICAgICAgICAgICAgICBpY29uOiAnJyxcclxuICAgICAgICAgICAgICAgIGNvbnRleHQ6ICdpbnNlcnQnLFxyXG4gICAgICAgICAgICAgICAgdG9vbHRpcDogJ0FkZCBidXR0b24nLFxyXG4gICAgICAgICAgICAgICAgY21kOiAnbWNlX2hiZ19idXR0b25zJyxcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBlZGl0b3IuYWRkQ29tbWFuZCgnbWNlX2hiZ19idXR0b25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3Iud2luZG93TWFuYWdlci5vcGVuKFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdBZGQgYnV0dG9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWNlX2hiZ19idXR0b25zLnRoZW1lVXJsICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcvbGlicmFyeS9BZG1pbi9UaW55TWNlL01jZUJ1dHRvbnMvbWNlLWJ1dHRvbnMtdGVtcGxhdGUucGhwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDUwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiA0MjAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnSW5zZXJ0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkaWZyYW1lID0galF1ZXJ5KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJy5tY2UtY29udGFpbmVyLWJvZHkubWNlLXdpbmRvdy1ib2R5Lm1jZS1hYnMtbGF5b3V0IGlmcmFtZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKS5jb250ZW50cygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYnRuQ2xhc3MgPSAkaWZyYW1lLmZpbmQoJyNwcmV2aWV3IGEnKS5hdHRyKCdjbGFzcycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYnRuVGV4dCA9ICRpZnJhbWUuZmluZCgnI2J0blRleHQnKS52YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGJ0bkxpbmsgPSAkaWZyYW1lLmZpbmQoJyNidG5MaW5rJykudmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBidXR0b24gPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxhIGhyZWY9XCInICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ0bkxpbmsgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1wiIGNsYXNzPVwiJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidG5DbGFzcyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnXCI+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidG5UZXh0ICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2E+JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdG9yLmluc2VydENvbnRlbnQoYnV0dG9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdG9yLndpbmRvd01hbmFnZXIuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlc1NoZWV0OiBtY2VfaGJnX2J1dHRvbnMuc3R5bGVTaGVldCxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSkoKTtcclxuIl0sImZpbGUiOiJtY2UtdGVzdC5qcyJ9
