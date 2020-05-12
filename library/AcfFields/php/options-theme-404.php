<?php 

if (function_exists('acf_add_local_field_group')) {
    acf_add_local_field_group(array(
    'key' => 'group_56d41dbd7e501',
    'title' => '404',
    'fields' => array(
        0 => array(
            'layout' => 'horizontal',
            'choices' => array(
                'standard' => __('Standard', 'municipio'),
                'negative' => __('Negative', 'municipio'),
            ),
            'default_value' => 'standard',
            'other_choice' => 0,
            'save_other_choice' => 0,
            'allow_null' => 0,
            'return_format' => 'value',
            'key' => 'field_56e2b45f1b947',
            'label' => __('Logotype', 'municipio'),
            'name' => '404_error_logotype',
            'type' => 'radio',
            'instructions' => '',
            'required' => 1,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
        ),
        1 => array(
            'default_value' => 'The page could not be found',
            'new_lines' => '',
            'maxlength' => '',
            'placeholder' => '',
            'rows' => '',
            'key' => 'field_56d41dcfc4ec9',
            'label' => __('Error message', 'municipio'),
            'name' => '404_error_message',
            'type' => 'textarea',
            'instructions' => __('The message that will be displayed underneeth the 404-error code', 'municipio'),
            'required' => 1,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'readonly' => 0,
            'disabled' => 0,
        ),
        2 => array(
            'tabs' => 'all',
            'toolbar' => 'full',
            'media_upload' => 1,
            'default_value' => '',
            'delay' => 0,
            'key' => 'field_56d421e96fa4a',
            'label' => __('Error info', 'municipio'),
            'name' => '404_error_info',
            'type' => 'wysiwyg',
            'instructions' => __('Additional information about the error or other information', 'municipio'),
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
        ),
        3 => array(
            'layout' => 'horizontal',
            'choices' => array(
                'home' => __('Link to home', 'municipio'),
                'search' => __('Link to search', 'municipio'),
                'back' => __('Back button (previous page in browser history)', 'municipio'),
            ),
            'default_value' => array(
            ),
            'allow_custom' => 0,
            'save_custom' => 0,
            'toggle' => 0,
            'return_format' => 'value',
            'key' => 'field_56d41df8c4eca',
            'label' => __('Display', 'municipio'),
            'name' => '404_display',
            'type' => 'checkbox',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
        ),
        4 => array(
            'default_value' => 'Back to home',
            'maxlength' => '',
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'key' => 'field_56d41ebfc4ecb',
            'label' => __('Home link text', 'municipio'),
            'name' => '404_home_link_text',
            'type' => 'text',
            'instructions' => '',
            'required' => 1,
            'conditional_logic' => array(
                0 => array(
                    0 => array(
                        'field' => 'field_56d41df8c4eca',
                        'operator' => '==',
                        'value' => 'home',
                    ),
                ),
            ),
            'wrapper' => array(
                'width' => '33.3333',
                'class' => '',
                'id' => '',
            ),
            'readonly' => 0,
            'disabled' => 0,
        ),
        5 => array(
            'default_value' => 'Go back',
            'maxlength' => '',
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'key' => 'field_56d41edec4ecc',
            'label' => __('Back button text', 'municipio'),
            'name' => '404_back_button_text',
            'type' => 'text',
            'instructions' => '',
            'required' => 1,
            'conditional_logic' => array(
                0 => array(
                    0 => array(
                        'field' => 'field_56d41df8c4eca',
                        'operator' => '==',
                        'value' => 'back',
                    ),
                ),
            ),
            'wrapper' => array(
                'width' => '33.3333',
                'class' => '',
                'id' => '',
            ),
            'readonly' => 0,
            'disabled' => 0,
        ),
        6 => array(
            'default_value' => 'Search for "%s"',
            'maxlength' => '',
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'key' => 'field_56d41f18c4ecd',
            'label' => __('Search link text', 'municipio'),
            'name' => '404_search_link_text',
            'type' => 'text',
            'instructions' => __('Use %s to output suggested search query', 'municipio'),
            'required' => 1,
            'conditional_logic' => array(
                0 => array(
                    0 => array(
                        'field' => 'field_56d41df8c4eca',
                        'operator' => '==',
                        'value' => 'search',
                    ),
                ),
            ),
            'wrapper' => array(
                'width' => '33.3333',
                'class' => '',
                'id' => '',
            ),
            'readonly' => 0,
            'disabled' => 0,
        ),
    ),
    'location' => array(
        0 => array(
            0 => array(
                'param' => 'options_page',
                'operator' => '==',
                'value' => 'acf-options-404',
            ),
        ),
    ),
    'menu_order' => 0,
    'position' => 'normal',
    'style' => 'default',
    'label_placement' => 'top',
    'instruction_placement' => 'label',
    'hide_on_screen' => '',
    'active' => 1,
    'description' => '',
    'local' => 'php',
));
}