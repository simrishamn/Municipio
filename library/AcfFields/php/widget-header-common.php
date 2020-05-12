<?php 

if (function_exists('acf_add_local_field_group')) {
    acf_add_local_field_group(array(
    'key' => 'group_5a65d5e7e913b',
    'title' => __('Widget - Common Utility fields', 'municipio'),
    'fields' => array(
        0 => array(
            'key' => 'field_5a67574c78160',
            'label' => __('Display options', 'municipio'),
            'name' => '',
            'type' => 'accordion',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'open' => 0,
            'multi_expand' => 0,
            'endpoint' => 0,
        ),
        1 => array(
            'key' => 'field_5a65d5f15bffd',
            'label' => __('Visibility', 'municipio'),
            'name' => 'widget_utility_visibility',
            'type' => 'checkbox',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'choices' => array(
                'xs' => __('Hide on extra small devices (XS)', 'municipio'),
                'sm' => __('Hide on small devices (SM)', 'municipio'),
                'md' => __('Hide on medium devices (MD)', 'municipio'),
                'lg' => __('Hide on large devices (LG)', 'municipio'),
            ),
            'allow_custom' => 0,
            'save_custom' => 0,
            'default_value' => array(
            ),
            'layout' => 'vertical',
            'toggle' => 0,
            'return_format' => 'value',
        ),
        2 => array(
            'key' => 'field_5ac77af87a6b3',
            'label' => __('Margin options', 'municipio'),
            'name' => '',
            'type' => 'accordion',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'open' => 0,
            'multi_expand' => 0,
            'endpoint' => 0,
        ),
        3 => array(
            'key' => 'field_5ac77d3d7a6bc',
            'label' => __('Margins', 'municipio'),
            'name' => 'widget_utility_margin',
            'type' => 'repeater',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'collapsed' => '',
            'min' => 0,
            'max' => 0,
            'layout' => 'table',
            'button_label' => '',
            'sub_fields' => array(
                0 => array(
                    'key' => 'field_5ac77efa7a6bd',
                    'label' => __('Direction', 'municipio'),
                    'name' => 'direction',
                    'type' => 'select',
                    'instructions' => '',
                    'required' => 1,
                    'conditional_logic' => 0,
                    'wrapper' => array(
                        'width' => '',
                        'class' => '',
                        'id' => '',
                    ),
                    'choices' => array(
                        'l' => __('Left', 'municipio'),
                        'r' => __('Right', 'municipio'),
                        'x' => __('Left & Right', 'municipio'),
                    ),
                    'default_value' => array(
                    ),
                    'allow_null' => 0,
                    'multiple' => 0,
                    'ui' => 0,
                    'ajax' => 0,
                    'return_format' => 'value',
                    'placeholder' => '',
                ),
                1 => array(
                    'key' => 'field_5ac77f3e7a6be',
                    'label' => __('Margin', 'municipio'),
                    'name' => 'margin',
                    'type' => 'select',
                    'instructions' => '',
                    'required' => 1,
                    'conditional_logic' => 0,
                    'wrapper' => array(
                        'width' => '',
                        'class' => '',
                        'id' => '',
                    ),
                    'choices' => array(
                        'auto' => __('Auto', 'municipio'),
                        1 => __('Small', 'municipio'),
                        4 => __('Large', 'municipio'),
                        0 => __('None', 'municipio'),
                    ),
                    'default_value' => array(
                    ),
                    'allow_null' => 0,
                    'multiple' => 0,
                    'ui' => 0,
                    'ajax' => 0,
                    'return_format' => 'value',
                    'placeholder' => '',
                ),
                2 => array(
                    'key' => 'field_5ac77f677a6bf',
                    'label' => __('Breakpoint', 'municipio'),
                    'name' => 'breakpoint',
                    'type' => 'select',
                    'instructions' => '',
                    'required' => 0,
                    'conditional_logic' => 0,
                    'wrapper' => array(
                        'width' => '',
                        'class' => '',
                        'id' => '',
                    ),
                    'choices' => array(
                        '@sm' => __('SM and up', 'municipio'),
                        '@md' => __('MD and up', 'municipio'),
                        '@lg' => __('LG and up', 'municipio'),
                    ),
                    'default_value' => array(
                    ),
                    'allow_null' => 1,
                    'multiple' => 0,
                    'ui' => 0,
                    'ajax' => 0,
                    'return_format' => 'value',
                    'placeholder' => '',
                ),
            ),
        ),
        4 => array(
            'key' => 'field_5ae9bbb2fedcb',
            'label' => __('CSS', 'municipio'),
            'name' => '',
            'type' => 'accordion',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'open' => 0,
            'multi_expand' => 0,
            'endpoint' => 0,
        ),
        5 => array(
            'key' => 'field_5ae9bbc6fedcc',
            'label' => __('Custom CSS classes', 'municipio'),
            'name' => 'widget_utility_custom_css',
            'type' => 'text',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'default_value' => '',
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'maxlength' => '',
        ),
    ),
    'location' => array(
        0 => array(
            0 => array(
                'param' => 'widget',
                'operator' => '==',
                'value' => 'widget-header-menu',
            ),
        ),
        1 => array(
            0 => array(
                'param' => 'widget',
                'operator' => '==',
                'value' => 'widget-header-logo',
            ),
        ),
    ),
    'menu_order' => 100,
    'position' => 'normal',
    'style' => 'default',
    'label_placement' => 'top',
    'instruction_placement' => 'label',
    'hide_on_screen' => '',
    'active' => 0,
    'description' => '',
));
}