(function() {
    tinymce.PluginManager.add('pricons', function(editor, url) {
        editor.addButton('pricons', {
            text: '',
            icon: 'pricon-smiley-cool',
            context: 'insert',
            tooltip: 'Pricon',
            cmd: 'openInsertPiconModal'
        });


        editor.addCommand('openInsertPiconModal', function() {
            editor.windowManager.open({
                title: 'Pricons',
                url: url + '/mce-picons.php',
                width: 500,
                height: 400,
                buttons: [
                    {
                        text: 'Insert',
                        onclick: function(e) {
                            var $iframe = jQuery('.mce-container-body.mce-window-body.mce-abs-layout iframe').contents();
                            var size = $iframe.find('[name="pricon-size"]').val();
                            var color = $iframe.find('[name="pricon-color"]').val();
                            var icon = $iframe.find('[name="pricon-icon"]').val();

                            if (!icon.length) {
                                editor.windowManager.close();
                                return false;
                            }

                            var shortcode = '[pricon icon="' + icon + '"';

                            if (color.length) {
                                shortcode = shortcode + ' color="' + color + '"';
                            }

                            if (size.length) {
                                shortcode = shortcode + ' size="' + size + '"';
                            }

                            shortcode = shortcode + ']';

                            editor.insertContent(shortcode);

                            editor.windowManager.close();
                            return true;
                        }
                    }
                ]
            });

        });
    });
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtY2UtcHJpY29ucy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XHJcbiAgICB0aW55bWNlLlBsdWdpbk1hbmFnZXIuYWRkKCdwcmljb25zJywgZnVuY3Rpb24oZWRpdG9yLCB1cmwpIHtcclxuICAgICAgICBlZGl0b3IuYWRkQnV0dG9uKCdwcmljb25zJywge1xyXG4gICAgICAgICAgICB0ZXh0OiAnJyxcclxuICAgICAgICAgICAgaWNvbjogJ3ByaWNvbi1zbWlsZXktY29vbCcsXHJcbiAgICAgICAgICAgIGNvbnRleHQ6ICdpbnNlcnQnLFxyXG4gICAgICAgICAgICB0b29sdGlwOiAnUHJpY29uJyxcclxuICAgICAgICAgICAgY21kOiAnb3Blbkluc2VydFBpY29uTW9kYWwnXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICBlZGl0b3IuYWRkQ29tbWFuZCgnb3Blbkluc2VydFBpY29uTW9kYWwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZWRpdG9yLndpbmRvd01hbmFnZXIub3Blbih7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1ByaWNvbnMnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiB1cmwgKyAnL21jZS1waWNvbnMucGhwJyxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiA1MDAsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDQwMCxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdJbnNlcnQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgJGlmcmFtZSA9IGpRdWVyeSgnLm1jZS1jb250YWluZXItYm9keS5tY2Utd2luZG93LWJvZHkubWNlLWFicy1sYXlvdXQgaWZyYW1lJykuY29udGVudHMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzaXplID0gJGlmcmFtZS5maW5kKCdbbmFtZT1cInByaWNvbi1zaXplXCJdJykudmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29sb3IgPSAkaWZyYW1lLmZpbmQoJ1tuYW1lPVwicHJpY29uLWNvbG9yXCJdJykudmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaWNvbiA9ICRpZnJhbWUuZmluZCgnW25hbWU9XCJwcmljb24taWNvblwiXScpLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaWNvbi5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlZGl0b3Iud2luZG93TWFuYWdlci5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2hvcnRjb2RlID0gJ1twcmljb24gaWNvbj1cIicgKyBpY29uICsgJ1wiJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29sb3IubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvcnRjb2RlID0gc2hvcnRjb2RlICsgJyBjb2xvcj1cIicgKyBjb2xvciArICdcIic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNpemUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvcnRjb2RlID0gc2hvcnRjb2RlICsgJyBzaXplPVwiJyArIHNpemUgKyAnXCInO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3J0Y29kZSA9IHNob3J0Y29kZSArICddJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlZGl0b3IuaW5zZXJ0Q29udGVudChzaG9ydGNvZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRvci53aW5kb3dNYW5hZ2VyLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pKCk7XHJcbiJdLCJmaWxlIjoibWNlLXByaWNvbnMuanMifQ==
