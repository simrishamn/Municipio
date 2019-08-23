(function() {
    tinymce.PluginManager.add('metadata', function(editor, url) {
        editor.addButton( 'metadata', {
            type: 'listbox',
            text: 'Metadata',
            icon: false,
            onselect: function(e) {
                editor.insertContent(this.value());
                this.value('');
            },
            values: metadata_button
        });
    });
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtY2UtbWV0YWRhdGEuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xyXG4gICAgdGlueW1jZS5QbHVnaW5NYW5hZ2VyLmFkZCgnbWV0YWRhdGEnLCBmdW5jdGlvbihlZGl0b3IsIHVybCkge1xyXG4gICAgICAgIGVkaXRvci5hZGRCdXR0b24oICdtZXRhZGF0YScsIHtcclxuICAgICAgICAgICAgdHlwZTogJ2xpc3Rib3gnLFxyXG4gICAgICAgICAgICB0ZXh0OiAnTWV0YWRhdGEnLFxyXG4gICAgICAgICAgICBpY29uOiBmYWxzZSxcclxuICAgICAgICAgICAgb25zZWxlY3Q6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGVkaXRvci5pbnNlcnRDb250ZW50KHRoaXMudmFsdWUoKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlKCcnKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdmFsdWVzOiBtZXRhZGF0YV9idXR0b25cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KSgpO1xyXG4iXSwiZmlsZSI6Im1jZS1tZXRhZGF0YS5qcyJ9
