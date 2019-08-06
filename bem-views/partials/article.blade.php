<?php global $post; ?>
<article class="c-article s-article u-mb-4">
    <h1>{{ the_title() }}</h1>

    @include('partials.accessibility-menu')

    @if (get_field('post_single_show_featured_image') === true)
        <img src="{{ municipio_get_thumbnail_source(null, array(700,700)) }}" alt="{{ the_title() }}">
    @endif

    @if (post_password_required($post))
        {!! get_the_password_form() !!}
    @else
        @if (isset(get_extended($post->post_content)['main']) && strlen(get_extended($post->post_content)['main']) > 0 && isset(get_extended($post->post_content)['extended']) && strlen(get_extended($post->post_content)['extended']) > 0)

            {!! apply_filters('the_lead', get_extended($post->post_content)['main']) !!}
            {!! apply_filters('the_content', get_extended($post->post_content)['extended']) !!}

        @else
            @if (substr($post->post_content, -11) == '<!--more-->')
            {!! apply_filters('the_lead', get_extended($post->post_content)['main']) !!}
            @else
            {!! the_content() !!}
            @endif

        @endif
    @endif

</article>
