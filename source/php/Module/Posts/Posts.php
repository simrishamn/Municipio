<?php

namespace Modularity\Module\Posts;

class Posts extends \Modularity\Module
{
    /**
     * Constructor
     */
    public function __construct()
    {
        // This will register the module
        $this->register(
            'posts',
            'Posts',
            'Posts',
            'Outputs selected posts in specified layout',
            array(),
            'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNC4zMzQgMjQuMzM0Ij48ZyBmaWxsPSIjMDMwMTA0Ij48cGF0aCBkPSJNMTAuMjk1IDBILjkzNUEuOTM2LjkzNiAwIDAgMCAwIC45MzZ2OS4zNmMwIC41MTYuNDIuOTM1LjkzNi45MzVoOS4zNmMuNTE2IDAgLjkzNS0uNDE4LjkzNS0uOTM1Vi45MzVBLjkzNi45MzYgMCAwIDAgMTAuMjk2IDB6TTIzLjM5OCAwaC05LjM2YS45MzYuOTM2IDAgMCAwLS45MzUuOTM2djkuMzZjMCAuNTE2LjQyLjkzNS45MzYuOTM1aDkuMzU4Yy41MTcgMCAuOTM2LS40MTguOTM2LS45MzVWLjkzNUEuOTM2LjkzNiAwIDAgMCAyMy4zOTggMHptLS45MzYgOS4zNmgtNy40ODdWMS44N2g3LjQ4N1Y5LjM2ek0xMC4yOTUgMTMuMTAzSC45MzVBLjkzNi45MzYgMCAwIDAgMCAxNC4wNHY5LjM1OGMwIC41MTcuNDIuOTM2LjkzNi45MzZoOS4zNmMuNTE2IDAgLjkzNS0uNDIuOTM1LS45MzZ2LTkuMzZhLjkzNS45MzUgMCAwIDAtLjkzNS0uOTM1em0tNS44NzUgOS4zNmMuMTYtLjI3Ny4yNi0uNTk0LjI2LS45MzdhMS44NzIgMS44NzIgMCAwIDAtMS44NzItMS44NzJjLS4zNDMgMC0uNjYuMS0uOTM2LjI2di0yLjM5Yy4yNzYuMTYuNTkzLjI2LjkzNi4yNkExLjg3MiAxLjg3MiAwIDAgMCA0LjY4IDE1LjkxYzAtLjM0Mi0uMS0uNjYtLjI2LS45MzVoMi4zOWExLjg1IDEuODUgMCAwIDAtLjI2LjkzNmMwIDEuMDM1Ljg0IDEuODczIDEuODczIDEuODczLjM0MyAwIC42Ni0uMS45MzYtLjI2djIuMzlhMS44NSAxLjg1IDAgMCAwLS45MzctLjI2IDEuODcyIDEuODcyIDAgMCAwLTEuODcyIDEuODczYzAgLjM0My4xLjY2LjI2LjkzNkg0LjQyek0yMy4zOTggMTMuMTAzaC05LjM2YS45MzYuOTM2IDAgMCAwLS45MzUuOTM2djkuMzU4YzAgLjUxNi40Mi45MzUuOTM2LjkzNWg5LjM1OGMuNTE2IDAgLjkzNS0uNDIuOTM1LS45MzZ2LTkuMzZhLjkzNC45MzQgMCAwIDAtLjkzNS0uOTM0em0tOC40MjMgNi4wMDNsNC4xMy00LjEzaDIuMDM0bC02LjE2NSA2LjE2M3YtMi4wMzR6bTAtNC4xM2gxLjQ4NGwtMS40ODUgMS40ODN2LTEuNDg1em03LjQ4NyAxLjMyMnYyLjAzMmwtNC4xMyA0LjEzMmgtMi4wMzRsNi4xNjQtNi4xNjR6bTAgNi4xNjRoLTEuNDg1bDEuNDg1LTEuNDg1djEuNDg1eiIvPjxjaXJjbGUgY3g9IjUuNjE2IiBjeT0iMTguNzE4IiByPSIxLjg3MiIvPjwvZz48L3N2Zz4='
        );

        add_action('Modularity/Module/' . $this->moduleSlug . '/enqueue', array($this, 'enqueueScripts'));
    }

    public function enqueueScripts()
    {
        wp_enqueue_script('mod-latest-taxonomy', MODULARITY_URL . '/dist/js/Posts/assets/mod-posts-taxonomy.js', array(), '1.0.0', true);

        add_action('admin_head', function () {
            global $post;

            if (empty($post)) {
                return;
            }

            echo '<script>var modularity_current_post_id = ' . $post->ID . ';</script>';
        });
    }

    public static function getPosts($module)
    {
        $fields = json_decode(json_encode(get_fields($module->ID)));

        $metaQuery = false;
        $sortBy = $fields->posts_sort_by ? $fields->posts_sort_by : 'date';
        $order = $fields->posts_sort_order ? $fields->posts_sort_order : 'desc';

        // Get post args
        $getPostsArgs = array(
            'posts_per_page' => $fields->posts_count
        );

        if ($sortBy != 'false') {
            $getPostsArgs['order'] = $order;
            $getPostsArgs['orderby'] = $sortBy;
        }

        // Sort by meta key
        if (strpos($sortBy, '_metakey_') > -1) {
            $orderby = str_replace('_metakey_', '', $sortBy);
            $metaQuery = array(
                'relation' => 'OR',
                array(
                    'key' => $orderby,
                    'compare' => 'EXISTS'
                ),
                array(
                    'key' => $orderby,
                    'compare' => 'NOT EXISTS'
                )
            );

            $sortBy = 'meta_key';
        }

        // Taxonomy filter
        if ($fields->posts_taxonomy_filter === true) {
            $taxType = $fields->posts_taxonomy_type;
            $taxValues = (array) $fields->posts_taxonomy_value;

            foreach ($taxValues as $term) {
                $getPostsArgs['tax_query'][] = array(
                    'taxonomy' => $taxType,
                    'field'    => 'name',
                    'terms'    => $term
                );
            }
        }

        // Data source
        switch ($fields->posts_data_source) {
            case 'posttype':
                $getPostsArgs['post_type'] = $fields->posts_data_post_type;
                break;

            case 'children':
                $getPostsArgs['post_parent'] = $fields->posts_data_child_of;
                break;

            case 'manual':
                $getPostsArgs['post__in'] = $fields->posts_data_posts;
                if ($sortBy == 'false') $getPostsArgs['orderby'] = 'post__in';
                break;
        }

        // Add metaquery to args
        if ($metaQuery) {
            $getPostsArgs['meta_query'] = $metaQuery;
        }

        return get_posts($getPostsArgs);
    }
}
