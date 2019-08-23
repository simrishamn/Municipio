jQuery(function () {
  /* Check if algolia is running */
  if(typeof algoliasearch !== "undefined") {

    /* init Algolia client */
    var client = algoliasearch(algolia.application_id, algolia.search_api_key);

    /* setup default sources */
    var sources = [];
    jQuery.each(algolia.autocomplete.sources, function (i, config) {
      var suggestion_template = wp.template(config.tmpl_suggestion);
      sources.push({
        source: algoliaAutocomplete.sources.hits(client.initIndex(config.index_name), {
          hitsPerPage: config.max_suggestions,
          attributesToSnippet: [
            'content:10'
          ],
          highlightPreTag: '__ais-highlight__',
          highlightPostTag: '__/ais-highlight__'
        }),
        templates: {
          header: function () {
            return wp.template('autocomplete-header')({
              label: _.escape(config.label)
            });
          },
          suggestion: function (hit) {
            for (var key in hit._highlightResult) {
              /* We do not deal with arrays. */
              if (typeof hit._highlightResult[key].value !== 'string') {
                continue;
              }
              hit._highlightResult[key].value = _.escape(hit._highlightResult[key].value);
              hit._highlightResult[key].value = hit._highlightResult[key].value.replace(/__ais-highlight__/g, '<em>').replace(/__\/ais-highlight__/g, '</em>');
            }

            for (var key in hit._snippetResult) {
              /* We do not deal with arrays. */
              if (typeof hit._snippetResult[key].value !== 'string') {
                continue;
              }

              hit._snippetResult[key].value = _.escape(hit._snippetResult[key].value);
              hit._snippetResult[key].value = hit._snippetResult[key].value.replace(/__ais-highlight__/g, '<em>').replace(/__\/ais-highlight__/g, '</em>');
            }

            return suggestion_template(hit);
          }
        }
      });

    });

    /* Setup dropdown menus */
    jQuery("input[name='s']").each(function (i) {
      var $searchInput = jQuery(this);

      var config = {
        debug: algolia.debug,
        hint: false,
        openOnFocus: true,
        appendTo: 'body',
        templates: {
          empty: wp.template('autocomplete-empty')
        }
      };

      if (algolia.powered_by_enabled) {
        config.templates.footer = wp.template('autocomplete-footer');
      }

      /* Instantiate autocomplete.js */
      var autocomplete = algoliaAutocomplete($searchInput[0], config, sources)
      .on('autocomplete:selected', function (e, suggestion) {
        /* Redirect the user when we detect a suggestion selection. */
        window.location.href = suggestion.permalink;
      });

      /* Force the dropdown to be re-drawn on scroll to handle fixed containers. */
      jQuery(window).scroll(function() {
        if(autocomplete.autocomplete.getWrapper().style.display === "block") {
          autocomplete.autocomplete.close();
          autocomplete.autocomplete.open();
        }
      });
    });

    jQuery(document).on("click", ".algolia-powered-by-link", function (e) {
      e.preventDefault();
      window.location = "https://www.algolia.com/?utm_source=WordPress&utm_medium=extension&utm_content=" + window.location.hostname + "&utm_campaign=poweredby";
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
    if(document.getElementById('algolia-search-box')) {

        /* Instantiate instantsearch.js */
        var search = instantsearch({
            appId: algolia.application_id,
            apiKey: algolia.search_api_key,
            indexName: algolia.indices.searchable_posts.name,
            urlSync: {
                mapping: {'q': 's'},
                trackedParameters: ['query']
            },
            searchParameters: {
                facetingAfterDistinct: true,
                highlightPreTag: '__ais-highlight__',
                highlightPostTag: '__/ais-highlight__'
            }
        });

        /* Search box widget */
        search.addWidget(
            instantsearch.widgets.searchBox({
                container: '#algolia-search-box',
                placeholder: 'Search for...',
                wrapInput: false,
                poweredBy: false,
                cssClasses: {
                    input: ['form-control', 'form-control-lg']
                }
            })
        );

        /* Stats widget */
        search.addWidget(
            instantsearch.widgets.stats({
                container: '#algolia-stats',
                autoHideContainer: false,
                templates: {
                    body: wp.template('instantsearch-status')
                }
            })
        );

        /* Hits widget */
        search.addWidget(
            instantsearch.widgets.hits({
                container: '#algolia-hits',
                hitsPerPage: 10,
                cssClasses: {
                    root: ['search-result-list'],
                    item: ['search-result-item']
                },
                templates: {
                    empty: wp.template('instantsearch-empty'),
                    item: wp.template('instantsearch-hit')
                },
                transformData: {
                    item: function (hit) {

                        /* Create content snippet */
                        hit.contentSnippet = hit.content.length > 300 ? hit.content.substring(0, 300 - 3) + '...' : hit.content;

                        /* Create hightlight results */
                        for(var key in hit._highlightResult) {
                          if(typeof hit._highlightResult[key].value !== 'string') {
                            continue;
                          }
                          hit._highlightResult[key].value = _.escape(hit._highlightResult[key].value);
                          hit._highlightResult[key].value = hit._highlightResult[key].value.replace(/__ais-highlight__/g, '<em>').replace(/__\/ais-highlight__/g, '</em>');
                        }

                        return hit;
                    }
                }
            })
        );

        /* Pagination widget */
        search.addWidget(
            instantsearch.widgets.pagination({
                container: '#algolia-pagination',
                cssClasses: {
                    root: ['pagination'],
                    item: ['page'],
                    disabled: ['hidden']
                }
            })
        );

        /* Start */
        search.start();
    }
});

var Muncipio = {};

var Muncipio = Muncipio || {};
Muncipio.Post = Muncipio.Post || {};

Muncipio.Post.Comments = (function($) {
    function Comments() {
        $(
            function() {
                this.handleEvents();
            }.bind(this)
        );
    }

    /**
     * Handle events
     * @return {void}
     */
    Comments.prototype.handleEvents = function() {
        $(document).on(
            'click',
            '#edit-comment',
            function(e) {
                e.preventDefault();
                this.displayEditForm(e);
            }.bind(this)
        );

        $(document).on(
            'submit',
            '#commentupdate',
            function(e) {
                e.preventDefault();
                this.udpateComment(e);
            }.bind(this)
        );

        $(document).on(
            'click',
            '#delete-comment',
            function(e) {
                e.preventDefault();
                if (window.confirm(MunicipioLang.messages.deleteComment)) {
                    this.deleteComment(e);
                }
            }.bind(this)
        );

        $(document).on(
            'click',
            '.cancel-update-comment',
            function(e) {
                e.preventDefault();
                this.cleanUp();
            }.bind(this)
        );

        $(document).on(
            'click',
            '.comment-reply-link',
            function(e) {
                this.cleanUp();
            }.bind(this)
        );
    };

    Comments.prototype.udpateComment = function(event) {
        var $target = $(event.target)
                .closest('.comment-body')
                .find('.comment-content'),
            data = new FormData(event.target),
            oldComment = $target.html();
        data.append('action', 'update_comment');

        $.ajax({
            url: ajaxurl,
            type: 'post',
            context: this,
            processData: false,
            contentType: false,
            data: data,
            dataType: 'json',
            beforeSend: function() {
                // Do expected behavior
                $target.html(data.get('comment'));
                this.cleanUp();
            },
            success: function(response) {
                if (!response.success) {
                    // Undo front end update
                    $target.html(oldComment);
                    this.showError($target);
                }
            },
            error: function(jqXHR, textStatus) {
                $target.html(oldComment);
                this.showError($target);
            },
        });
    };

    Comments.prototype.displayEditForm = function(event) {
        var commentId = $(event.currentTarget).data('comment-id'),
            postId = $(event.currentTarget).data('post-id'),
            $target = $(
                '.comment-body',
                '#answer-' + commentId + ', #comment-' + commentId
            ).first();

        this.cleanUp();
        $('.comment-content, .comment-footer', $target).hide();
        $target.append(
            '<div class="loading gutter gutter-top gutter-margin"><div></div><div></div><div></div><div></div></div>'
        );

        $.when(this.getCommentForm(commentId, postId)).then(function(response) {
            if (response.success) {
                $target.append(response.data);
                $('.loading', $target).remove();

                // Re init tinyMce if its used
                if ($('.tinymce-editor').length) {
                    tinymce.EditorManager.execCommand('mceRemoveEditor', true, 'comment-edit');
                    tinymce.EditorManager.execCommand('mceAddEditor', true, 'comment-edit');
                }
            } else {
                this.cleanUp();
                this.showError($target);
            }
        });
    };

    Comments.prototype.getCommentForm = function(commentId, postId) {
        return $.ajax({
            url: ajaxurl,
            type: 'post',
            dataType: 'json',
            context: this,
            data: {
                action: 'get_comment_form',
                commentId: commentId,
                postId: postId,
            },
        });
    };

    Comments.prototype.deleteComment = function(event) {
        var $target = $(event.currentTarget),
            commentId = $target.data('comment-id'),
            nonce = $target.data('comment-nonce');

        $.ajax({
            url: ajaxurl,
            type: 'post',
            context: this,
            dataType: 'json',
            data: {
                action: 'remove_comment',
                id: commentId,
                nonce: nonce,
            },
            beforeSend: function(response) {
                // Do expected behavior
                $target.closest('li.answer, li.comment').fadeOut('fast');
            },
            success: function(response) {
                if (!response.success) {
                    // Undo front end deletion
                    this.showError($target);
                }
            },
            error: function(jqXHR, textStatus) {
                this.showError($target);
            },
        });
    };

    Comments.prototype.cleanUp = function(event) {
        $('.comment-update').remove();
        $('.loading', '.comment-body').remove();
        $('.dropdown-menu').hide();
        $('.comment-content, .comment-footer').fadeIn('fast');
    };

    Comments.prototype.showError = function(target) {
        target
            .closest('li.answer, li.comment')
            .fadeIn('fast')
            .find('.comment-body:first')
            .append('<small class="text-danger">' + MunicipioLang.messages.onError + '</small>')
            .find('.text-danger')
            .delay(4000)
            .fadeOut('fast');
    };

    return new Comments();
})(jQuery);

(function(){function aa(a,b,c){return a.call.apply(a.bind,arguments)}function ba(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function p(a,b,c){p=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?aa:ba;return p.apply(null,arguments)}var q=Date.now||function(){return+new Date};function ca(a,b){this.a=a;this.m=b||a;this.c=this.m.document}var da=!!window.FontFace;function t(a,b,c,d){b=a.c.createElement(b);if(c)for(var e in c)c.hasOwnProperty(e)&&("style"==e?b.style.cssText=c[e]:b.setAttribute(e,c[e]));d&&b.appendChild(a.c.createTextNode(d));return b}function u(a,b,c){a=a.c.getElementsByTagName(b)[0];a||(a=document.documentElement);a.insertBefore(c,a.lastChild)}function v(a){a.parentNode&&a.parentNode.removeChild(a)}
function w(a,b,c){b=b||[];c=c||[];for(var d=a.className.split(/\s+/),e=0;e<b.length;e+=1){for(var f=!1,g=0;g<d.length;g+=1)if(b[e]===d[g]){f=!0;break}f||d.push(b[e])}b=[];for(e=0;e<d.length;e+=1){f=!1;for(g=0;g<c.length;g+=1)if(d[e]===c[g]){f=!0;break}f||b.push(d[e])}a.className=b.join(" ").replace(/\s+/g," ").replace(/^\s+|\s+$/,"")}function y(a,b){for(var c=a.className.split(/\s+/),d=0,e=c.length;d<e;d++)if(c[d]==b)return!0;return!1}
function z(a){if("string"===typeof a.f)return a.f;var b=a.m.location.protocol;"about:"==b&&(b=a.a.location.protocol);return"https:"==b?"https:":"http:"}function ea(a){return a.m.location.hostname||a.a.location.hostname}
function A(a,b,c){function d(){k&&e&&f&&(k(g),k=null)}b=t(a,"link",{rel:"stylesheet",href:b,media:"all"});var e=!1,f=!0,g=null,k=c||null;da?(b.onload=function(){e=!0;d()},b.onerror=function(){e=!0;g=Error("Stylesheet failed to load");d()}):setTimeout(function(){e=!0;d()},0);u(a,"head",b)}
function B(a,b,c,d){var e=a.c.getElementsByTagName("head")[0];if(e){var f=t(a,"script",{src:b}),g=!1;f.onload=f.onreadystatechange=function(){g||this.readyState&&"loaded"!=this.readyState&&"complete"!=this.readyState||(g=!0,c&&c(null),f.onload=f.onreadystatechange=null,"HEAD"==f.parentNode.tagName&&e.removeChild(f))};e.appendChild(f);setTimeout(function(){g||(g=!0,c&&c(Error("Script load timeout")))},d||5E3);return f}return null};function C(){this.a=0;this.c=null}function D(a){a.a++;return function(){a.a--;E(a)}}function F(a,b){a.c=b;E(a)}function E(a){0==a.a&&a.c&&(a.c(),a.c=null)};function G(a){this.a=a||"-"}G.prototype.c=function(a){for(var b=[],c=0;c<arguments.length;c++)b.push(arguments[c].replace(/[\W_]+/g,"").toLowerCase());return b.join(this.a)};function H(a,b){this.c=a;this.f=4;this.a="n";var c=(b||"n4").match(/^([nio])([1-9])$/i);c&&(this.a=c[1],this.f=parseInt(c[2],10))}function fa(a){return I(a)+" "+(a.f+"00")+" 300px "+J(a.c)}function J(a){var b=[];a=a.split(/,\s*/);for(var c=0;c<a.length;c++){var d=a[c].replace(/['"]/g,"");-1!=d.indexOf(" ")||/^\d/.test(d)?b.push("'"+d+"'"):b.push(d)}return b.join(",")}function K(a){return a.a+a.f}function I(a){var b="normal";"o"===a.a?b="oblique":"i"===a.a&&(b="italic");return b}
function ga(a){var b=4,c="n",d=null;a&&((d=a.match(/(normal|oblique|italic)/i))&&d[1]&&(c=d[1].substr(0,1).toLowerCase()),(d=a.match(/([1-9]00|normal|bold)/i))&&d[1]&&(/bold/i.test(d[1])?b=7:/[1-9]00/.test(d[1])&&(b=parseInt(d[1].substr(0,1),10))));return c+b};function ha(a,b){this.c=a;this.f=a.m.document.documentElement;this.h=b;this.a=new G("-");this.j=!1!==b.events;this.g=!1!==b.classes}function ia(a){a.g&&w(a.f,[a.a.c("wf","loading")]);L(a,"loading")}function M(a){if(a.g){var b=y(a.f,a.a.c("wf","active")),c=[],d=[a.a.c("wf","loading")];b||c.push(a.a.c("wf","inactive"));w(a.f,c,d)}L(a,"inactive")}function L(a,b,c){if(a.j&&a.h[b])if(c)a.h[b](c.c,K(c));else a.h[b]()};function ja(){this.c={}}function ka(a,b,c){var d=[],e;for(e in b)if(b.hasOwnProperty(e)){var f=a.c[e];f&&d.push(f(b[e],c))}return d};function N(a,b){this.c=a;this.f=b;this.a=t(this.c,"span",{"aria-hidden":"true"},this.f)}function O(a){u(a.c,"body",a.a)}function P(a){return"display:block;position:absolute;top:-9999px;left:-9999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:"+J(a.c)+";"+("font-style:"+I(a)+";font-weight:"+(a.f+"00")+";")};function Q(a,b,c,d,e,f){this.g=a;this.j=b;this.a=d;this.c=c;this.f=e||3E3;this.h=f||void 0}Q.prototype.start=function(){var a=this.c.m.document,b=this,c=q(),d=new Promise(function(d,e){function k(){q()-c>=b.f?e():a.fonts.load(fa(b.a),b.h).then(function(a){1<=a.length?d():setTimeout(k,25)},function(){e()})}k()}),e=new Promise(function(a,d){setTimeout(d,b.f)});Promise.race([e,d]).then(function(){b.g(b.a)},function(){b.j(b.a)})};function R(a,b,c,d,e,f,g){this.v=a;this.B=b;this.c=c;this.a=d;this.s=g||"BESbswy";this.f={};this.w=e||3E3;this.u=f||null;this.o=this.j=this.h=this.g=null;this.g=new N(this.c,this.s);this.h=new N(this.c,this.s);this.j=new N(this.c,this.s);this.o=new N(this.c,this.s);a=new H(this.a.c+",serif",K(this.a));a=P(a);this.g.a.style.cssText=a;a=new H(this.a.c+",sans-serif",K(this.a));a=P(a);this.h.a.style.cssText=a;a=new H("serif",K(this.a));a=P(a);this.j.a.style.cssText=a;a=new H("sans-serif",K(this.a));a=
P(a);this.o.a.style.cssText=a;O(this.g);O(this.h);O(this.j);O(this.o)}var S={D:"serif",C:"sans-serif"},T=null;function U(){if(null===T){var a=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent);T=!!a&&(536>parseInt(a[1],10)||536===parseInt(a[1],10)&&11>=parseInt(a[2],10))}return T}R.prototype.start=function(){this.f.serif=this.j.a.offsetWidth;this.f["sans-serif"]=this.o.a.offsetWidth;this.A=q();la(this)};
function ma(a,b,c){for(var d in S)if(S.hasOwnProperty(d)&&b===a.f[S[d]]&&c===a.f[S[d]])return!0;return!1}function la(a){var b=a.g.a.offsetWidth,c=a.h.a.offsetWidth,d;(d=b===a.f.serif&&c===a.f["sans-serif"])||(d=U()&&ma(a,b,c));d?q()-a.A>=a.w?U()&&ma(a,b,c)&&(null===a.u||a.u.hasOwnProperty(a.a.c))?V(a,a.v):V(a,a.B):na(a):V(a,a.v)}function na(a){setTimeout(p(function(){la(this)},a),50)}function V(a,b){setTimeout(p(function(){v(this.g.a);v(this.h.a);v(this.j.a);v(this.o.a);b(this.a)},a),0)};function W(a,b,c){this.c=a;this.a=b;this.f=0;this.o=this.j=!1;this.s=c}var X=null;W.prototype.g=function(a){var b=this.a;b.g&&w(b.f,[b.a.c("wf",a.c,K(a).toString(),"active")],[b.a.c("wf",a.c,K(a).toString(),"loading"),b.a.c("wf",a.c,K(a).toString(),"inactive")]);L(b,"fontactive",a);this.o=!0;oa(this)};
W.prototype.h=function(a){var b=this.a;if(b.g){var c=y(b.f,b.a.c("wf",a.c,K(a).toString(),"active")),d=[],e=[b.a.c("wf",a.c,K(a).toString(),"loading")];c||d.push(b.a.c("wf",a.c,K(a).toString(),"inactive"));w(b.f,d,e)}L(b,"fontinactive",a);oa(this)};function oa(a){0==--a.f&&a.j&&(a.o?(a=a.a,a.g&&w(a.f,[a.a.c("wf","active")],[a.a.c("wf","loading"),a.a.c("wf","inactive")]),L(a,"active")):M(a.a))};function pa(a){this.j=a;this.a=new ja;this.h=0;this.f=this.g=!0}pa.prototype.load=function(a){this.c=new ca(this.j,a.context||this.j);this.g=!1!==a.events;this.f=!1!==a.classes;qa(this,new ha(this.c,a),a)};
function ra(a,b,c,d,e){var f=0==--a.h;(a.f||a.g)&&setTimeout(function(){var a=e||null,k=d||null||{};if(0===c.length&&f)M(b.a);else{b.f+=c.length;f&&(b.j=f);var h,m=[];for(h=0;h<c.length;h++){var l=c[h],n=k[l.c],r=b.a,x=l;r.g&&w(r.f,[r.a.c("wf",x.c,K(x).toString(),"loading")]);L(r,"fontloading",x);r=null;null===X&&(X=window.FontFace?(x=/Gecko.*Firefox\/(\d+)/.exec(window.navigator.userAgent))?42<parseInt(x[1],10):!0:!1);X?r=new Q(p(b.g,b),p(b.h,b),b.c,l,b.s,n):r=new R(p(b.g,b),p(b.h,b),b.c,l,b.s,a,
n);m.push(r)}for(h=0;h<m.length;h++)m[h].start()}},0)}function qa(a,b,c){var d=[],e=c.timeout;ia(b);var d=ka(a.a,c,a.c),f=new W(a.c,b,e);a.h=d.length;b=0;for(c=d.length;b<c;b++)d[b].load(function(b,d,c){ra(a,f,b,d,c)})};function sa(a,b){this.c=a;this.a=b}function ta(a,b,c){var d=z(a.c);a=(a.a.api||"fast.fonts.net/jsapi").replace(/^.*http(s?):(\/\/)?/,"");return d+"//"+a+"/"+b+".js"+(c?"?v="+c:"")}
sa.prototype.load=function(a){function b(){if(f["__mti_fntLst"+d]){var c=f["__mti_fntLst"+d](),e=[],h;if(c)for(var m=0;m<c.length;m++){var l=c[m].fontfamily;void 0!=c[m].fontStyle&&void 0!=c[m].fontWeight?(h=c[m].fontStyle+c[m].fontWeight,e.push(new H(l,h))):e.push(new H(l))}a(e)}else setTimeout(function(){b()},50)}var c=this,d=c.a.projectId,e=c.a.version;if(d){var f=c.c.m;B(this.c,ta(c,d,e),function(e){e?a([]):(f["__MonotypeConfiguration__"+d]=function(){return c.a},b())}).id="__MonotypeAPIScript__"+
d}else a([])};function ua(a,b){this.c=a;this.a=b}ua.prototype.load=function(a){var b,c,d=this.a.urls||[],e=this.a.families||[],f=this.a.testStrings||{},g=new C;b=0;for(c=d.length;b<c;b++)A(this.c,d[b],D(g));var k=[];b=0;for(c=e.length;b<c;b++)if(d=e[b].split(":"),d[1])for(var h=d[1].split(","),m=0;m<h.length;m+=1)k.push(new H(d[0],h[m]));else k.push(new H(d[0]));F(g,function(){a(k,f)})};function va(a,b,c){a?this.c=a:this.c=b+wa;this.a=[];this.f=[];this.g=c||""}var wa="//fonts.googleapis.com/css";function xa(a,b){for(var c=b.length,d=0;d<c;d++){var e=b[d].split(":");3==e.length&&a.f.push(e.pop());var f="";2==e.length&&""!=e[1]&&(f=":");a.a.push(e.join(f))}}
function ya(a){if(0==a.a.length)throw Error("No fonts to load!");if(-1!=a.c.indexOf("kit="))return a.c;for(var b=a.a.length,c=[],d=0;d<b;d++)c.push(a.a[d].replace(/ /g,"+"));b=a.c+"?family="+c.join("%7C");0<a.f.length&&(b+="&subset="+a.f.join(","));0<a.g.length&&(b+="&text="+encodeURIComponent(a.g));return b};function za(a){this.f=a;this.a=[];this.c={}}
var Aa={latin:"BESbswy","latin-ext":"\u00e7\u00f6\u00fc\u011f\u015f",cyrillic:"\u0439\u044f\u0416",greek:"\u03b1\u03b2\u03a3",khmer:"\u1780\u1781\u1782",Hanuman:"\u1780\u1781\u1782"},Ba={thin:"1",extralight:"2","extra-light":"2",ultralight:"2","ultra-light":"2",light:"3",regular:"4",book:"4",medium:"5","semi-bold":"6",semibold:"6","demi-bold":"6",demibold:"6",bold:"7","extra-bold":"8",extrabold:"8","ultra-bold":"8",ultrabold:"8",black:"9",heavy:"9",l:"3",r:"4",b:"7"},Ca={i:"i",italic:"i",n:"n",normal:"n"},
Da=/^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$/;
function Ea(a){for(var b=a.f.length,c=0;c<b;c++){var d=a.f[c].split(":"),e=d[0].replace(/\+/g," "),f=["n4"];if(2<=d.length){var g;var k=d[1];g=[];if(k)for(var k=k.split(","),h=k.length,m=0;m<h;m++){var l;l=k[m];if(l.match(/^[\w-]+$/)){var n=Da.exec(l.toLowerCase());if(null==n)l="";else{l=n[2];l=null==l||""==l?"n":Ca[l];n=n[1];if(null==n||""==n)n="4";else var r=Ba[n],n=r?r:isNaN(n)?"4":n.substr(0,1);l=[l,n].join("")}}else l="";l&&g.push(l)}0<g.length&&(f=g);3==d.length&&(d=d[2],g=[],d=d?d.split(","):
g,0<d.length&&(d=Aa[d[0]])&&(a.c[e]=d))}a.c[e]||(d=Aa[e])&&(a.c[e]=d);for(d=0;d<f.length;d+=1)a.a.push(new H(e,f[d]))}};function Fa(a,b){this.c=a;this.a=b}var Ga={Arimo:!0,Cousine:!0,Tinos:!0};Fa.prototype.load=function(a){var b=new C,c=this.c,d=new va(this.a.api,z(c),this.a.text),e=this.a.families;xa(d,e);var f=new za(e);Ea(f);A(c,ya(d),D(b));F(b,function(){a(f.a,f.c,Ga)})};function Ha(a,b){this.c=a;this.a=b}Ha.prototype.load=function(a){var b=this.a.id,c=this.c.m;b?B(this.c,(this.a.api||"https://use.typekit.net")+"/"+b+".js",function(b){if(b)a([]);else if(c.Typekit&&c.Typekit.config&&c.Typekit.config.fn){b=c.Typekit.config.fn;for(var e=[],f=0;f<b.length;f+=2)for(var g=b[f],k=b[f+1],h=0;h<k.length;h++)e.push(new H(g,k[h]));try{c.Typekit.load({events:!1,classes:!1,async:!0})}catch(m){}a(e)}},2E3):a([])};function Ia(a,b){this.c=a;this.f=b;this.a=[]}Ia.prototype.load=function(a){var b=this.f.id,c=this.c.m,d=this;b?(c.__webfontfontdeckmodule__||(c.__webfontfontdeckmodule__={}),c.__webfontfontdeckmodule__[b]=function(b,c){for(var g=0,k=c.fonts.length;g<k;++g){var h=c.fonts[g];d.a.push(new H(h.name,ga("font-weight:"+h.weight+";font-style:"+h.style)))}a(d.a)},B(this.c,z(this.c)+(this.f.api||"//f.fontdeck.com/s/css/js/")+ea(this.c)+"/"+b+".js",function(b){b&&a([])})):a([])};var Y=new pa(window);Y.a.c.custom=function(a,b){return new ua(b,a)};Y.a.c.fontdeck=function(a,b){return new Ia(b,a)};Y.a.c.monotype=function(a,b){return new sa(b,a)};Y.a.c.typekit=function(a,b){return new Ha(b,a)};Y.a.c.google=function(a,b){return new Fa(b,a)};var Z={load:p(Y.load,Y)};"function"===typeof define&&define.amd?define(function(){return Z}):"undefined"!==typeof module&&module.exports?module.exports=Z:(window.WebFont=Z,window.WebFontConfig&&Y.load(window.WebFontConfig));}());

import 'babel-polyfill';

let googleTranslateLoaded = false;
let resetQuery = false;
/**
 * Translate class
 * @type {Translate}
 */
const Translate = class {
    /**
     * Constructor
     */
    constructor() {
        const self = this;

        document.addEventListener(
            'click',
            function(event) {
                if (!event.target.matches('.translate-icon-btn')) {
                    return;
                }

                if (self.shouldLoadScript()) {
                    self.fetchScript();
                }
            },
            false
        );

        document.addEventListener(
            'change',
            function(event) {
                if (event.target.matches('select.goog-te-combo')) {
                    const searchParams = new URLSearchParams(window.location.search);
                    searchParams.set('translate', event.target.value);
                    const newRelativePathQuery =
                        window.location.pathname + '?' + searchParams.toString();
                    history.pushState(null, '', newRelativePathQuery);
                    self.rewriteLinks();

                    if (event.target.value === 'sv') {
                        const url = window.location.href;
                        const afterDomain = url.substring(url.lastIndexOf('/') + 1);
                        const beforeQueryString = afterDomain.split('?')[0];
                        window.history.pushState(
                            'object or string',
                            'Title',
                            '/' + beforeQueryString
                        );

                        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                        resetQuery = true;
                        self.rewriteLinks();
                    }
                }
            },
            false
        );

        if (this.shouldLoadScript()) {
            this.fetchScript();
        }
    }

    /**
     * Check if script is loaded
     * @returns {boolean}
     */
    shouldLoadScript() {
        if (googleTranslateLoaded === true) {
            return false;
        }

        if (
            document.location.href.indexOf('translate=') > -1 ||
            window.location.hash + 'translate'
        ) {
            return true;
        }

        return false;
    }

    /**
     * Fetching script from Google
     */
    fetchScript() {
        const loadScript = (source, beforeElement, async = true, defer = true) => {
            return new Promise((resolve, reject) => {
                let script = document.createElement('script');
                const prior = beforeElement || document.getElementsByTagName('script')[0];

                script.async = async;
                script.defer = defer;

                function onloadHander(_, isAbort) {
                    if (
                        isAbort ||
                        !script.readyState ||
                        /loaded|complete/.test(script.readyState)
                    ) {
                        script.onload = null;
                        script.onreadystatechange = null;
                        script = undefined;

                        if (isAbort) {
                            reject();
                        } else {
                            resolve();
                        }
                    }
                }

                script.onload = onloadHander;
                script.onreadystatechange = onloadHander;

                script.src = source;
                prior.parentNode.insertBefore(script, prior);
            });
        };

        const scriptUrl =
            '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';

        loadScript(scriptUrl).then(
            () => {
                this.rewriteLinks();
                googleTranslateLoaded = true;
            },
            () => {
                console.log('Failed to load Translate script from Google!');
                return false;
            }
        );
    }

    /**
     *  Rewriting all links
     */
    rewriteLinks() {
        const self = this;
        const searchParams = new URLSearchParams(document.location.search);
        const changeLang = searchParams.get('translate');

        if (changeLang !== 'null' && changeLang !== '' && changeLang !== null) {
            [].forEach.call(document.querySelectorAll('a'), function(element) {
                let hrefUrl = element.getAttribute('href');

                if (
                    hrefUrl == null ||
                    hrefUrl.indexOf(location.origin) === -1 ||
                    hrefUrl.substr(0, 1) === '#'
                ) {
                    return;
                }

                if (changeLang !== 'true' && resetQuery !== true) {
                    hrefUrl = self.parseLinkData(hrefUrl, 'translate', changeLang);
                    element.setAttribute('href', hrefUrl);
                }

                if (resetQuery) {
                    element.setAttribute(
                        'href',
                        element
                            .getAttribute('href')
                            .replace(/([&\?]key=val*$|key=val&|[?&]key=val(?=#))/, '')
                    );
                }
            });
        }
    }

    /**
     * Parsing link with keys and values
     * @param uri
     * @param key
     * @param value
     * @returns {string|*}
     */
    parseLinkData(uri, key, value) {
        const re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
        const separator = uri.indexOf('?') !== -1 ? '&' : '?';

        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + '=' + value + '$2');
        }

        return uri + separator + key + '=' + value;
    }

    /**
     *  Get google cookie
     * @param cname
     * @returns {string}
     */
    getCookie(cname) {
        const name = cname + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];

            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }

    /**
     * Check if translation is on load
     */
    checkLanguageOnLoad() {
        const self = this;
        document.addEventListener('DOMContentLoaded', function() {
            const searchParams = new URLSearchParams(document.location.search);
            const changeLang = searchParams.get('translate');

            let ckDomain;
            for (ckDomain = window.location.hostname.split('.'); 2 < ckDomain.length; ) {
                ckDomain.shift();
            }

            ckDomain = ';domain=' + ckDomain.join('.');

            if (changeLang !== 'sv') {
                document.cookie =
                    'googtrans=/' +
                    changeLang +
                    '/' +
                    changeLang +
                    '; expires=Thu, 07-Mar-2047 20:22:40 GMT; path=/' +
                    ckDomain;
                document.cookie =
                    'googtrans=/' +
                    changeLang +
                    '/' +
                    changeLang +
                    '; expires=Thu, 07-Mar-2047 20:22:40 GMT; path=/';
            } else {
                document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                resetQuery = true;
                self.rewriteLinks();
            }
        });
    }
};

const GetTranslate = new Translate();
GetTranslate.checkLanguageOnLoad();

var Municipio = Municipio || {};
Municipio.Helper = Municipio.Helper || {};

Municipio.Helper.MainContainer = (function($) {
    function MainContainer() {
        this.removeMainContainer();
    }

    MainContainer.prototype.removeMainContainer = function() {
        if ($.trim($('#main-content').html()) == '') {
            $('#main-content').remove();
            return true;
        }
        return false;
    };

    return new MainContainer();
})(jQuery);

var Muncipio = Muncipio || {};
Muncipio.Ajax = Muncipio.Ajax || {};

Muncipio.Ajax.LikeButton = (function($) {
    function Like() {
        this.init();
    }

    Like.prototype.init = function() {
        $('a.like-button').on(
            'click',
            function(e) {
                this.ajaxCall(e.target);
                return false;
            }.bind(this)
        );
    };

    Like.prototype.ajaxCall = function(likeButton) {
        var comment_id = $(likeButton).data('comment-id');
        var counter = $('span#like-count', likeButton);
        var button = $(likeButton);

        $.ajax({
            url: likeButtonData.ajax_url,
            type: 'post',
            data: {
                action: 'ajaxLikeMethod',
                comment_id: comment_id,
                nonce: likeButtonData.nonce,
            },
            beforeSend: function() {
                var likes = counter.html();

                if (button.hasClass('active')) {
                    likes--;
                    button.toggleClass('active');
                } else {
                    likes++;
                    button.toggleClass('active');
                }

                counter.html(likes);
            },
            success: function(response) {},
        });
    };

    return new Like();
})($);

var Muncipio = Muncipio || {};
Muncipio.Ajax = Muncipio.Ajax || {};

Muncipio.Ajax.ShareEmail = (function($) {
    function ShareEmail() {
        $(
            function() {
                this.handleEvents();
            }.bind(this)
        );
    }

    /**
     * Handle events
     * @return {void}
     */
    ShareEmail.prototype.handleEvents = function() {
        $(document).on(
            'submit',
            '.social-share-email',
            function(e) {
                e.preventDefault();
                this.share(e);
            }.bind(this)
        );
    };

    ShareEmail.prototype.share = function(event) {
        var $target = $(event.target),
            data = new FormData(event.target);
        data.append('action', 'share_email');

        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: data,
            dataType: 'json',
            processData: false,
            contentType: false,
            beforeSend: function() {
                $target
                    .find('.modal-footer')
                    .prepend(
                        '<div class="loading"><div></div><div></div><div></div><div></div></div>'
                    );
                $target.find('.notice').hide();
            },
            success: function(response, textStatus, jqXHR) {
                if (response.success) {
                    $('.modal-footer', $target).prepend(
                        '<span class="notice success gutter gutter-margin gutter-vertical"><i class="pricon pricon-check"></i> ' +
                            response.data +
                            '</span>'
                    );

                    setTimeout(function() {
                        location.hash = '';
                        $target.find('.notice').hide();
                    }, 3000);
                } else {
                    $('.modal-footer', $target).prepend(
                        '<span class="notice warning gutter gutter-margin gutter-vertical"><i class="pricon pricon-notice-warning"></i> ' +
                            response.data +
                            '</span>'
                    );
                }
            },
            complete: function() {
                $target.find('.loading').hide();
            },
        });

        return false;
    };

    return new ShareEmail();
})(jQuery);

var Muncipio = Muncipio || {};
Muncipio.Ajax = Muncipio.Ajax || {};

Muncipio.Ajax.Suggestions = (function($) {
    var typingTimer;
    var lastTerm;

    function Suggestions() {
        if (!$('#filter-keyword').length || HbgPrimeArgs.api.postTypeRestUrl == null) {
            return;
        }

        $('#filter-keyword').attr('autocomplete', 'off');
        this.handleEvents();
    }

    Suggestions.prototype.handleEvents = function() {
        $(document).on(
            'keydown',
            '#filter-keyword',
            function(e) {
                var $this = $(e.target),
                    $selected = $('.selected', '#search-suggestions');

                if ($selected.siblings().length > 0) {
                    $('#search-suggestions li').removeClass('selected');
                }

                if (e.keyCode == 27) {
                    // Key pressed: Esc
                    $('#search-suggestions').remove();
                    return;
                } else if (e.keyCode == 13) {
                    // Key pressed: Enter
                    return;
                } else if (e.keyCode == 38) {
                    // Key pressed: Up
                    if ($selected.prev().length == 0) {
                        $selected
                            .siblings()
                            .last()
                            .addClass('selected');
                    } else {
                        $selected.prev().addClass('selected');
                    }

                    $this.val($('.selected', '#search-suggestions').text());
                } else if (e.keyCode == 40) {
                    // Key pressed: Down
                    if ($selected.next().length == 0) {
                        $selected
                            .siblings()
                            .first()
                            .addClass('selected');
                    } else {
                        $selected.next().addClass('selected');
                    }

                    $this.val($('.selected', '#search-suggestions').text());
                } else {
                    // Do the search
                    clearTimeout(typingTimer);
                    typingTimer = setTimeout(
                        function() {
                            this.search($this.val());
                        }.bind(this),
                        100
                    );
                }
            }.bind(this)
        );

        $(document).on(
            'click',
            function(e) {
                if (!$(e.target).closest('#search-suggestions').length) {
                    $('#search-suggestions').remove();
                }
            }.bind(this)
        );

        $(document).on(
            'click',
            '#search-suggestions li',
            function(e) {
                $('#search-suggestions').remove();
                $('#filter-keyword')
                    .val($(e.target).text())
                    .parents('form')
                    .submit();
            }.bind(this)
        );
    };

    /**
     * Performs the search for similar titles+content
     * @param  {string} term Search term
     * @return {void}
     */
    Suggestions.prototype.search = function(term) {
        if (term === lastTerm) {
            return false;
        }

        if (term.length < 4) {
            $('#search-suggestions').remove();
            return false;
        }

        // Set last term to the current term
        lastTerm = term;

        // Get API endpoint for performing the search
        var requestUrl = HbgPrimeArgs.api.postTypeRestUrl + '?per_page=6&search=' + term;

        // Do the search request
        $.get(
            requestUrl,
            function(response) {
                if (!response.length) {
                    $('#search-suggestions').remove();
                    return;
                }

                this.output(response, term);
            }.bind(this),
            'JSON'
        );
    };

    /**
     * Outputs the suggestions
     * @param  {array} suggestions
     * @param  {string} term
     * @return {void}
     */
    Suggestions.prototype.output = function(suggestions, term) {
        var $suggestions = $('#search-suggestions');

        if (!$suggestions.length) {
            $suggestions = $('<div id="search-suggestions"><ul></ul></div>');
        }

        $('ul', $suggestions).empty();
        $.each(suggestions, function(index, suggestion) {
            $('ul', $suggestions).append('<li>' + suggestion.title.rendered + '</li>');
        });

        $('li', $suggestions)
            .first()
            .addClass('selected');

        $('#filter-keyword')
            .parent()
            .append($suggestions);
        $suggestions.slideDown(200);
    };

    return new Suggestions();
})(jQuery);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFsZ29saWEtYXV0b2NvbXBsZXRlLmpzIiwiYWxnb2xpYS1pbnN0YW50c2VhcmNoLmpzIiwiYXBwLmpzIiwiY29tbWVudHMuanMiLCJmb250LmpzIiwiZ29vZ2xlVHJhbnNsYXRlLmpzIiwibWFpbkNvbnRhaW5lci5qcyIsIkFqYXgvbGlrZUJ1dHRvbi5qcyIsIkFqYXgvc2hhcmVFbWFpbC5qcyIsIkFqYXgvc3VnZ2VzdGlvbnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RkE7QUFDQTtBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbk1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsialF1ZXJ5KGZ1bmN0aW9uICgpIHtcclxuICAvKiBDaGVjayBpZiBhbGdvbGlhIGlzIHJ1bm5pbmcgKi9cclxuICBpZih0eXBlb2YgYWxnb2xpYXNlYXJjaCAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG5cclxuICAgIC8qIGluaXQgQWxnb2xpYSBjbGllbnQgKi9cclxuICAgIHZhciBjbGllbnQgPSBhbGdvbGlhc2VhcmNoKGFsZ29saWEuYXBwbGljYXRpb25faWQsIGFsZ29saWEuc2VhcmNoX2FwaV9rZXkpO1xyXG5cclxuICAgIC8qIHNldHVwIGRlZmF1bHQgc291cmNlcyAqL1xyXG4gICAgdmFyIHNvdXJjZXMgPSBbXTtcclxuICAgIGpRdWVyeS5lYWNoKGFsZ29saWEuYXV0b2NvbXBsZXRlLnNvdXJjZXMsIGZ1bmN0aW9uIChpLCBjb25maWcpIHtcclxuICAgICAgdmFyIHN1Z2dlc3Rpb25fdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZShjb25maWcudG1wbF9zdWdnZXN0aW9uKTtcclxuICAgICAgc291cmNlcy5wdXNoKHtcclxuICAgICAgICBzb3VyY2U6IGFsZ29saWFBdXRvY29tcGxldGUuc291cmNlcy5oaXRzKGNsaWVudC5pbml0SW5kZXgoY29uZmlnLmluZGV4X25hbWUpLCB7XHJcbiAgICAgICAgICBoaXRzUGVyUGFnZTogY29uZmlnLm1heF9zdWdnZXN0aW9ucyxcclxuICAgICAgICAgIGF0dHJpYnV0ZXNUb1NuaXBwZXQ6IFtcclxuICAgICAgICAgICAgJ2NvbnRlbnQ6MTAnXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgaGlnaGxpZ2h0UHJlVGFnOiAnX19haXMtaGlnaGxpZ2h0X18nLFxyXG4gICAgICAgICAgaGlnaGxpZ2h0UG9zdFRhZzogJ19fL2Fpcy1oaWdobGlnaHRfXydcclxuICAgICAgICB9KSxcclxuICAgICAgICB0ZW1wbGF0ZXM6IHtcclxuICAgICAgICAgIGhlYWRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gd3AudGVtcGxhdGUoJ2F1dG9jb21wbGV0ZS1oZWFkZXInKSh7XHJcbiAgICAgICAgICAgICAgbGFiZWw6IF8uZXNjYXBlKGNvbmZpZy5sYWJlbClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc3VnZ2VzdGlvbjogZnVuY3Rpb24gKGhpdCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gaGl0Ll9oaWdobGlnaHRSZXN1bHQpIHtcclxuICAgICAgICAgICAgICAvKiBXZSBkbyBub3QgZGVhbCB3aXRoIGFycmF5cy4gKi9cclxuICAgICAgICAgICAgICBpZiAodHlwZW9mIGhpdC5faGlnaGxpZ2h0UmVzdWx0W2tleV0udmFsdWUgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgaGl0Ll9oaWdobGlnaHRSZXN1bHRba2V5XS52YWx1ZSA9IF8uZXNjYXBlKGhpdC5faGlnaGxpZ2h0UmVzdWx0W2tleV0udmFsdWUpO1xyXG4gICAgICAgICAgICAgIGhpdC5faGlnaGxpZ2h0UmVzdWx0W2tleV0udmFsdWUgPSBoaXQuX2hpZ2hsaWdodFJlc3VsdFtrZXldLnZhbHVlLnJlcGxhY2UoL19fYWlzLWhpZ2hsaWdodF9fL2csICc8ZW0+JykucmVwbGFjZSgvX19cXC9haXMtaGlnaGxpZ2h0X18vZywgJzwvZW0+Jyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBoaXQuX3NuaXBwZXRSZXN1bHQpIHtcclxuICAgICAgICAgICAgICAvKiBXZSBkbyBub3QgZGVhbCB3aXRoIGFycmF5cy4gKi9cclxuICAgICAgICAgICAgICBpZiAodHlwZW9mIGhpdC5fc25pcHBldFJlc3VsdFtrZXldLnZhbHVlICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBoaXQuX3NuaXBwZXRSZXN1bHRba2V5XS52YWx1ZSA9IF8uZXNjYXBlKGhpdC5fc25pcHBldFJlc3VsdFtrZXldLnZhbHVlKTtcclxuICAgICAgICAgICAgICBoaXQuX3NuaXBwZXRSZXN1bHRba2V5XS52YWx1ZSA9IGhpdC5fc25pcHBldFJlc3VsdFtrZXldLnZhbHVlLnJlcGxhY2UoL19fYWlzLWhpZ2hsaWdodF9fL2csICc8ZW0+JykucmVwbGFjZSgvX19cXC9haXMtaGlnaGxpZ2h0X18vZywgJzwvZW0+Jyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdWdnZXN0aW9uX3RlbXBsYXRlKGhpdCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICAvKiBTZXR1cCBkcm9wZG93biBtZW51cyAqL1xyXG4gICAgalF1ZXJ5KFwiaW5wdXRbbmFtZT0ncyddXCIpLmVhY2goZnVuY3Rpb24gKGkpIHtcclxuICAgICAgdmFyICRzZWFyY2hJbnB1dCA9IGpRdWVyeSh0aGlzKTtcclxuXHJcbiAgICAgIHZhciBjb25maWcgPSB7XHJcbiAgICAgICAgZGVidWc6IGFsZ29saWEuZGVidWcsXHJcbiAgICAgICAgaGludDogZmFsc2UsXHJcbiAgICAgICAgb3Blbk9uRm9jdXM6IHRydWUsXHJcbiAgICAgICAgYXBwZW5kVG86ICdib2R5JyxcclxuICAgICAgICB0ZW1wbGF0ZXM6IHtcclxuICAgICAgICAgIGVtcHR5OiB3cC50ZW1wbGF0ZSgnYXV0b2NvbXBsZXRlLWVtcHR5JylcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZiAoYWxnb2xpYS5wb3dlcmVkX2J5X2VuYWJsZWQpIHtcclxuICAgICAgICBjb25maWcudGVtcGxhdGVzLmZvb3RlciA9IHdwLnRlbXBsYXRlKCdhdXRvY29tcGxldGUtZm9vdGVyJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qIEluc3RhbnRpYXRlIGF1dG9jb21wbGV0ZS5qcyAqL1xyXG4gICAgICB2YXIgYXV0b2NvbXBsZXRlID0gYWxnb2xpYUF1dG9jb21wbGV0ZSgkc2VhcmNoSW5wdXRbMF0sIGNvbmZpZywgc291cmNlcylcclxuICAgICAgLm9uKCdhdXRvY29tcGxldGU6c2VsZWN0ZWQnLCBmdW5jdGlvbiAoZSwgc3VnZ2VzdGlvbikge1xyXG4gICAgICAgIC8qIFJlZGlyZWN0IHRoZSB1c2VyIHdoZW4gd2UgZGV0ZWN0IGEgc3VnZ2VzdGlvbiBzZWxlY3Rpb24uICovXHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBzdWdnZXN0aW9uLnBlcm1hbGluaztcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvKiBGb3JjZSB0aGUgZHJvcGRvd24gdG8gYmUgcmUtZHJhd24gb24gc2Nyb2xsIHRvIGhhbmRsZSBmaXhlZCBjb250YWluZXJzLiAqL1xyXG4gICAgICBqUXVlcnkod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYoYXV0b2NvbXBsZXRlLmF1dG9jb21wbGV0ZS5nZXRXcmFwcGVyKCkuc3R5bGUuZGlzcGxheSA9PT0gXCJibG9ja1wiKSB7XHJcbiAgICAgICAgICBhdXRvY29tcGxldGUuYXV0b2NvbXBsZXRlLmNsb3NlKCk7XHJcbiAgICAgICAgICBhdXRvY29tcGxldGUuYXV0b2NvbXBsZXRlLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgalF1ZXJ5KGRvY3VtZW50KS5vbihcImNsaWNrXCIsIFwiLmFsZ29saWEtcG93ZXJlZC1ieS1saW5rXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgd2luZG93LmxvY2F0aW9uID0gXCJodHRwczovL3d3dy5hbGdvbGlhLmNvbS8/dXRtX3NvdXJjZT1Xb3JkUHJlc3MmdXRtX21lZGl1bT1leHRlbnNpb24mdXRtX2NvbnRlbnQ9XCIgKyB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgKyBcIiZ1dG1fY2FtcGFpZ249cG93ZXJlZGJ5XCI7XHJcbiAgICB9KTtcclxuICB9XHJcbn0pO1xyXG4iLCJkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWxnb2xpYS1zZWFyY2gtYm94JykpIHtcclxuXHJcbiAgICAgICAgLyogSW5zdGFudGlhdGUgaW5zdGFudHNlYXJjaC5qcyAqL1xyXG4gICAgICAgIHZhciBzZWFyY2ggPSBpbnN0YW50c2VhcmNoKHtcclxuICAgICAgICAgICAgYXBwSWQ6IGFsZ29saWEuYXBwbGljYXRpb25faWQsXHJcbiAgICAgICAgICAgIGFwaUtleTogYWxnb2xpYS5zZWFyY2hfYXBpX2tleSxcclxuICAgICAgICAgICAgaW5kZXhOYW1lOiBhbGdvbGlhLmluZGljZXMuc2VhcmNoYWJsZV9wb3N0cy5uYW1lLFxyXG4gICAgICAgICAgICB1cmxTeW5jOiB7XHJcbiAgICAgICAgICAgICAgICBtYXBwaW5nOiB7J3EnOiAncyd9LFxyXG4gICAgICAgICAgICAgICAgdHJhY2tlZFBhcmFtZXRlcnM6IFsncXVlcnknXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZWFyY2hQYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBmYWNldGluZ0FmdGVyRGlzdGluY3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBoaWdobGlnaHRQcmVUYWc6ICdfX2Fpcy1oaWdobGlnaHRfXycsXHJcbiAgICAgICAgICAgICAgICBoaWdobGlnaHRQb3N0VGFnOiAnX18vYWlzLWhpZ2hsaWdodF9fJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8qIFNlYXJjaCBib3ggd2lkZ2V0ICovXHJcbiAgICAgICAgc2VhcmNoLmFkZFdpZGdldChcclxuICAgICAgICAgICAgaW5zdGFudHNlYXJjaC53aWRnZXRzLnNlYXJjaEJveCh7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXI6ICcjYWxnb2xpYS1zZWFyY2gtYm94JyxcclxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAnU2VhcmNoIGZvci4uLicsXHJcbiAgICAgICAgICAgICAgICB3cmFwSW5wdXQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcG93ZXJlZEJ5OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNzc0NsYXNzZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBpbnB1dDogWydmb3JtLWNvbnRyb2wnLCAnZm9ybS1jb250cm9sLWxnJ11cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvKiBTdGF0cyB3aWRnZXQgKi9cclxuICAgICAgICBzZWFyY2guYWRkV2lkZ2V0KFxyXG4gICAgICAgICAgICBpbnN0YW50c2VhcmNoLndpZGdldHMuc3RhdHMoe1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyOiAnI2FsZ29saWEtc3RhdHMnLFxyXG4gICAgICAgICAgICAgICAgYXV0b0hpZGVDb250YWluZXI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9keTogd3AudGVtcGxhdGUoJ2luc3RhbnRzZWFyY2gtc3RhdHVzJylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvKiBIaXRzIHdpZGdldCAqL1xyXG4gICAgICAgIHNlYXJjaC5hZGRXaWRnZXQoXHJcbiAgICAgICAgICAgIGluc3RhbnRzZWFyY2gud2lkZ2V0cy5oaXRzKHtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lcjogJyNhbGdvbGlhLWhpdHMnLFxyXG4gICAgICAgICAgICAgICAgaGl0c1BlclBhZ2U6IDEwLFxyXG4gICAgICAgICAgICAgICAgY3NzQ2xhc3Nlczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvb3Q6IFsnc2VhcmNoLXJlc3VsdC1saXN0J10sXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogWydzZWFyY2gtcmVzdWx0LWl0ZW0nXVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGVtcHR5OiB3cC50ZW1wbGF0ZSgnaW5zdGFudHNlYXJjaC1lbXB0eScpLFxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06IHdwLnRlbXBsYXRlKCdpbnN0YW50c2VhcmNoLWhpdCcpXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtRGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW06IGZ1bmN0aW9uIChoaXQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIENyZWF0ZSBjb250ZW50IHNuaXBwZXQgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaGl0LmNvbnRlbnRTbmlwcGV0ID0gaGl0LmNvbnRlbnQubGVuZ3RoID4gMzAwID8gaGl0LmNvbnRlbnQuc3Vic3RyaW5nKDAsIDMwMCAtIDMpICsgJy4uLicgOiBoaXQuY29udGVudDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIENyZWF0ZSBoaWdodGxpZ2h0IHJlc3VsdHMgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBrZXkgaW4gaGl0Ll9oaWdobGlnaHRSZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgaGl0Ll9oaWdobGlnaHRSZXN1bHRba2V5XS52YWx1ZSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBoaXQuX2hpZ2hsaWdodFJlc3VsdFtrZXldLnZhbHVlID0gXy5lc2NhcGUoaGl0Ll9oaWdobGlnaHRSZXN1bHRba2V5XS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaGl0Ll9oaWdobGlnaHRSZXN1bHRba2V5XS52YWx1ZSA9IGhpdC5faGlnaGxpZ2h0UmVzdWx0W2tleV0udmFsdWUucmVwbGFjZSgvX19haXMtaGlnaGxpZ2h0X18vZywgJzxlbT4nKS5yZXBsYWNlKC9fX1xcL2Fpcy1oaWdobGlnaHRfXy9nLCAnPC9lbT4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhpdDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLyogUGFnaW5hdGlvbiB3aWRnZXQgKi9cclxuICAgICAgICBzZWFyY2guYWRkV2lkZ2V0KFxyXG4gICAgICAgICAgICBpbnN0YW50c2VhcmNoLndpZGdldHMucGFnaW5hdGlvbih7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXI6ICcjYWxnb2xpYS1wYWdpbmF0aW9uJyxcclxuICAgICAgICAgICAgICAgIGNzc0NsYXNzZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICByb290OiBbJ3BhZ2luYXRpb24nXSxcclxuICAgICAgICAgICAgICAgICAgICBpdGVtOiBbJ3BhZ2UnXSxcclxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZDogWydoaWRkZW4nXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8qIFN0YXJ0ICovXHJcbiAgICAgICAgc2VhcmNoLnN0YXJ0KCk7XHJcbiAgICB9XHJcbn0pO1xyXG4iLCJ2YXIgTXVuY2lwaW8gPSB7fTtcclxuIiwidmFyIE11bmNpcGlvID0gTXVuY2lwaW8gfHwge307XHJcbk11bmNpcGlvLlBvc3QgPSBNdW5jaXBpby5Qb3N0IHx8IHt9O1xyXG5cclxuTXVuY2lwaW8uUG9zdC5Db21tZW50cyA9IChmdW5jdGlvbigkKSB7XHJcbiAgICBmdW5jdGlvbiBDb21tZW50cygpIHtcclxuICAgICAgICAkKFxyXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXZlbnRzKCk7XHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIYW5kbGUgZXZlbnRzXHJcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxyXG4gICAgICovXHJcbiAgICBDb21tZW50cy5wcm90b3R5cGUuaGFuZGxlRXZlbnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJChkb2N1bWVudCkub24oXHJcbiAgICAgICAgICAgICdjbGljaycsXHJcbiAgICAgICAgICAgICcjZWRpdC1jb21tZW50JyxcclxuICAgICAgICAgICAgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5RWRpdEZvcm0oZSk7XHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKFxyXG4gICAgICAgICAgICAnc3VibWl0JyxcclxuICAgICAgICAgICAgJyNjb21tZW50dXBkYXRlJyxcclxuICAgICAgICAgICAgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51ZHBhdGVDb21tZW50KGUpO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcylcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50KS5vbihcclxuICAgICAgICAgICAgJ2NsaWNrJyxcclxuICAgICAgICAgICAgJyNkZWxldGUtY29tbWVudCcsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuY29uZmlybShNdW5pY2lwaW9MYW5nLm1lc3NhZ2VzLmRlbGV0ZUNvbW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVDb21tZW50KGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LmJpbmQodGhpcylcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50KS5vbihcclxuICAgICAgICAgICAgJ2NsaWNrJyxcclxuICAgICAgICAgICAgJy5jYW5jZWwtdXBkYXRlLWNvbW1lbnQnLFxyXG4gICAgICAgICAgICBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFuVXAoKTtcclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgJChkb2N1bWVudCkub24oXHJcbiAgICAgICAgICAgICdjbGljaycsXHJcbiAgICAgICAgICAgICcuY29tbWVudC1yZXBseS1saW5rJyxcclxuICAgICAgICAgICAgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhblVwKCk7XHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxyXG4gICAgICAgICk7XHJcbiAgICB9O1xyXG5cclxuICAgIENvbW1lbnRzLnByb3RvdHlwZS51ZHBhdGVDb21tZW50ID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICB2YXIgJHRhcmdldCA9ICQoZXZlbnQudGFyZ2V0KVxyXG4gICAgICAgICAgICAgICAgLmNsb3Nlc3QoJy5jb21tZW50LWJvZHknKVxyXG4gICAgICAgICAgICAgICAgLmZpbmQoJy5jb21tZW50LWNvbnRlbnQnKSxcclxuICAgICAgICAgICAgZGF0YSA9IG5ldyBGb3JtRGF0YShldmVudC50YXJnZXQpLFxyXG4gICAgICAgICAgICBvbGRDb21tZW50ID0gJHRhcmdldC5odG1sKCk7XHJcbiAgICAgICAgZGF0YS5hcHBlbmQoJ2FjdGlvbicsICd1cGRhdGVfY29tbWVudCcpO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6IGFqYXh1cmwsXHJcbiAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICAgICAgY29udGV4dDogdGhpcyxcclxuICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG4gICAgICAgICAgICBjb250ZW50VHlwZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gRG8gZXhwZWN0ZWQgYmVoYXZpb3JcclxuICAgICAgICAgICAgICAgICR0YXJnZXQuaHRtbChkYXRhLmdldCgnY29tbWVudCcpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYW5VcCgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVW5kbyBmcm9udCBlbmQgdXBkYXRlXHJcbiAgICAgICAgICAgICAgICAgICAgJHRhcmdldC5odG1sKG9sZENvbW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd0Vycm9yKCR0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oanFYSFIsIHRleHRTdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgICR0YXJnZXQuaHRtbChvbGRDb21tZW50KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0Vycm9yKCR0YXJnZXQpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBDb21tZW50cy5wcm90b3R5cGUuZGlzcGxheUVkaXRGb3JtID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICB2YXIgY29tbWVudElkID0gJChldmVudC5jdXJyZW50VGFyZ2V0KS5kYXRhKCdjb21tZW50LWlkJyksXHJcbiAgICAgICAgICAgIHBvc3RJZCA9ICQoZXZlbnQuY3VycmVudFRhcmdldCkuZGF0YSgncG9zdC1pZCcpLFxyXG4gICAgICAgICAgICAkdGFyZ2V0ID0gJChcclxuICAgICAgICAgICAgICAgICcuY29tbWVudC1ib2R5JyxcclxuICAgICAgICAgICAgICAgICcjYW5zd2VyLScgKyBjb21tZW50SWQgKyAnLCAjY29tbWVudC0nICsgY29tbWVudElkXHJcbiAgICAgICAgICAgICkuZmlyc3QoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jbGVhblVwKCk7XHJcbiAgICAgICAgJCgnLmNvbW1lbnQtY29udGVudCwgLmNvbW1lbnQtZm9vdGVyJywgJHRhcmdldCkuaGlkZSgpO1xyXG4gICAgICAgICR0YXJnZXQuYXBwZW5kKFxyXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImxvYWRpbmcgZ3V0dGVyIGd1dHRlci10b3AgZ3V0dGVyLW1hcmdpblwiPjxkaXY+PC9kaXY+PGRpdj48L2Rpdj48ZGl2PjwvZGl2PjxkaXY+PC9kaXY+PC9kaXY+J1xyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgICQud2hlbih0aGlzLmdldENvbW1lbnRGb3JtKGNvbW1lbnRJZCwgcG9zdElkKSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgJHRhcmdldC5hcHBlbmQocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAkKCcubG9hZGluZycsICR0YXJnZXQpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFJlIGluaXQgdGlueU1jZSBpZiBpdHMgdXNlZFxyXG4gICAgICAgICAgICAgICAgaWYgKCQoJy50aW55bWNlLWVkaXRvcicpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbnltY2UuRWRpdG9yTWFuYWdlci5leGVjQ29tbWFuZCgnbWNlUmVtb3ZlRWRpdG9yJywgdHJ1ZSwgJ2NvbW1lbnQtZWRpdCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbnltY2UuRWRpdG9yTWFuYWdlci5leGVjQ29tbWFuZCgnbWNlQWRkRWRpdG9yJywgdHJ1ZSwgJ2NvbW1lbnQtZWRpdCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhblVwKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dFcnJvcigkdGFyZ2V0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBDb21tZW50cy5wcm90b3R5cGUuZ2V0Q29tbWVudEZvcm0gPSBmdW5jdGlvbihjb21tZW50SWQsIHBvc3RJZCkge1xyXG4gICAgICAgIHJldHVybiAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6IGFqYXh1cmwsXHJcbiAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29udGV4dDogdGhpcyxcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAnZ2V0X2NvbW1lbnRfZm9ybScsXHJcbiAgICAgICAgICAgICAgICBjb21tZW50SWQ6IGNvbW1lbnRJZCxcclxuICAgICAgICAgICAgICAgIHBvc3RJZDogcG9zdElkLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBDb21tZW50cy5wcm90b3R5cGUuZGVsZXRlQ29tbWVudCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyICR0YXJnZXQgPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLFxyXG4gICAgICAgICAgICBjb21tZW50SWQgPSAkdGFyZ2V0LmRhdGEoJ2NvbW1lbnQtaWQnKSxcclxuICAgICAgICAgICAgbm9uY2UgPSAkdGFyZ2V0LmRhdGEoJ2NvbW1lbnQtbm9uY2UnKTtcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiBhamF4dXJsLFxyXG4gICAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICAgIGNvbnRleHQ6IHRoaXMsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIGFjdGlvbjogJ3JlbW92ZV9jb21tZW50JyxcclxuICAgICAgICAgICAgICAgIGlkOiBjb21tZW50SWQsXHJcbiAgICAgICAgICAgICAgICBub25jZTogbm9uY2UsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBEbyBleHBlY3RlZCBiZWhhdmlvclxyXG4gICAgICAgICAgICAgICAgJHRhcmdldC5jbG9zZXN0KCdsaS5hbnN3ZXIsIGxpLmNvbW1lbnQnKS5mYWRlT3V0KCdmYXN0Jyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlLnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBVbmRvIGZyb250IGVuZCBkZWxldGlvblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd0Vycm9yKCR0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oanFYSFIsIHRleHRTdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0Vycm9yKCR0YXJnZXQpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBDb21tZW50cy5wcm90b3R5cGUuY2xlYW5VcCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgJCgnLmNvbW1lbnQtdXBkYXRlJykucmVtb3ZlKCk7XHJcbiAgICAgICAgJCgnLmxvYWRpbmcnLCAnLmNvbW1lbnQtYm9keScpLnJlbW92ZSgpO1xyXG4gICAgICAgICQoJy5kcm9wZG93bi1tZW51JykuaGlkZSgpO1xyXG4gICAgICAgICQoJy5jb21tZW50LWNvbnRlbnQsIC5jb21tZW50LWZvb3RlcicpLmZhZGVJbignZmFzdCcpO1xyXG4gICAgfTtcclxuXHJcbiAgICBDb21tZW50cy5wcm90b3R5cGUuc2hvd0Vycm9yID0gZnVuY3Rpb24odGFyZ2V0KSB7XHJcbiAgICAgICAgdGFyZ2V0XHJcbiAgICAgICAgICAgIC5jbG9zZXN0KCdsaS5hbnN3ZXIsIGxpLmNvbW1lbnQnKVxyXG4gICAgICAgICAgICAuZmFkZUluKCdmYXN0JylcclxuICAgICAgICAgICAgLmZpbmQoJy5jb21tZW50LWJvZHk6Zmlyc3QnKVxyXG4gICAgICAgICAgICAuYXBwZW5kKCc8c21hbGwgY2xhc3M9XCJ0ZXh0LWRhbmdlclwiPicgKyBNdW5pY2lwaW9MYW5nLm1lc3NhZ2VzLm9uRXJyb3IgKyAnPC9zbWFsbD4nKVxyXG4gICAgICAgICAgICAuZmluZCgnLnRleHQtZGFuZ2VyJylcclxuICAgICAgICAgICAgLmRlbGF5KDQwMDApXHJcbiAgICAgICAgICAgIC5mYWRlT3V0KCdmYXN0Jyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBuZXcgQ29tbWVudHMoKTtcclxufSkoalF1ZXJ5KTtcclxuIiwiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gYWEoYSxiLGMpe3JldHVybiBhLmNhbGwuYXBwbHkoYS5iaW5kLGFyZ3VtZW50cyl9ZnVuY3Rpb24gYmEoYSxiLGMpe2lmKCFhKXRocm93IEVycm9yKCk7aWYoMjxhcmd1bWVudHMubGVuZ3RoKXt2YXIgZD1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMik7cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIGM9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtBcnJheS5wcm90b3R5cGUudW5zaGlmdC5hcHBseShjLGQpO3JldHVybiBhLmFwcGx5KGIsYyl9fXJldHVybiBmdW5jdGlvbigpe3JldHVybiBhLmFwcGx5KGIsYXJndW1lbnRzKX19ZnVuY3Rpb24gcChhLGIsYyl7cD1GdW5jdGlvbi5wcm90b3R5cGUuYmluZCYmLTEhPUZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLnRvU3RyaW5nKCkuaW5kZXhPZihcIm5hdGl2ZSBjb2RlXCIpP2FhOmJhO3JldHVybiBwLmFwcGx5KG51bGwsYXJndW1lbnRzKX12YXIgcT1EYXRlLm5vd3x8ZnVuY3Rpb24oKXtyZXR1cm4rbmV3IERhdGV9O2Z1bmN0aW9uIGNhKGEsYil7dGhpcy5hPWE7dGhpcy5tPWJ8fGE7dGhpcy5jPXRoaXMubS5kb2N1bWVudH12YXIgZGE9ISF3aW5kb3cuRm9udEZhY2U7ZnVuY3Rpb24gdChhLGIsYyxkKXtiPWEuYy5jcmVhdGVFbGVtZW50KGIpO2lmKGMpZm9yKHZhciBlIGluIGMpYy5oYXNPd25Qcm9wZXJ0eShlKSYmKFwic3R5bGVcIj09ZT9iLnN0eWxlLmNzc1RleHQ9Y1tlXTpiLnNldEF0dHJpYnV0ZShlLGNbZV0pKTtkJiZiLmFwcGVuZENoaWxkKGEuYy5jcmVhdGVUZXh0Tm9kZShkKSk7cmV0dXJuIGJ9ZnVuY3Rpb24gdShhLGIsYyl7YT1hLmMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoYilbMF07YXx8KGE9ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTthLmluc2VydEJlZm9yZShjLGEubGFzdENoaWxkKX1mdW5jdGlvbiB2KGEpe2EucGFyZW50Tm9kZSYmYS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGEpfVxyXG5mdW5jdGlvbiB3KGEsYixjKXtiPWJ8fFtdO2M9Y3x8W107Zm9yKHZhciBkPWEuY2xhc3NOYW1lLnNwbGl0KC9cXHMrLyksZT0wO2U8Yi5sZW5ndGg7ZSs9MSl7Zm9yKHZhciBmPSExLGc9MDtnPGQubGVuZ3RoO2crPTEpaWYoYltlXT09PWRbZ10pe2Y9ITA7YnJlYWt9Znx8ZC5wdXNoKGJbZV0pfWI9W107Zm9yKGU9MDtlPGQubGVuZ3RoO2UrPTEpe2Y9ITE7Zm9yKGc9MDtnPGMubGVuZ3RoO2crPTEpaWYoZFtlXT09PWNbZ10pe2Y9ITA7YnJlYWt9Znx8Yi5wdXNoKGRbZV0pfWEuY2xhc3NOYW1lPWIuam9pbihcIiBcIikucmVwbGFjZSgvXFxzKy9nLFwiIFwiKS5yZXBsYWNlKC9eXFxzK3xcXHMrJC8sXCJcIil9ZnVuY3Rpb24geShhLGIpe2Zvcih2YXIgYz1hLmNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pLGQ9MCxlPWMubGVuZ3RoO2Q8ZTtkKyspaWYoY1tkXT09YilyZXR1cm4hMDtyZXR1cm4hMX1cclxuZnVuY3Rpb24geihhKXtpZihcInN0cmluZ1wiPT09dHlwZW9mIGEuZilyZXR1cm4gYS5mO3ZhciBiPWEubS5sb2NhdGlvbi5wcm90b2NvbDtcImFib3V0OlwiPT1iJiYoYj1hLmEubG9jYXRpb24ucHJvdG9jb2wpO3JldHVyblwiaHR0cHM6XCI9PWI/XCJodHRwczpcIjpcImh0dHA6XCJ9ZnVuY3Rpb24gZWEoYSl7cmV0dXJuIGEubS5sb2NhdGlvbi5ob3N0bmFtZXx8YS5hLmxvY2F0aW9uLmhvc3RuYW1lfVxyXG5mdW5jdGlvbiBBKGEsYixjKXtmdW5jdGlvbiBkKCl7ayYmZSYmZiYmKGsoZyksaz1udWxsKX1iPXQoYSxcImxpbmtcIix7cmVsOlwic3R5bGVzaGVldFwiLGhyZWY6YixtZWRpYTpcImFsbFwifSk7dmFyIGU9ITEsZj0hMCxnPW51bGwsaz1jfHxudWxsO2RhPyhiLm9ubG9hZD1mdW5jdGlvbigpe2U9ITA7ZCgpfSxiLm9uZXJyb3I9ZnVuY3Rpb24oKXtlPSEwO2c9RXJyb3IoXCJTdHlsZXNoZWV0IGZhaWxlZCB0byBsb2FkXCIpO2QoKX0pOnNldFRpbWVvdXQoZnVuY3Rpb24oKXtlPSEwO2QoKX0sMCk7dShhLFwiaGVhZFwiLGIpfVxyXG5mdW5jdGlvbiBCKGEsYixjLGQpe3ZhciBlPWEuYy5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07aWYoZSl7dmFyIGY9dChhLFwic2NyaXB0XCIse3NyYzpifSksZz0hMTtmLm9ubG9hZD1mLm9ucmVhZHlzdGF0ZWNoYW5nZT1mdW5jdGlvbigpe2d8fHRoaXMucmVhZHlTdGF0ZSYmXCJsb2FkZWRcIiE9dGhpcy5yZWFkeVN0YXRlJiZcImNvbXBsZXRlXCIhPXRoaXMucmVhZHlTdGF0ZXx8KGc9ITAsYyYmYyhudWxsKSxmLm9ubG9hZD1mLm9ucmVhZHlzdGF0ZWNoYW5nZT1udWxsLFwiSEVBRFwiPT1mLnBhcmVudE5vZGUudGFnTmFtZSYmZS5yZW1vdmVDaGlsZChmKSl9O2UuYXBwZW5kQ2hpbGQoZik7c2V0VGltZW91dChmdW5jdGlvbigpe2d8fChnPSEwLGMmJmMoRXJyb3IoXCJTY3JpcHQgbG9hZCB0aW1lb3V0XCIpKSl9LGR8fDVFMyk7cmV0dXJuIGZ9cmV0dXJuIG51bGx9O2Z1bmN0aW9uIEMoKXt0aGlzLmE9MDt0aGlzLmM9bnVsbH1mdW5jdGlvbiBEKGEpe2EuYSsrO3JldHVybiBmdW5jdGlvbigpe2EuYS0tO0UoYSl9fWZ1bmN0aW9uIEYoYSxiKXthLmM9YjtFKGEpfWZ1bmN0aW9uIEUoYSl7MD09YS5hJiZhLmMmJihhLmMoKSxhLmM9bnVsbCl9O2Z1bmN0aW9uIEcoYSl7dGhpcy5hPWF8fFwiLVwifUcucHJvdG90eXBlLmM9ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPVtdLGM9MDtjPGFyZ3VtZW50cy5sZW5ndGg7YysrKWIucHVzaChhcmd1bWVudHNbY10ucmVwbGFjZSgvW1xcV19dKy9nLFwiXCIpLnRvTG93ZXJDYXNlKCkpO3JldHVybiBiLmpvaW4odGhpcy5hKX07ZnVuY3Rpb24gSChhLGIpe3RoaXMuYz1hO3RoaXMuZj00O3RoaXMuYT1cIm5cIjt2YXIgYz0oYnx8XCJuNFwiKS5tYXRjaCgvXihbbmlvXSkoWzEtOV0pJC9pKTtjJiYodGhpcy5hPWNbMV0sdGhpcy5mPXBhcnNlSW50KGNbMl0sMTApKX1mdW5jdGlvbiBmYShhKXtyZXR1cm4gSShhKStcIiBcIisoYS5mK1wiMDBcIikrXCIgMzAwcHggXCIrSihhLmMpfWZ1bmN0aW9uIEooYSl7dmFyIGI9W107YT1hLnNwbGl0KC8sXFxzKi8pO2Zvcih2YXIgYz0wO2M8YS5sZW5ndGg7YysrKXt2YXIgZD1hW2NdLnJlcGxhY2UoL1snXCJdL2csXCJcIik7LTEhPWQuaW5kZXhPZihcIiBcIil8fC9eXFxkLy50ZXN0KGQpP2IucHVzaChcIidcIitkK1wiJ1wiKTpiLnB1c2goZCl9cmV0dXJuIGIuam9pbihcIixcIil9ZnVuY3Rpb24gSyhhKXtyZXR1cm4gYS5hK2EuZn1mdW5jdGlvbiBJKGEpe3ZhciBiPVwibm9ybWFsXCI7XCJvXCI9PT1hLmE/Yj1cIm9ibGlxdWVcIjpcImlcIj09PWEuYSYmKGI9XCJpdGFsaWNcIik7cmV0dXJuIGJ9XHJcbmZ1bmN0aW9uIGdhKGEpe3ZhciBiPTQsYz1cIm5cIixkPW51bGw7YSYmKChkPWEubWF0Y2goLyhub3JtYWx8b2JsaXF1ZXxpdGFsaWMpL2kpKSYmZFsxXSYmKGM9ZFsxXS5zdWJzdHIoMCwxKS50b0xvd2VyQ2FzZSgpKSwoZD1hLm1hdGNoKC8oWzEtOV0wMHxub3JtYWx8Ym9sZCkvaSkpJiZkWzFdJiYoL2JvbGQvaS50ZXN0KGRbMV0pP2I9NzovWzEtOV0wMC8udGVzdChkWzFdKSYmKGI9cGFyc2VJbnQoZFsxXS5zdWJzdHIoMCwxKSwxMCkpKSk7cmV0dXJuIGMrYn07ZnVuY3Rpb24gaGEoYSxiKXt0aGlzLmM9YTt0aGlzLmY9YS5tLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudDt0aGlzLmg9Yjt0aGlzLmE9bmV3IEcoXCItXCIpO3RoaXMuaj0hMSE9PWIuZXZlbnRzO3RoaXMuZz0hMSE9PWIuY2xhc3Nlc31mdW5jdGlvbiBpYShhKXthLmcmJncoYS5mLFthLmEuYyhcIndmXCIsXCJsb2FkaW5nXCIpXSk7TChhLFwibG9hZGluZ1wiKX1mdW5jdGlvbiBNKGEpe2lmKGEuZyl7dmFyIGI9eShhLmYsYS5hLmMoXCJ3ZlwiLFwiYWN0aXZlXCIpKSxjPVtdLGQ9W2EuYS5jKFwid2ZcIixcImxvYWRpbmdcIildO2J8fGMucHVzaChhLmEuYyhcIndmXCIsXCJpbmFjdGl2ZVwiKSk7dyhhLmYsYyxkKX1MKGEsXCJpbmFjdGl2ZVwiKX1mdW5jdGlvbiBMKGEsYixjKXtpZihhLmomJmEuaFtiXSlpZihjKWEuaFtiXShjLmMsSyhjKSk7ZWxzZSBhLmhbYl0oKX07ZnVuY3Rpb24gamEoKXt0aGlzLmM9e319ZnVuY3Rpb24ga2EoYSxiLGMpe3ZhciBkPVtdLGU7Zm9yKGUgaW4gYilpZihiLmhhc093blByb3BlcnR5KGUpKXt2YXIgZj1hLmNbZV07ZiYmZC5wdXNoKGYoYltlXSxjKSl9cmV0dXJuIGR9O2Z1bmN0aW9uIE4oYSxiKXt0aGlzLmM9YTt0aGlzLmY9Yjt0aGlzLmE9dCh0aGlzLmMsXCJzcGFuXCIse1wiYXJpYS1oaWRkZW5cIjpcInRydWVcIn0sdGhpcy5mKX1mdW5jdGlvbiBPKGEpe3UoYS5jLFwiYm9keVwiLGEuYSl9ZnVuY3Rpb24gUChhKXtyZXR1cm5cImRpc3BsYXk6YmxvY2s7cG9zaXRpb246YWJzb2x1dGU7dG9wOi05OTk5cHg7bGVmdDotOTk5OXB4O2ZvbnQtc2l6ZTozMDBweDt3aWR0aDphdXRvO2hlaWdodDphdXRvO2xpbmUtaGVpZ2h0Om5vcm1hbDttYXJnaW46MDtwYWRkaW5nOjA7Zm9udC12YXJpYW50Om5vcm1hbDt3aGl0ZS1zcGFjZTpub3dyYXA7Zm9udC1mYW1pbHk6XCIrSihhLmMpK1wiO1wiKyhcImZvbnQtc3R5bGU6XCIrSShhKStcIjtmb250LXdlaWdodDpcIisoYS5mK1wiMDBcIikrXCI7XCIpfTtmdW5jdGlvbiBRKGEsYixjLGQsZSxmKXt0aGlzLmc9YTt0aGlzLmo9Yjt0aGlzLmE9ZDt0aGlzLmM9Yzt0aGlzLmY9ZXx8M0UzO3RoaXMuaD1mfHx2b2lkIDB9US5wcm90b3R5cGUuc3RhcnQ9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmMubS5kb2N1bWVudCxiPXRoaXMsYz1xKCksZD1uZXcgUHJvbWlzZShmdW5jdGlvbihkLGUpe2Z1bmN0aW9uIGsoKXtxKCktYz49Yi5mP2UoKTphLmZvbnRzLmxvYWQoZmEoYi5hKSxiLmgpLnRoZW4oZnVuY3Rpb24oYSl7MTw9YS5sZW5ndGg/ZCgpOnNldFRpbWVvdXQoaywyNSl9LGZ1bmN0aW9uKCl7ZSgpfSl9aygpfSksZT1uZXcgUHJvbWlzZShmdW5jdGlvbihhLGQpe3NldFRpbWVvdXQoZCxiLmYpfSk7UHJvbWlzZS5yYWNlKFtlLGRdKS50aGVuKGZ1bmN0aW9uKCl7Yi5nKGIuYSl9LGZ1bmN0aW9uKCl7Yi5qKGIuYSl9KX07ZnVuY3Rpb24gUihhLGIsYyxkLGUsZixnKXt0aGlzLnY9YTt0aGlzLkI9Yjt0aGlzLmM9Yzt0aGlzLmE9ZDt0aGlzLnM9Z3x8XCJCRVNic3d5XCI7dGhpcy5mPXt9O3RoaXMudz1lfHwzRTM7dGhpcy51PWZ8fG51bGw7dGhpcy5vPXRoaXMuaj10aGlzLmg9dGhpcy5nPW51bGw7dGhpcy5nPW5ldyBOKHRoaXMuYyx0aGlzLnMpO3RoaXMuaD1uZXcgTih0aGlzLmMsdGhpcy5zKTt0aGlzLmo9bmV3IE4odGhpcy5jLHRoaXMucyk7dGhpcy5vPW5ldyBOKHRoaXMuYyx0aGlzLnMpO2E9bmV3IEgodGhpcy5hLmMrXCIsc2VyaWZcIixLKHRoaXMuYSkpO2E9UChhKTt0aGlzLmcuYS5zdHlsZS5jc3NUZXh0PWE7YT1uZXcgSCh0aGlzLmEuYytcIixzYW5zLXNlcmlmXCIsSyh0aGlzLmEpKTthPVAoYSk7dGhpcy5oLmEuc3R5bGUuY3NzVGV4dD1hO2E9bmV3IEgoXCJzZXJpZlwiLEsodGhpcy5hKSk7YT1QKGEpO3RoaXMuai5hLnN0eWxlLmNzc1RleHQ9YTthPW5ldyBIKFwic2Fucy1zZXJpZlwiLEsodGhpcy5hKSk7YT1cclxuUChhKTt0aGlzLm8uYS5zdHlsZS5jc3NUZXh0PWE7Tyh0aGlzLmcpO08odGhpcy5oKTtPKHRoaXMuaik7Tyh0aGlzLm8pfXZhciBTPXtEOlwic2VyaWZcIixDOlwic2Fucy1zZXJpZlwifSxUPW51bGw7ZnVuY3Rpb24gVSgpe2lmKG51bGw9PT1UKXt2YXIgYT0vQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7VD0hIWEmJig1MzY+cGFyc2VJbnQoYVsxXSwxMCl8fDUzNj09PXBhcnNlSW50KGFbMV0sMTApJiYxMT49cGFyc2VJbnQoYVsyXSwxMCkpfXJldHVybiBUfVIucHJvdG90eXBlLnN0YXJ0PWZ1bmN0aW9uKCl7dGhpcy5mLnNlcmlmPXRoaXMuai5hLm9mZnNldFdpZHRoO3RoaXMuZltcInNhbnMtc2VyaWZcIl09dGhpcy5vLmEub2Zmc2V0V2lkdGg7dGhpcy5BPXEoKTtsYSh0aGlzKX07XHJcbmZ1bmN0aW9uIG1hKGEsYixjKXtmb3IodmFyIGQgaW4gUylpZihTLmhhc093blByb3BlcnR5KGQpJiZiPT09YS5mW1NbZF1dJiZjPT09YS5mW1NbZF1dKXJldHVybiEwO3JldHVybiExfWZ1bmN0aW9uIGxhKGEpe3ZhciBiPWEuZy5hLm9mZnNldFdpZHRoLGM9YS5oLmEub2Zmc2V0V2lkdGgsZDsoZD1iPT09YS5mLnNlcmlmJiZjPT09YS5mW1wic2Fucy1zZXJpZlwiXSl8fChkPVUoKSYmbWEoYSxiLGMpKTtkP3EoKS1hLkE+PWEudz9VKCkmJm1hKGEsYixjKSYmKG51bGw9PT1hLnV8fGEudS5oYXNPd25Qcm9wZXJ0eShhLmEuYykpP1YoYSxhLnYpOlYoYSxhLkIpOm5hKGEpOlYoYSxhLnYpfWZ1bmN0aW9uIG5hKGEpe3NldFRpbWVvdXQocChmdW5jdGlvbigpe2xhKHRoaXMpfSxhKSw1MCl9ZnVuY3Rpb24gVihhLGIpe3NldFRpbWVvdXQocChmdW5jdGlvbigpe3YodGhpcy5nLmEpO3YodGhpcy5oLmEpO3YodGhpcy5qLmEpO3YodGhpcy5vLmEpO2IodGhpcy5hKX0sYSksMCl9O2Z1bmN0aW9uIFcoYSxiLGMpe3RoaXMuYz1hO3RoaXMuYT1iO3RoaXMuZj0wO3RoaXMubz10aGlzLmo9ITE7dGhpcy5zPWN9dmFyIFg9bnVsbDtXLnByb3RvdHlwZS5nPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuYTtiLmcmJncoYi5mLFtiLmEuYyhcIndmXCIsYS5jLEsoYSkudG9TdHJpbmcoKSxcImFjdGl2ZVwiKV0sW2IuYS5jKFwid2ZcIixhLmMsSyhhKS50b1N0cmluZygpLFwibG9hZGluZ1wiKSxiLmEuYyhcIndmXCIsYS5jLEsoYSkudG9TdHJpbmcoKSxcImluYWN0aXZlXCIpXSk7TChiLFwiZm9udGFjdGl2ZVwiLGEpO3RoaXMubz0hMDtvYSh0aGlzKX07XHJcblcucHJvdG90eXBlLmg9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5hO2lmKGIuZyl7dmFyIGM9eShiLmYsYi5hLmMoXCJ3ZlwiLGEuYyxLKGEpLnRvU3RyaW5nKCksXCJhY3RpdmVcIikpLGQ9W10sZT1bYi5hLmMoXCJ3ZlwiLGEuYyxLKGEpLnRvU3RyaW5nKCksXCJsb2FkaW5nXCIpXTtjfHxkLnB1c2goYi5hLmMoXCJ3ZlwiLGEuYyxLKGEpLnRvU3RyaW5nKCksXCJpbmFjdGl2ZVwiKSk7dyhiLmYsZCxlKX1MKGIsXCJmb250aW5hY3RpdmVcIixhKTtvYSh0aGlzKX07ZnVuY3Rpb24gb2EoYSl7MD09LS1hLmYmJmEuaiYmKGEubz8oYT1hLmEsYS5nJiZ3KGEuZixbYS5hLmMoXCJ3ZlwiLFwiYWN0aXZlXCIpXSxbYS5hLmMoXCJ3ZlwiLFwibG9hZGluZ1wiKSxhLmEuYyhcIndmXCIsXCJpbmFjdGl2ZVwiKV0pLEwoYSxcImFjdGl2ZVwiKSk6TShhLmEpKX07ZnVuY3Rpb24gcGEoYSl7dGhpcy5qPWE7dGhpcy5hPW5ldyBqYTt0aGlzLmg9MDt0aGlzLmY9dGhpcy5nPSEwfXBhLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGEpe3RoaXMuYz1uZXcgY2EodGhpcy5qLGEuY29udGV4dHx8dGhpcy5qKTt0aGlzLmc9ITEhPT1hLmV2ZW50czt0aGlzLmY9ITEhPT1hLmNsYXNzZXM7cWEodGhpcyxuZXcgaGEodGhpcy5jLGEpLGEpfTtcclxuZnVuY3Rpb24gcmEoYSxiLGMsZCxlKXt2YXIgZj0wPT0tLWEuaDsoYS5mfHxhLmcpJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dmFyIGE9ZXx8bnVsbCxrPWR8fG51bGx8fHt9O2lmKDA9PT1jLmxlbmd0aCYmZilNKGIuYSk7ZWxzZXtiLmYrPWMubGVuZ3RoO2YmJihiLmo9Zik7dmFyIGgsbT1bXTtmb3IoaD0wO2g8Yy5sZW5ndGg7aCsrKXt2YXIgbD1jW2hdLG49a1tsLmNdLHI9Yi5hLHg9bDtyLmcmJncoci5mLFtyLmEuYyhcIndmXCIseC5jLEsoeCkudG9TdHJpbmcoKSxcImxvYWRpbmdcIildKTtMKHIsXCJmb250bG9hZGluZ1wiLHgpO3I9bnVsbDtudWxsPT09WCYmKFg9d2luZG93LkZvbnRGYWNlPyh4PS9HZWNrby4qRmlyZWZveFxcLyhcXGQrKS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCkpPzQyPHBhcnNlSW50KHhbMV0sMTApOiEwOiExKTtYP3I9bmV3IFEocChiLmcsYikscChiLmgsYiksYi5jLGwsYi5zLG4pOnI9bmV3IFIocChiLmcsYikscChiLmgsYiksYi5jLGwsYi5zLGEsXHJcbm4pO20ucHVzaChyKX1mb3IoaD0wO2g8bS5sZW5ndGg7aCsrKW1baF0uc3RhcnQoKX19LDApfWZ1bmN0aW9uIHFhKGEsYixjKXt2YXIgZD1bXSxlPWMudGltZW91dDtpYShiKTt2YXIgZD1rYShhLmEsYyxhLmMpLGY9bmV3IFcoYS5jLGIsZSk7YS5oPWQubGVuZ3RoO2I9MDtmb3IoYz1kLmxlbmd0aDtiPGM7YisrKWRbYl0ubG9hZChmdW5jdGlvbihiLGQsYyl7cmEoYSxmLGIsZCxjKX0pfTtmdW5jdGlvbiBzYShhLGIpe3RoaXMuYz1hO3RoaXMuYT1ifWZ1bmN0aW9uIHRhKGEsYixjKXt2YXIgZD16KGEuYyk7YT0oYS5hLmFwaXx8XCJmYXN0LmZvbnRzLm5ldC9qc2FwaVwiKS5yZXBsYWNlKC9eLipodHRwKHM/KTooXFwvXFwvKT8vLFwiXCIpO3JldHVybiBkK1wiLy9cIithK1wiL1wiK2IrXCIuanNcIisoYz9cIj92PVwiK2M6XCJcIil9XHJcbnNhLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGEpe2Z1bmN0aW9uIGIoKXtpZihmW1wiX19tdGlfZm50THN0XCIrZF0pe3ZhciBjPWZbXCJfX210aV9mbnRMc3RcIitkXSgpLGU9W10saDtpZihjKWZvcih2YXIgbT0wO208Yy5sZW5ndGg7bSsrKXt2YXIgbD1jW21dLmZvbnRmYW1pbHk7dm9pZCAwIT1jW21dLmZvbnRTdHlsZSYmdm9pZCAwIT1jW21dLmZvbnRXZWlnaHQ/KGg9Y1ttXS5mb250U3R5bGUrY1ttXS5mb250V2VpZ2h0LGUucHVzaChuZXcgSChsLGgpKSk6ZS5wdXNoKG5ldyBIKGwpKX1hKGUpfWVsc2Ugc2V0VGltZW91dChmdW5jdGlvbigpe2IoKX0sNTApfXZhciBjPXRoaXMsZD1jLmEucHJvamVjdElkLGU9Yy5hLnZlcnNpb247aWYoZCl7dmFyIGY9Yy5jLm07Qih0aGlzLmMsdGEoYyxkLGUpLGZ1bmN0aW9uKGUpe2U/YShbXSk6KGZbXCJfX01vbm90eXBlQ29uZmlndXJhdGlvbl9fXCIrZF09ZnVuY3Rpb24oKXtyZXR1cm4gYy5hfSxiKCkpfSkuaWQ9XCJfX01vbm90eXBlQVBJU2NyaXB0X19cIitcclxuZH1lbHNlIGEoW10pfTtmdW5jdGlvbiB1YShhLGIpe3RoaXMuYz1hO3RoaXMuYT1ifXVhLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGEpe3ZhciBiLGMsZD10aGlzLmEudXJsc3x8W10sZT10aGlzLmEuZmFtaWxpZXN8fFtdLGY9dGhpcy5hLnRlc3RTdHJpbmdzfHx7fSxnPW5ldyBDO2I9MDtmb3IoYz1kLmxlbmd0aDtiPGM7YisrKUEodGhpcy5jLGRbYl0sRChnKSk7dmFyIGs9W107Yj0wO2ZvcihjPWUubGVuZ3RoO2I8YztiKyspaWYoZD1lW2JdLnNwbGl0KFwiOlwiKSxkWzFdKWZvcih2YXIgaD1kWzFdLnNwbGl0KFwiLFwiKSxtPTA7bTxoLmxlbmd0aDttKz0xKWsucHVzaChuZXcgSChkWzBdLGhbbV0pKTtlbHNlIGsucHVzaChuZXcgSChkWzBdKSk7RihnLGZ1bmN0aW9uKCl7YShrLGYpfSl9O2Z1bmN0aW9uIHZhKGEsYixjKXthP3RoaXMuYz1hOnRoaXMuYz1iK3dhO3RoaXMuYT1bXTt0aGlzLmY9W107dGhpcy5nPWN8fFwiXCJ9dmFyIHdhPVwiLy9mb250cy5nb29nbGVhcGlzLmNvbS9jc3NcIjtmdW5jdGlvbiB4YShhLGIpe2Zvcih2YXIgYz1iLmxlbmd0aCxkPTA7ZDxjO2QrKyl7dmFyIGU9YltkXS5zcGxpdChcIjpcIik7Mz09ZS5sZW5ndGgmJmEuZi5wdXNoKGUucG9wKCkpO3ZhciBmPVwiXCI7Mj09ZS5sZW5ndGgmJlwiXCIhPWVbMV0mJihmPVwiOlwiKTthLmEucHVzaChlLmpvaW4oZikpfX1cclxuZnVuY3Rpb24geWEoYSl7aWYoMD09YS5hLmxlbmd0aCl0aHJvdyBFcnJvcihcIk5vIGZvbnRzIHRvIGxvYWQhXCIpO2lmKC0xIT1hLmMuaW5kZXhPZihcImtpdD1cIikpcmV0dXJuIGEuYztmb3IodmFyIGI9YS5hLmxlbmd0aCxjPVtdLGQ9MDtkPGI7ZCsrKWMucHVzaChhLmFbZF0ucmVwbGFjZSgvIC9nLFwiK1wiKSk7Yj1hLmMrXCI/ZmFtaWx5PVwiK2Muam9pbihcIiU3Q1wiKTswPGEuZi5sZW5ndGgmJihiKz1cIiZzdWJzZXQ9XCIrYS5mLmpvaW4oXCIsXCIpKTswPGEuZy5sZW5ndGgmJihiKz1cIiZ0ZXh0PVwiK2VuY29kZVVSSUNvbXBvbmVudChhLmcpKTtyZXR1cm4gYn07ZnVuY3Rpb24gemEoYSl7dGhpcy5mPWE7dGhpcy5hPVtdO3RoaXMuYz17fX1cclxudmFyIEFhPXtsYXRpbjpcIkJFU2Jzd3lcIixcImxhdGluLWV4dFwiOlwiXFx1MDBlN1xcdTAwZjZcXHUwMGZjXFx1MDExZlxcdTAxNWZcIixjeXJpbGxpYzpcIlxcdTA0MzlcXHUwNDRmXFx1MDQxNlwiLGdyZWVrOlwiXFx1MDNiMVxcdTAzYjJcXHUwM2EzXCIsa2htZXI6XCJcXHUxNzgwXFx1MTc4MVxcdTE3ODJcIixIYW51bWFuOlwiXFx1MTc4MFxcdTE3ODFcXHUxNzgyXCJ9LEJhPXt0aGluOlwiMVwiLGV4dHJhbGlnaHQ6XCIyXCIsXCJleHRyYS1saWdodFwiOlwiMlwiLHVsdHJhbGlnaHQ6XCIyXCIsXCJ1bHRyYS1saWdodFwiOlwiMlwiLGxpZ2h0OlwiM1wiLHJlZ3VsYXI6XCI0XCIsYm9vazpcIjRcIixtZWRpdW06XCI1XCIsXCJzZW1pLWJvbGRcIjpcIjZcIixzZW1pYm9sZDpcIjZcIixcImRlbWktYm9sZFwiOlwiNlwiLGRlbWlib2xkOlwiNlwiLGJvbGQ6XCI3XCIsXCJleHRyYS1ib2xkXCI6XCI4XCIsZXh0cmFib2xkOlwiOFwiLFwidWx0cmEtYm9sZFwiOlwiOFwiLHVsdHJhYm9sZDpcIjhcIixibGFjazpcIjlcIixoZWF2eTpcIjlcIixsOlwiM1wiLHI6XCI0XCIsYjpcIjdcIn0sQ2E9e2k6XCJpXCIsaXRhbGljOlwiaVwiLG46XCJuXCIsbm9ybWFsOlwiblwifSxcclxuRGE9L14odGhpbnwoPzooPzpleHRyYXx1bHRyYSktPyk/bGlnaHR8cmVndWxhcnxib29rfG1lZGl1bXwoPzooPzpzZW1pfGRlbWl8ZXh0cmF8dWx0cmEpLT8pP2JvbGR8YmxhY2t8aGVhdnl8bHxyfGJ8WzEtOV0wMCk/KG58aXxub3JtYWx8aXRhbGljKT8kLztcclxuZnVuY3Rpb24gRWEoYSl7Zm9yKHZhciBiPWEuZi5sZW5ndGgsYz0wO2M8YjtjKyspe3ZhciBkPWEuZltjXS5zcGxpdChcIjpcIiksZT1kWzBdLnJlcGxhY2UoL1xcKy9nLFwiIFwiKSxmPVtcIm40XCJdO2lmKDI8PWQubGVuZ3RoKXt2YXIgZzt2YXIgaz1kWzFdO2c9W107aWYoaylmb3IodmFyIGs9ay5zcGxpdChcIixcIiksaD1rLmxlbmd0aCxtPTA7bTxoO20rKyl7dmFyIGw7bD1rW21dO2lmKGwubWF0Y2goL15bXFx3LV0rJC8pKXt2YXIgbj1EYS5leGVjKGwudG9Mb3dlckNhc2UoKSk7aWYobnVsbD09bilsPVwiXCI7ZWxzZXtsPW5bMl07bD1udWxsPT1sfHxcIlwiPT1sP1wiblwiOkNhW2xdO249blsxXTtpZihudWxsPT1ufHxcIlwiPT1uKW49XCI0XCI7ZWxzZSB2YXIgcj1CYVtuXSxuPXI/cjppc05hTihuKT9cIjRcIjpuLnN1YnN0cigwLDEpO2w9W2wsbl0uam9pbihcIlwiKX19ZWxzZSBsPVwiXCI7bCYmZy5wdXNoKGwpfTA8Zy5sZW5ndGgmJihmPWcpOzM9PWQubGVuZ3RoJiYoZD1kWzJdLGc9W10sZD1kP2Quc3BsaXQoXCIsXCIpOlxyXG5nLDA8ZC5sZW5ndGgmJihkPUFhW2RbMF1dKSYmKGEuY1tlXT1kKSl9YS5jW2VdfHwoZD1BYVtlXSkmJihhLmNbZV09ZCk7Zm9yKGQ9MDtkPGYubGVuZ3RoO2QrPTEpYS5hLnB1c2gobmV3IEgoZSxmW2RdKSl9fTtmdW5jdGlvbiBGYShhLGIpe3RoaXMuYz1hO3RoaXMuYT1ifXZhciBHYT17QXJpbW86ITAsQ291c2luZTohMCxUaW5vczohMH07RmEucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oYSl7dmFyIGI9bmV3IEMsYz10aGlzLmMsZD1uZXcgdmEodGhpcy5hLmFwaSx6KGMpLHRoaXMuYS50ZXh0KSxlPXRoaXMuYS5mYW1pbGllczt4YShkLGUpO3ZhciBmPW5ldyB6YShlKTtFYShmKTtBKGMseWEoZCksRChiKSk7RihiLGZ1bmN0aW9uKCl7YShmLmEsZi5jLEdhKX0pfTtmdW5jdGlvbiBIYShhLGIpe3RoaXMuYz1hO3RoaXMuYT1ifUhhLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuYS5pZCxjPXRoaXMuYy5tO2I/Qih0aGlzLmMsKHRoaXMuYS5hcGl8fFwiaHR0cHM6Ly91c2UudHlwZWtpdC5uZXRcIikrXCIvXCIrYitcIi5qc1wiLGZ1bmN0aW9uKGIpe2lmKGIpYShbXSk7ZWxzZSBpZihjLlR5cGVraXQmJmMuVHlwZWtpdC5jb25maWcmJmMuVHlwZWtpdC5jb25maWcuZm4pe2I9Yy5UeXBla2l0LmNvbmZpZy5mbjtmb3IodmFyIGU9W10sZj0wO2Y8Yi5sZW5ndGg7Zis9Milmb3IodmFyIGc9YltmXSxrPWJbZisxXSxoPTA7aDxrLmxlbmd0aDtoKyspZS5wdXNoKG5ldyBIKGcsa1toXSkpO3RyeXtjLlR5cGVraXQubG9hZCh7ZXZlbnRzOiExLGNsYXNzZXM6ITEsYXN5bmM6ITB9KX1jYXRjaChtKXt9YShlKX19LDJFMyk6YShbXSl9O2Z1bmN0aW9uIElhKGEsYil7dGhpcy5jPWE7dGhpcy5mPWI7dGhpcy5hPVtdfUlhLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuZi5pZCxjPXRoaXMuYy5tLGQ9dGhpcztiPyhjLl9fd2ViZm9udGZvbnRkZWNrbW9kdWxlX198fChjLl9fd2ViZm9udGZvbnRkZWNrbW9kdWxlX189e30pLGMuX193ZWJmb250Zm9udGRlY2ttb2R1bGVfX1tiXT1mdW5jdGlvbihiLGMpe2Zvcih2YXIgZz0wLGs9Yy5mb250cy5sZW5ndGg7ZzxrOysrZyl7dmFyIGg9Yy5mb250c1tnXTtkLmEucHVzaChuZXcgSChoLm5hbWUsZ2EoXCJmb250LXdlaWdodDpcIitoLndlaWdodCtcIjtmb250LXN0eWxlOlwiK2guc3R5bGUpKSl9YShkLmEpfSxCKHRoaXMuYyx6KHRoaXMuYykrKHRoaXMuZi5hcGl8fFwiLy9mLmZvbnRkZWNrLmNvbS9zL2Nzcy9qcy9cIikrZWEodGhpcy5jKStcIi9cIitiK1wiLmpzXCIsZnVuY3Rpb24oYil7YiYmYShbXSl9KSk6YShbXSl9O3ZhciBZPW5ldyBwYSh3aW5kb3cpO1kuYS5jLmN1c3RvbT1mdW5jdGlvbihhLGIpe3JldHVybiBuZXcgdWEoYixhKX07WS5hLmMuZm9udGRlY2s9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbmV3IElhKGIsYSl9O1kuYS5jLm1vbm90eXBlPWZ1bmN0aW9uKGEsYil7cmV0dXJuIG5ldyBzYShiLGEpfTtZLmEuYy50eXBla2l0PWZ1bmN0aW9uKGEsYil7cmV0dXJuIG5ldyBIYShiLGEpfTtZLmEuYy5nb29nbGU9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbmV3IEZhKGIsYSl9O3ZhciBaPXtsb2FkOnAoWS5sb2FkLFkpfTtcImZ1bmN0aW9uXCI9PT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShmdW5jdGlvbigpe3JldHVybiBafSk6XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzP21vZHVsZS5leHBvcnRzPVo6KHdpbmRvdy5XZWJGb250PVosd2luZG93LldlYkZvbnRDb25maWcmJlkubG9hZCh3aW5kb3cuV2ViRm9udENvbmZpZykpO30oKSk7XHJcbiIsImltcG9ydCAnYmFiZWwtcG9seWZpbGwnO1xyXG5cclxubGV0IGdvb2dsZVRyYW5zbGF0ZUxvYWRlZCA9IGZhbHNlO1xyXG5sZXQgcmVzZXRRdWVyeSA9IGZhbHNlO1xyXG4vKipcclxuICogVHJhbnNsYXRlIGNsYXNzXHJcbiAqIEB0eXBlIHtUcmFuc2xhdGV9XHJcbiAqL1xyXG5jb25zdCBUcmFuc2xhdGUgPSBjbGFzcyB7XHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICAgICAgICAnY2xpY2snLFxyXG4gICAgICAgICAgICBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFldmVudC50YXJnZXQubWF0Y2hlcygnLnRyYW5zbGF0ZS1pY29uLWJ0bicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLnNob3VsZExvYWRTY3JpcHQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZmV0Y2hTY3JpcHQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZmFsc2VcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICAgICAgICAnY2hhbmdlJyxcclxuICAgICAgICAgICAgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQubWF0Y2hlcygnc2VsZWN0Lmdvb2ctdGUtY29tYm8nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlYXJjaFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoUGFyYW1zLnNldCgndHJhbnNsYXRlJywgZXZlbnQudGFyZ2V0LnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdSZWxhdGl2ZVBhdGhRdWVyeSA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArICc/JyArIHNlYXJjaFBhcmFtcy50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsICcnLCBuZXdSZWxhdGl2ZVBhdGhRdWVyeSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yZXdyaXRlTGlua3MoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC52YWx1ZSA9PT0gJ3N2Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYWZ0ZXJEb21haW4gPSB1cmwuc3Vic3RyaW5nKHVybC5sYXN0SW5kZXhPZignLycpICsgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJlZm9yZVF1ZXJ5U3RyaW5nID0gYWZ0ZXJEb21haW4uc3BsaXQoJz8nKVswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ29iamVjdCBvciBzdHJpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1RpdGxlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcvJyArIGJlZm9yZVF1ZXJ5U3RyaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5jb29raWUgPSAnZ29vZ3RyYW5zPTsgZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAxIEdNVDsnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNldFF1ZXJ5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yZXdyaXRlTGlua3MoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZhbHNlXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2hvdWxkTG9hZFNjcmlwdCgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hTY3JpcHQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiBzY3JpcHQgaXMgbG9hZGVkXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgc2hvdWxkTG9hZFNjcmlwdCgpIHtcclxuICAgICAgICBpZiAoZ29vZ2xlVHJhbnNsYXRlTG9hZGVkID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZi5pbmRleE9mKCd0cmFuc2xhdGU9JykgPiAtMSB8fFxyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCArICd0cmFuc2xhdGUnXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmV0Y2hpbmcgc2NyaXB0IGZyb20gR29vZ2xlXHJcbiAgICAgKi9cclxuICAgIGZldGNoU2NyaXB0KCkge1xyXG4gICAgICAgIGNvbnN0IGxvYWRTY3JpcHQgPSAoc291cmNlLCBiZWZvcmVFbGVtZW50LCBhc3luYyA9IHRydWUsIGRlZmVyID0gdHJ1ZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJpb3IgPSBiZWZvcmVFbGVtZW50IHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcclxuXHJcbiAgICAgICAgICAgICAgICBzY3JpcHQuYXN5bmMgPSBhc3luYztcclxuICAgICAgICAgICAgICAgIHNjcmlwdC5kZWZlciA9IGRlZmVyO1xyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIG9ubG9hZEhhbmRlcihfLCBpc0Fib3J0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0Fib3J0IHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICFzY3JpcHQucmVhZHlTdGF0ZSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvbG9hZGVkfGNvbXBsZXRlLy50ZXN0KHNjcmlwdC5yZWFkeVN0YXRlKVxyXG4gICAgICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHQub25sb2FkID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcmlwdCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0Fib3J0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBzY3JpcHQub25sb2FkID0gb25sb2FkSGFuZGVyO1xyXG4gICAgICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG9ubG9hZEhhbmRlcjtcclxuXHJcbiAgICAgICAgICAgICAgICBzY3JpcHQuc3JjID0gc291cmNlO1xyXG4gICAgICAgICAgICAgICAgcHJpb3IucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc2NyaXB0LCBwcmlvcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IHNjcmlwdFVybCA9XHJcbiAgICAgICAgICAgICcvL3RyYW5zbGF0ZS5nb29nbGUuY29tL3RyYW5zbGF0ZV9hL2VsZW1lbnQuanM/Y2I9Z29vZ2xlVHJhbnNsYXRlRWxlbWVudEluaXQnO1xyXG5cclxuICAgICAgICBsb2FkU2NyaXB0KHNjcmlwdFVybCkudGhlbihcclxuICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXdyaXRlTGlua3MoKTtcclxuICAgICAgICAgICAgICAgIGdvb2dsZVRyYW5zbGF0ZUxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gbG9hZCBUcmFuc2xhdGUgc2NyaXB0IGZyb20gR29vZ2xlIScpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqICBSZXdyaXRpbmcgYWxsIGxpbmtzXHJcbiAgICAgKi9cclxuICAgIHJld3JpdGVMaW5rcygpIHtcclxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgICAgICBjb25zdCBzZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGRvY3VtZW50LmxvY2F0aW9uLnNlYXJjaCk7XHJcbiAgICAgICAgY29uc3QgY2hhbmdlTGFuZyA9IHNlYXJjaFBhcmFtcy5nZXQoJ3RyYW5zbGF0ZScpO1xyXG5cclxuICAgICAgICBpZiAoY2hhbmdlTGFuZyAhPT0gJ251bGwnICYmIGNoYW5nZUxhbmcgIT09ICcnICYmIGNoYW5nZUxhbmcgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgW10uZm9yRWFjaC5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2EnKSwgZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGhyZWZVcmwgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICBocmVmVXJsID09IG51bGwgfHxcclxuICAgICAgICAgICAgICAgICAgICBocmVmVXJsLmluZGV4T2YobG9jYXRpb24ub3JpZ2luKSA9PT0gLTEgfHxcclxuICAgICAgICAgICAgICAgICAgICBocmVmVXJsLnN1YnN0cigwLCAxKSA9PT0gJyMnXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNoYW5nZUxhbmcgIT09ICd0cnVlJyAmJiByZXNldFF1ZXJ5ICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaHJlZlVybCA9IHNlbGYucGFyc2VMaW5rRGF0YShocmVmVXJsLCAndHJhbnNsYXRlJywgY2hhbmdlTGFuZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmVXJsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzZXRRdWVyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnaHJlZicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyhbJlxcP11rZXk9dmFsKiR8a2V5PXZhbCZ8Wz8mXWtleT12YWwoPz0jKSkvLCAnJylcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQYXJzaW5nIGxpbmsgd2l0aCBrZXlzIGFuZCB2YWx1ZXNcclxuICAgICAqIEBwYXJhbSB1cmlcclxuICAgICAqIEBwYXJhbSBrZXlcclxuICAgICAqIEBwYXJhbSB2YWx1ZVxyXG4gICAgICogQHJldHVybnMge3N0cmluZ3wqfVxyXG4gICAgICovXHJcbiAgICBwYXJzZUxpbmtEYXRhKHVyaSwga2V5LCB2YWx1ZSkge1xyXG4gICAgICAgIGNvbnN0IHJlID0gbmV3IFJlZ0V4cCgnKFs/Jl0pJyArIGtleSArICc9Lio/KCZ8JCknLCAnaScpO1xyXG4gICAgICAgIGNvbnN0IHNlcGFyYXRvciA9IHVyaS5pbmRleE9mKCc/JykgIT09IC0xID8gJyYnIDogJz8nO1xyXG5cclxuICAgICAgICBpZiAodXJpLm1hdGNoKHJlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdXJpLnJlcGxhY2UocmUsICckMScgKyBrZXkgKyAnPScgKyB2YWx1ZSArICckMicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHVyaSArIHNlcGFyYXRvciArIGtleSArICc9JyArIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogIEdldCBnb29nbGUgY29va2llXHJcbiAgICAgKiBAcGFyYW0gY25hbWVcclxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIGdldENvb2tpZShjbmFtZSkge1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBjbmFtZSArICc9JztcclxuICAgICAgICBjb25zdCBjYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGMgPSBjYVtpXTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChjLmNoYXJBdCgwKSA9PT0gJyAnKSB7XHJcbiAgICAgICAgICAgICAgICBjID0gYy5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjLmluZGV4T2YobmFtZSkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjLnN1YnN0cmluZyhuYW1lLmxlbmd0aCwgYy5sZW5ndGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAnJztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIHRyYW5zbGF0aW9uIGlzIG9uIGxvYWRcclxuICAgICAqL1xyXG4gICAgY2hlY2tMYW5ndWFnZU9uTG9hZCgpIHtcclxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoZG9jdW1lbnQubG9jYXRpb24uc2VhcmNoKTtcclxuICAgICAgICAgICAgY29uc3QgY2hhbmdlTGFuZyA9IHNlYXJjaFBhcmFtcy5nZXQoJ3RyYW5zbGF0ZScpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNrRG9tYWluO1xyXG4gICAgICAgICAgICBmb3IgKGNrRG9tYWluID0gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lLnNwbGl0KCcuJyk7IDIgPCBja0RvbWFpbi5sZW5ndGg7ICkge1xyXG4gICAgICAgICAgICAgICAgY2tEb21haW4uc2hpZnQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY2tEb21haW4gPSAnO2RvbWFpbj0nICsgY2tEb21haW4uam9pbignLicpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNoYW5nZUxhbmcgIT09ICdzdicpIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9XHJcbiAgICAgICAgICAgICAgICAgICAgJ2dvb2d0cmFucz0vJyArXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlTGFuZyArXHJcbiAgICAgICAgICAgICAgICAgICAgJy8nICtcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VMYW5nICtcclxuICAgICAgICAgICAgICAgICAgICAnOyBleHBpcmVzPVRodSwgMDctTWFyLTIwNDcgMjA6MjI6NDAgR01UOyBwYXRoPS8nICtcclxuICAgICAgICAgICAgICAgICAgICBja0RvbWFpbjtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9XHJcbiAgICAgICAgICAgICAgICAgICAgJ2dvb2d0cmFucz0vJyArXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlTGFuZyArXHJcbiAgICAgICAgICAgICAgICAgICAgJy8nICtcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VMYW5nICtcclxuICAgICAgICAgICAgICAgICAgICAnOyBleHBpcmVzPVRodSwgMDctTWFyLTIwNDcgMjA6MjI6NDAgR01UOyBwYXRoPS8nO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuY29va2llID0gJ2dvb2d0cmFucz07IGV4cGlyZXM9VGh1LCAwMSBKYW4gMTk3MCAwMDowMDowMSBHTVQ7JztcclxuICAgICAgICAgICAgICAgIHJlc2V0UXVlcnkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5yZXdyaXRlTGlua3MoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgR2V0VHJhbnNsYXRlID0gbmV3IFRyYW5zbGF0ZSgpO1xyXG5HZXRUcmFuc2xhdGUuY2hlY2tMYW5ndWFnZU9uTG9hZCgpO1xyXG4iLCJ2YXIgTXVuaWNpcGlvID0gTXVuaWNpcGlvIHx8IHt9O1xyXG5NdW5pY2lwaW8uSGVscGVyID0gTXVuaWNpcGlvLkhlbHBlciB8fCB7fTtcclxuXHJcbk11bmljaXBpby5IZWxwZXIuTWFpbkNvbnRhaW5lciA9IChmdW5jdGlvbigkKSB7XHJcbiAgICBmdW5jdGlvbiBNYWluQ29udGFpbmVyKCkge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlTWFpbkNvbnRhaW5lcigpO1xyXG4gICAgfVxyXG5cclxuICAgIE1haW5Db250YWluZXIucHJvdG90eXBlLnJlbW92ZU1haW5Db250YWluZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoJC50cmltKCQoJyNtYWluLWNvbnRlbnQnKS5odG1sKCkpID09ICcnKSB7XHJcbiAgICAgICAgICAgICQoJyNtYWluLWNvbnRlbnQnKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIG5ldyBNYWluQ29udGFpbmVyKCk7XHJcbn0pKGpRdWVyeSk7XHJcbiIsInZhciBNdW5jaXBpbyA9IE11bmNpcGlvIHx8IHt9O1xyXG5NdW5jaXBpby5BamF4ID0gTXVuY2lwaW8uQWpheCB8fCB7fTtcclxuXHJcbk11bmNpcGlvLkFqYXguTGlrZUJ1dHRvbiA9IChmdW5jdGlvbigkKSB7XHJcbiAgICBmdW5jdGlvbiBMaWtlKCkge1xyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIExpa2UucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKCdhLmxpa2UtYnV0dG9uJykub24oXHJcbiAgICAgICAgICAgICdjbGljaycsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWpheENhbGwoZS50YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcylcclxuICAgICAgICApO1xyXG4gICAgfTtcclxuXHJcbiAgICBMaWtlLnByb3RvdHlwZS5hamF4Q2FsbCA9IGZ1bmN0aW9uKGxpa2VCdXR0b24pIHtcclxuICAgICAgICB2YXIgY29tbWVudF9pZCA9ICQobGlrZUJ1dHRvbikuZGF0YSgnY29tbWVudC1pZCcpO1xyXG4gICAgICAgIHZhciBjb3VudGVyID0gJCgnc3BhbiNsaWtlLWNvdW50JywgbGlrZUJ1dHRvbik7XHJcbiAgICAgICAgdmFyIGJ1dHRvbiA9ICQobGlrZUJ1dHRvbik7XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogbGlrZUJ1dHRvbkRhdGEuYWpheF91cmwsXHJcbiAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAnYWpheExpa2VNZXRob2QnLFxyXG4gICAgICAgICAgICAgICAgY29tbWVudF9pZDogY29tbWVudF9pZCxcclxuICAgICAgICAgICAgICAgIG5vbmNlOiBsaWtlQnV0dG9uRGF0YS5ub25jZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGlrZXMgPSBjb3VudGVyLmh0bWwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYnV0dG9uLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpa2VzLS07XHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlrZXMrKztcclxuICAgICAgICAgICAgICAgICAgICBidXR0b24udG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvdW50ZXIuaHRtbChsaWtlcyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7fSxcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIG5ldyBMaWtlKCk7XHJcbn0pKCQpO1xyXG4iLCJ2YXIgTXVuY2lwaW8gPSBNdW5jaXBpbyB8fCB7fTtcclxuTXVuY2lwaW8uQWpheCA9IE11bmNpcGlvLkFqYXggfHwge307XHJcblxyXG5NdW5jaXBpby5BamF4LlNoYXJlRW1haWwgPSAoZnVuY3Rpb24oJCkge1xyXG4gICAgZnVuY3Rpb24gU2hhcmVFbWFpbCgpIHtcclxuICAgICAgICAkKFxyXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXZlbnRzKCk7XHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIYW5kbGUgZXZlbnRzXHJcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxyXG4gICAgICovXHJcbiAgICBTaGFyZUVtYWlsLnByb3RvdHlwZS5oYW5kbGVFdmVudHMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKGRvY3VtZW50KS5vbihcclxuICAgICAgICAgICAgJ3N1Ym1pdCcsXHJcbiAgICAgICAgICAgICcuc29jaWFsLXNoYXJlLWVtYWlsJyxcclxuICAgICAgICAgICAgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGFyZShlKTtcclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXHJcbiAgICAgICAgKTtcclxuICAgIH07XHJcblxyXG4gICAgU2hhcmVFbWFpbC5wcm90b3R5cGUuc2hhcmUgPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIHZhciAkdGFyZ2V0ID0gJChldmVudC50YXJnZXQpLFxyXG4gICAgICAgICAgICBkYXRhID0gbmV3IEZvcm1EYXRhKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgICAgZGF0YS5hcHBlbmQoJ2FjdGlvbicsICdzaGFyZV9lbWFpbCcpO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6IGFqYXh1cmwsXHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG4gICAgICAgICAgICBjb250ZW50VHlwZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJHRhcmdldFxyXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCcubW9kYWwtZm9vdGVyJylcclxuICAgICAgICAgICAgICAgICAgICAucHJlcGVuZChcclxuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJsb2FkaW5nXCI+PGRpdj48L2Rpdj48ZGl2PjwvZGl2PjxkaXY+PC9kaXY+PGRpdj48L2Rpdj48L2Rpdj4nXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICR0YXJnZXQuZmluZCgnLm5vdGljZScpLmhpZGUoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UsIHRleHRTdGF0dXMsIGpxWEhSKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5tb2RhbC1mb290ZXInLCAkdGFyZ2V0KS5wcmVwZW5kKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJub3RpY2Ugc3VjY2VzcyBndXR0ZXIgZ3V0dGVyLW1hcmdpbiBndXR0ZXItdmVydGljYWxcIj48aSBjbGFzcz1cInByaWNvbiBwcmljb24tY2hlY2tcIj48L2k+ICcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YSArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9zcGFuPidcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5oYXNoID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR0YXJnZXQuZmluZCgnLm5vdGljZScpLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCAzMDAwKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLm1vZGFsLWZvb3RlcicsICR0YXJnZXQpLnByZXBlbmQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cIm5vdGljZSB3YXJuaW5nIGd1dHRlciBndXR0ZXItbWFyZ2luIGd1dHRlci12ZXJ0aWNhbFwiPjxpIGNsYXNzPVwicHJpY29uIHByaWNvbi1ub3RpY2Utd2FybmluZ1wiPjwvaT4gJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5kYXRhICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L3NwYW4+J1xyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICR0YXJnZXQuZmluZCgnLmxvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIG5ldyBTaGFyZUVtYWlsKCk7XHJcbn0pKGpRdWVyeSk7XHJcbiIsInZhciBNdW5jaXBpbyA9IE11bmNpcGlvIHx8IHt9O1xyXG5NdW5jaXBpby5BamF4ID0gTXVuY2lwaW8uQWpheCB8fCB7fTtcclxuXHJcbk11bmNpcGlvLkFqYXguU3VnZ2VzdGlvbnMgPSAoZnVuY3Rpb24oJCkge1xyXG4gICAgdmFyIHR5cGluZ1RpbWVyO1xyXG4gICAgdmFyIGxhc3RUZXJtO1xyXG5cclxuICAgIGZ1bmN0aW9uIFN1Z2dlc3Rpb25zKCkge1xyXG4gICAgICAgIGlmICghJCgnI2ZpbHRlci1rZXl3b3JkJykubGVuZ3RoIHx8IEhiZ1ByaW1lQXJncy5hcGkucG9zdFR5cGVSZXN0VXJsID09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCgnI2ZpbHRlci1rZXl3b3JkJykuYXR0cignYXV0b2NvbXBsZXRlJywgJ29mZicpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlRXZlbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgU3VnZ2VzdGlvbnMucHJvdG90eXBlLmhhbmRsZUV2ZW50cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKFxyXG4gICAgICAgICAgICAna2V5ZG93bicsXHJcbiAgICAgICAgICAgICcjZmlsdGVyLWtleXdvcmQnLFxyXG4gICAgICAgICAgICBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSAkKGUudGFyZ2V0KSxcclxuICAgICAgICAgICAgICAgICAgICAkc2VsZWN0ZWQgPSAkKCcuc2VsZWN0ZWQnLCAnI3NlYXJjaC1zdWdnZXN0aW9ucycpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgkc2VsZWN0ZWQuc2libGluZ3MoKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI3NlYXJjaC1zdWdnZXN0aW9ucyBsaScpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gMjcpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBLZXkgcHJlc3NlZDogRXNjXHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI3NlYXJjaC1zdWdnZXN0aW9ucycpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gS2V5IHByZXNzZWQ6IEVudGVyXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT0gMzgpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBLZXkgcHJlc3NlZDogVXBcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJHNlbGVjdGVkLnByZXYoKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2VsZWN0ZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zaWJsaW5ncygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAubGFzdCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNlbGVjdGVkLnByZXYoKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICR0aGlzLnZhbCgkKCcuc2VsZWN0ZWQnLCAnI3NlYXJjaC1zdWdnZXN0aW9ucycpLnRleHQoKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PSA0MCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEtleSBwcmVzc2VkOiBEb3duXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRzZWxlY3RlZC5uZXh0KCkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNlbGVjdGVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2libGluZ3MoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpcnN0KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2VsZWN0ZWQubmV4dCgpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMudmFsKCQoJy5zZWxlY3RlZCcsICcjc2VhcmNoLXN1Z2dlc3Rpb25zJykudGV4dCgpKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRG8gdGhlIHNlYXJjaFxyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0eXBpbmdUaW1lcik7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwaW5nVGltZXIgPSBzZXRUaW1lb3V0KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoKCR0aGlzLnZhbCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAxMDBcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LmJpbmQodGhpcylcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50KS5vbihcclxuICAgICAgICAgICAgJ2NsaWNrJyxcclxuICAgICAgICAgICAgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCEkKGUudGFyZ2V0KS5jbG9zZXN0KCcjc2VhcmNoLXN1Z2dlc3Rpb25zJykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI3NlYXJjaC1zdWdnZXN0aW9ucycpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LmJpbmQodGhpcylcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50KS5vbihcclxuICAgICAgICAgICAgJ2NsaWNrJyxcclxuICAgICAgICAgICAgJyNzZWFyY2gtc3VnZ2VzdGlvbnMgbGknLFxyXG4gICAgICAgICAgICBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcjc2VhcmNoLXN1Z2dlc3Rpb25zJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAkKCcjZmlsdGVyLWtleXdvcmQnKVxyXG4gICAgICAgICAgICAgICAgICAgIC52YWwoJChlLnRhcmdldCkudGV4dCgpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5wYXJlbnRzKCdmb3JtJylcclxuICAgICAgICAgICAgICAgICAgICAuc3VibWl0KCk7XHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxyXG4gICAgICAgICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybXMgdGhlIHNlYXJjaCBmb3Igc2ltaWxhciB0aXRsZXMrY29udGVudFxyXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSB0ZXJtIFNlYXJjaCB0ZXJtXHJcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxyXG4gICAgICovXHJcbiAgICBTdWdnZXN0aW9ucy5wcm90b3R5cGUuc2VhcmNoID0gZnVuY3Rpb24odGVybSkge1xyXG4gICAgICAgIGlmICh0ZXJtID09PSBsYXN0VGVybSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGVybS5sZW5ndGggPCA0KSB7XHJcbiAgICAgICAgICAgICQoJyNzZWFyY2gtc3VnZ2VzdGlvbnMnKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2V0IGxhc3QgdGVybSB0byB0aGUgY3VycmVudCB0ZXJtXHJcbiAgICAgICAgbGFzdFRlcm0gPSB0ZXJtO1xyXG5cclxuICAgICAgICAvLyBHZXQgQVBJIGVuZHBvaW50IGZvciBwZXJmb3JtaW5nIHRoZSBzZWFyY2hcclxuICAgICAgICB2YXIgcmVxdWVzdFVybCA9IEhiZ1ByaW1lQXJncy5hcGkucG9zdFR5cGVSZXN0VXJsICsgJz9wZXJfcGFnZT02JnNlYXJjaD0nICsgdGVybTtcclxuXHJcbiAgICAgICAgLy8gRG8gdGhlIHNlYXJjaCByZXF1ZXN0XHJcbiAgICAgICAgJC5nZXQoXHJcbiAgICAgICAgICAgIHJlcXVlc3RVcmwsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJyNzZWFyY2gtc3VnZ2VzdGlvbnMnKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5vdXRwdXQocmVzcG9uc2UsIHRlcm0pO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgICdKU09OJ1xyXG4gICAgICAgICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3V0cHV0cyB0aGUgc3VnZ2VzdGlvbnNcclxuICAgICAqIEBwYXJhbSAge2FycmF5fSBzdWdnZXN0aW9uc1xyXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSB0ZXJtXHJcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxyXG4gICAgICovXHJcbiAgICBTdWdnZXN0aW9ucy5wcm90b3R5cGUub3V0cHV0ID0gZnVuY3Rpb24oc3VnZ2VzdGlvbnMsIHRlcm0pIHtcclxuICAgICAgICB2YXIgJHN1Z2dlc3Rpb25zID0gJCgnI3NlYXJjaC1zdWdnZXN0aW9ucycpO1xyXG5cclxuICAgICAgICBpZiAoISRzdWdnZXN0aW9ucy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJHN1Z2dlc3Rpb25zID0gJCgnPGRpdiBpZD1cInNlYXJjaC1zdWdnZXN0aW9uc1wiPjx1bD48L3VsPjwvZGl2PicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCgndWwnLCAkc3VnZ2VzdGlvbnMpLmVtcHR5KCk7XHJcbiAgICAgICAgJC5lYWNoKHN1Z2dlc3Rpb25zLCBmdW5jdGlvbihpbmRleCwgc3VnZ2VzdGlvbikge1xyXG4gICAgICAgICAgICAkKCd1bCcsICRzdWdnZXN0aW9ucykuYXBwZW5kKCc8bGk+JyArIHN1Z2dlc3Rpb24udGl0bGUucmVuZGVyZWQgKyAnPC9saT4nKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCgnbGknLCAkc3VnZ2VzdGlvbnMpXHJcbiAgICAgICAgICAgIC5maXJzdCgpXHJcbiAgICAgICAgICAgIC5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcclxuXHJcbiAgICAgICAgJCgnI2ZpbHRlci1rZXl3b3JkJylcclxuICAgICAgICAgICAgLnBhcmVudCgpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJHN1Z2dlc3Rpb25zKTtcclxuICAgICAgICAkc3VnZ2VzdGlvbnMuc2xpZGVEb3duKDIwMCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBuZXcgU3VnZ2VzdGlvbnMoKTtcclxufSkoalF1ZXJ5KTtcclxuIl19
