!function(){"undefined"!=typeof tinymce&&tinymce.PluginManager.add("mce_hbg_buttons",function(t,n){t.addButton("mce_hbg_buttons",{text:"Button",icon:"",context:"insert",tooltip:"Add button",cmd:"mce_hbg_buttons"}),t.addCommand("mce_hbg_buttons",function(){t.windowManager.open({title:"Add button",url:mce_hbg_buttons.themeUrl+"/library/Admin/TinyMce/MceButtons/mce-buttons-template.php",width:500,height:420,buttons:[{text:"Insert",onclick:function(n){var e=jQuery(".mce-container-body.mce-window-body.mce-abs-layout iframe").contents(),o=e.find("#preview a").attr("class"),a=e.find("#btnText").val(),i=e.find("#btnLink").val(),r='<a href="'+i+'" class="'+o+'">'+a+"</a>";return t.insertContent(r),t.windowManager.close(),!0}}]},{stylesSheet:mce_hbg_buttons.styleSheet})})})}(),function(){tinymce.PluginManager.add("metadata",function(t,n){t.addButton("metadata",{type:"listbox",text:"Metadata",icon:!1,onselect:function(n){t.insertContent(this.value()),this.value("")},values:metadata_button})})}(),function(){tinymce.PluginManager.add("pricons",function(t,n){t.addButton("pricons",{text:"",icon:"pricon-smiley-cool",context:"insert",tooltip:"Pricon",cmd:"openInsertPiconModal"}),t.addCommand("openInsertPiconModal",function(){t.windowManager.open({title:"Pricons",url:n+"/mce-picons.php",width:500,height:400,buttons:[{text:"Insert",onclick:function(n){var e=jQuery(".mce-container-body.mce-window-body.mce-abs-layout iframe").contents(),o=e.find('[name="pricon-size"]').val(),a=e.find('[name="pricon-color"]').val(),i=e.find('[name="pricon-icon"]').val();if(!i.length)return t.windowManager.close(),!1;var r='[pricon icon="'+i+'"';return a.length&&(r=r+' color="'+a+'"'),o.length&&(r=r+' size="'+o+'"'),r+="]",t.insertContent(r),t.windowManager.close(),!0}}]})})})}(),function(){tinymce.PluginManager.add("print_break",function(t,n){t.addButton("printbreak",{text:"",icon:"wp_page",context:"insert",tooltip:"Print Break",onclick:function(n){t.execCommand("Print_Break")}}),t.addCommand("Print_Break",function(){var n,e,o="printbreak",a="Print Break",i="wp-print-break-tag mce-wp-"+o,r=t.dom,c=t.selection.getNode();return e='<img src="'+tinymce.Env.transparentSrc+'" alt="" title="'+a+'" class="'+i+'" data-mce-resize="false" data-mce-placeholder="1" data-wp-more="printbreak" />',"BODY"===c.nodeName||"P"===c.nodeName&&"BODY"===c.parentNode.nodeName?void t.insertContent(e):(n=r.getParent(c,function(t){return!(!t.parentNode||"BODY"!==t.parentNode.nodeName)},t.getBody()),void(n&&("P"===n.nodeName?n.appendChild(r.create("p",null,e).firstChild):r.insertAfter(r.create("p",null,e),n),t.nodeChanged())))}),t.on("BeforeSetContent",function(t){var n;t.content&&t.content.indexOf("<!--printbreak-->")!==-1&&(n="Print Break",t.content=t.content.replace(/<!--printbreak-->/g,'<img src="'+tinymce.Env.transparentSrc+'" class="wp-print-break-tag mce-wp-printbreak" alt="" title="'+n+'" data-wp-more="printbreak" data-mce-resize="false" data-mce-placeholder="1" />'))}),t.on("PostProcess",function(t){t.get&&(t.content=t.content.replace(/<img[^>]+>/g,function(t){var n;return t.indexOf('data-wp-more="printbreak"')!==-1&&(n="<!--printbreak-->"),n||t}))})})}(),function(){"undefined"!=typeof tinymce&&tinymce.PluginManager.add("mce_hbg_buttons",function(t,n){t.addButton("mce_hbg_buttons",{text:"Button",icon:"",context:"insert",tooltip:"Add button",cmd:"mce_hbg_buttons"}),t.addCommand("mce_hbg_buttons",function(){t.windowManager.open({title:"Add button",url:mce_hbg_buttons.themeUrl+"/library/Admin/TinyMce/MceButtons/mce-buttons-template.php",width:500,height:420,buttons:[{text:"Insert",onclick:function(n){var e=jQuery(".mce-container-body.mce-window-body.mce-abs-layout iframe").contents(),o=e.find("#preview a").attr("class"),a=e.find("#btnText").val(),i=e.find("#btnLink").val(),r='<a href="'+i+'" class="'+o+'">'+a+"</a>";return t.insertContent(r),t.windowManager.close(),!0}}]},{stylesSheet:mce_hbg_buttons.styleSheet})})})}();