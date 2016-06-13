(function() {
    tinymce.PluginManager.add('targeted_content', function(editor, url) {
        editor.addButton('targeted_content', {
            text: '',
            icon: 'fa-users',
            onclick: function(e) {
                editor.windowManager.open({
                    title: 'Select groups',
                    url: url + '/mce-target-content.html',
                    width: 700,
                    height: 600
                }, {
                    editor: editor,
                    groups: mce_target_content_groups
                });
            },
            values: metadata_button
        });
    });
})();
