(function() {
    if (typeof tinymce !== 'undefined') {
        tinymce.PluginManager.add('mce_hbg_buttons', function(editor, url) {
        editor.addButton('mce_hbg_buttons', {
            text: 'Button',
            icon: '',
            context: 'insert',
            tooltip: 'Add button',
            cmd: 'mce_hbg_buttons'
        });

        editor.addCommand('mce_hbg_buttons', function() {
            editor.windowManager.open({
                title: 'Add button',
                url: mce_hbg_buttons.themeUrl + '/library/Admin/TinyMce/MceButtons/mce-buttons-template.php',
                width: 500,
                height: 420,
                buttons: [
                    {
                        text: 'Insert',
                        onclick: function(e) {
                            var $iframe = jQuery('.mce-container-body.mce-window-body.mce-abs-layout iframe').contents();
                            var btnClass = $iframe.find('#preview a').attr('class');
                            var btnText = $iframe.find('#btnText').val();
                            var btnLink = $iframe.find('#btnLink').val();
                            var button = '<a href="' + btnLink + '" class="' + btnClass + '">'+ btnText +'</a>';
                            editor.insertContent(button);
                            editor.windowManager.close();
                            return true;
                        }
                    }
                ]
            },
            {
                stylesSheet: mce_hbg_buttons.styleSheet
            }
            );
        });
    });
    }
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtY2UtYnV0dG9ucy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAodHlwZW9mIHRpbnltY2UgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGlueW1jZS5QbHVnaW5NYW5hZ2VyLmFkZCgnbWNlX2hiZ19idXR0b25zJywgZnVuY3Rpb24oZWRpdG9yLCB1cmwpIHtcclxuICAgICAgICBlZGl0b3IuYWRkQnV0dG9uKCdtY2VfaGJnX2J1dHRvbnMnLCB7XHJcbiAgICAgICAgICAgIHRleHQ6ICdCdXR0b24nLFxyXG4gICAgICAgICAgICBpY29uOiAnJyxcclxuICAgICAgICAgICAgY29udGV4dDogJ2luc2VydCcsXHJcbiAgICAgICAgICAgIHRvb2x0aXA6ICdBZGQgYnV0dG9uJyxcclxuICAgICAgICAgICAgY21kOiAnbWNlX2hiZ19idXR0b25zJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBlZGl0b3IuYWRkQ29tbWFuZCgnbWNlX2hiZ19idXR0b25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGVkaXRvci53aW5kb3dNYW5hZ2VyLm9wZW4oe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdBZGQgYnV0dG9uJyxcclxuICAgICAgICAgICAgICAgIHVybDogbWNlX2hiZ19idXR0b25zLnRoZW1lVXJsICsgJy9saWJyYXJ5L0FkbWluL1RpbnlNY2UvTWNlQnV0dG9ucy9tY2UtYnV0dG9ucy10ZW1wbGF0ZS5waHAnLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDUwMCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogNDIwLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ0luc2VydCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkaWZyYW1lID0galF1ZXJ5KCcubWNlLWNvbnRhaW5lci1ib2R5Lm1jZS13aW5kb3ctYm9keS5tY2UtYWJzLWxheW91dCBpZnJhbWUnKS5jb250ZW50cygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGJ0bkNsYXNzID0gJGlmcmFtZS5maW5kKCcjcHJldmlldyBhJykuYXR0cignY2xhc3MnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBidG5UZXh0ID0gJGlmcmFtZS5maW5kKCcjYnRuVGV4dCcpLnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGJ0bkxpbmsgPSAkaWZyYW1lLmZpbmQoJyNidG5MaW5rJykudmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYnV0dG9uID0gJzxhIGhyZWY9XCInICsgYnRuTGluayArICdcIiBjbGFzcz1cIicgKyBidG5DbGFzcyArICdcIj4nKyBidG5UZXh0ICsnPC9hPic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlZGl0b3IuaW5zZXJ0Q29udGVudChidXR0b24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdG9yLndpbmRvd01hbmFnZXIuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzdHlsZXNTaGVldDogbWNlX2hiZ19idXR0b25zLnN0eWxlU2hlZXRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICB9XHJcbn0pKCk7XHJcbiJdLCJmaWxlIjoibWNlLWJ1dHRvbnMuanMifQ==
