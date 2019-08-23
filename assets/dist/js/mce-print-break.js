(function() {
    tinymce.PluginManager.add('print_break', function(editor, url) {
        editor.addButton('printbreak', {
            text: '',
            icon: 'wp_page',
            context: 'insert',
            tooltip: 'Print Break',
            onclick: function(e) {
                editor.execCommand('Print_Break');
            }
        });

        editor.addCommand('Print_Break', function() {
            var parent;
            var html;

            var tag = 'printbreak';
            var title = 'Print Break';
            var classname = 'wp-print-break-tag mce-wp-' + tag;
            var dom = editor.dom;
            var node = editor.selection.getNode();

            html = '<img src="' + tinymce.Env.transparentSrc + '" alt="" title="' + title + '" class="' + classname + '" ' +
                'data-mce-resize="false" data-mce-placeholder="1" data-wp-more="printbreak" />';

            // Most common case
            if (node.nodeName === 'BODY' || (node.nodeName === 'P' && node.parentNode.nodeName === 'BODY')) {
                editor.insertContent(html);
                return;
            }

            // Get the top level parent node
            parent = dom.getParent(node, function(found) {
                if (found.parentNode && found.parentNode.nodeName === 'BODY') {
                    return true;
                }

                return false;
            }, editor.getBody());

            if (parent) {
                if (parent.nodeName === 'P') {
                    parent.appendChild(dom.create('p', null, html).firstChild);
                } else {
                    dom.insertAfter( dom.create('p', null, html), parent);
                }

                editor.nodeChanged();
            }
        });

        editor.on( 'BeforeSetContent', function( event ) {
            var title;

            if ( event.content ) {
                if ( event.content.indexOf( '<!--printbreak-->' ) !== -1 ) {
                    title = 'Print Break';

                    event.content = event.content.replace( /<!--printbreak-->/g,
                        '<img src="' + tinymce.Env.transparentSrc + '" class="wp-print-break-tag mce-wp-printbreak" ' +
                            'alt="" title="' + title + '" data-wp-more="printbreak" data-mce-resize="false" data-mce-placeholder="1" />' );
                }
            }
        });

        editor.on( 'PostProcess', function( event ) {
            if ( event.get ) {
                event.content = event.content.replace(/<img[^>]+>/g, function( image ) {
                    var match,
                        string,
                        moretext = '';

                    if ( image.indexOf('data-wp-more="printbreak"') !== -1 ) {
                        string = '<!--printbreak-->';
                    }

                    return string || image;
                });
            }
        });
    });
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtY2UtcHJpbnQtYnJlYWsuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xyXG4gICAgdGlueW1jZS5QbHVnaW5NYW5hZ2VyLmFkZCgncHJpbnRfYnJlYWsnLCBmdW5jdGlvbihlZGl0b3IsIHVybCkge1xyXG4gICAgICAgIGVkaXRvci5hZGRCdXR0b24oJ3ByaW50YnJlYWsnLCB7XHJcbiAgICAgICAgICAgIHRleHQ6ICcnLFxyXG4gICAgICAgICAgICBpY29uOiAnd3BfcGFnZScsXHJcbiAgICAgICAgICAgIGNvbnRleHQ6ICdpbnNlcnQnLFxyXG4gICAgICAgICAgICB0b29sdGlwOiAnUHJpbnQgQnJlYWsnLFxyXG4gICAgICAgICAgICBvbmNsaWNrOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuZXhlY0NvbW1hbmQoJ1ByaW50X0JyZWFrJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZWRpdG9yLmFkZENvbW1hbmQoJ1ByaW50X0JyZWFrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJlbnQ7XHJcbiAgICAgICAgICAgIHZhciBodG1sO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRhZyA9ICdwcmludGJyZWFrJztcclxuICAgICAgICAgICAgdmFyIHRpdGxlID0gJ1ByaW50IEJyZWFrJztcclxuICAgICAgICAgICAgdmFyIGNsYXNzbmFtZSA9ICd3cC1wcmludC1icmVhay10YWcgbWNlLXdwLScgKyB0YWc7XHJcbiAgICAgICAgICAgIHZhciBkb20gPSBlZGl0b3IuZG9tO1xyXG4gICAgICAgICAgICB2YXIgbm9kZSA9IGVkaXRvci5zZWxlY3Rpb24uZ2V0Tm9kZSgpO1xyXG5cclxuICAgICAgICAgICAgaHRtbCA9ICc8aW1nIHNyYz1cIicgKyB0aW55bWNlLkVudi50cmFuc3BhcmVudFNyYyArICdcIiBhbHQ9XCJcIiB0aXRsZT1cIicgKyB0aXRsZSArICdcIiBjbGFzcz1cIicgKyBjbGFzc25hbWUgKyAnXCIgJyArXHJcbiAgICAgICAgICAgICAgICAnZGF0YS1tY2UtcmVzaXplPVwiZmFsc2VcIiBkYXRhLW1jZS1wbGFjZWhvbGRlcj1cIjFcIiBkYXRhLXdwLW1vcmU9XCJwcmludGJyZWFrXCIgLz4nO1xyXG5cclxuICAgICAgICAgICAgLy8gTW9zdCBjb21tb24gY2FzZVxyXG4gICAgICAgICAgICBpZiAobm9kZS5ub2RlTmFtZSA9PT0gJ0JPRFknIHx8IChub2RlLm5vZGVOYW1lID09PSAnUCcgJiYgbm9kZS5wYXJlbnROb2RlLm5vZGVOYW1lID09PSAnQk9EWScpKSB7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3IuaW5zZXJ0Q29udGVudChodG1sKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gR2V0IHRoZSB0b3AgbGV2ZWwgcGFyZW50IG5vZGVcclxuICAgICAgICAgICAgcGFyZW50ID0gZG9tLmdldFBhcmVudChub2RlLCBmdW5jdGlvbihmb3VuZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGZvdW5kLnBhcmVudE5vZGUgJiYgZm91bmQucGFyZW50Tm9kZS5ub2RlTmFtZSA9PT0gJ0JPRFknKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9LCBlZGl0b3IuZ2V0Qm9keSgpKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwYXJlbnQubm9kZU5hbWUgPT09ICdQJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChkb20uY3JlYXRlKCdwJywgbnVsbCwgaHRtbCkuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbS5pbnNlcnRBZnRlciggZG9tLmNyZWF0ZSgncCcsIG51bGwsIGh0bWwpLCBwYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGVkaXRvci5ub2RlQ2hhbmdlZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGVkaXRvci5vbiggJ0JlZm9yZVNldENvbnRlbnQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XHJcbiAgICAgICAgICAgIHZhciB0aXRsZTtcclxuXHJcbiAgICAgICAgICAgIGlmICggZXZlbnQuY29udGVudCApIHtcclxuICAgICAgICAgICAgICAgIGlmICggZXZlbnQuY29udGVudC5pbmRleE9mKCAnPCEtLXByaW50YnJlYWstLT4nICkgIT09IC0xICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlID0gJ1ByaW50IEJyZWFrJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuY29udGVudCA9IGV2ZW50LmNvbnRlbnQucmVwbGFjZSggLzwhLS1wcmludGJyZWFrLS0+L2csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICc8aW1nIHNyYz1cIicgKyB0aW55bWNlLkVudi50cmFuc3BhcmVudFNyYyArICdcIiBjbGFzcz1cIndwLXByaW50LWJyZWFrLXRhZyBtY2Utd3AtcHJpbnRicmVha1wiICcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FsdD1cIlwiIHRpdGxlPVwiJyArIHRpdGxlICsgJ1wiIGRhdGEtd3AtbW9yZT1cInByaW50YnJlYWtcIiBkYXRhLW1jZS1yZXNpemU9XCJmYWxzZVwiIGRhdGEtbWNlLXBsYWNlaG9sZGVyPVwiMVwiIC8+JyApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGVkaXRvci5vbiggJ1Bvc3RQcm9jZXNzJywgZnVuY3Rpb24oIGV2ZW50ICkge1xyXG4gICAgICAgICAgICBpZiAoIGV2ZW50LmdldCApIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LmNvbnRlbnQgPSBldmVudC5jb250ZW50LnJlcGxhY2UoLzxpbWdbXj5dKz4vZywgZnVuY3Rpb24oIGltYWdlICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXRjaCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb3JldGV4dCA9ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIGltYWdlLmluZGV4T2YoJ2RhdGEtd3AtbW9yZT1cInByaW50YnJlYWtcIicpICE9PSAtMSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nID0gJzwhLS1wcmludGJyZWFrLS0+JztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHJpbmcgfHwgaW1hZ2U7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pKCk7XHJcbiJdLCJmaWxlIjoibWNlLXByaW50LWJyZWFrLmpzIn0=
