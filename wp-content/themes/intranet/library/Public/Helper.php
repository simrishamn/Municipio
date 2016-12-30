<?php

$municipio_intranet_walkthrough_counter = 0;

if (!function_exists('municipio_intranet_walkthrough')) {
    /**
     * Creates a walkthrough step
     * @param  string $title             The step headline/title
     * @param  string $html              HTML content
     * @param  string $highlightSelector Selector for element to highlight when step is active
     * @param  string $position          The position of the blipper
     * @param  string $dropdownPosition  The position of dropdown
     * @param  array  $css               CSS rules ($key => $value)
     * @return string                    Walkthrough markup
     */
    function municipio_intranet_walkthrough($title, $html, $highlightSelector = null, $position = 'center', $dropdownPosition = 'center', $css = array())
    {
        if (!isset($_GET['walkthrough'])) {
            return;
        }

        global $municipio_intranet_walkthrough_counter;
        $municipio_intranet_walkthrough_counter++;

        if ($highlightSelector) {
            $highlightSelector = ' data-highlight="' . $highlightSelector . '"';
        }

        $styleTag = null;
        if (is_array($css) && count($css) > 0) {
            $styleTag = ' style="';
            foreach ($css as $key => $value) {
                $styleTag .= $key . ':' . $value . ';';
            }
            $styleTag .= '"';
        }

        $position = 'walkthrough-' . $position;

        switch ($dropdownPosition) {
            default:
                $dropdownPosition = 'walkthrough-dropdown-center';
                break;

            case 'left':
                $dropdownPosition = 'walkthrough-dropdown-left';
                break;

            case 'right':
                $dropdownPosition = 'walkthrough-dropdown-right';
                break;
        }

        return '
            <div class="walkthrough ' . $position . ' ' . $dropdownPosition . '"' . $highlightSelector . $styleTag . '>
                <div class="blipper" data-dropdown=".blipper-' . $municipio_intranet_walkthrough_counter . '-dropdown"></div>
                <div class="dropdown-menu dropdown-menu-arrow blipper-' . $municipio_intranet_walkthrough_counter . '-dropdown gutter">
                    <h4>' . $title . '</h4>
                    <p>
                        ' . $html . '
                    </p>
                    <footer>
                        <button class="btn" data-action="walkthrough-previous">' . __('Previous', 'municipio-intranet') . '</button>
                        <button class="btn" data-action="walkthrough-next">' . __('Next', 'municipio-intranet') . '</button>
                        <button class="btn btn-plain" data-action="walkthrough-cancel">' . __('Cancel', 'municipio-intranet') . '</button>
                    </footer>
                </div>
            </div>
        ';
    }
}

if (!function_exists('municipio_intranet_field_example')) {
    function municipio_intranet_field_example($key, $example, $label = null)
    {
        if (is_null($label)) {
            $label = __('Example', 'municipio-intranet');
        }

        $example = apply_filters('MunicipioIntranet/EditProfile/Example/Example', array(
            'label' => $label,
            'example' => $example
        ), $key);

        echo '<small class="form-example"><span>' . $example['label'] . ':</span> ' . $example['example'] . '</small>';
    }
}

if (!function_exists('municipio_current_post_status')) {
    function municipio_current_post_status()
    {
        global $wp_query;

        if (isset($wp_query->queried_object->post_status)) {
            return $wp_query->queried_object->post_status;
        }

        return false;
    }
}

if (!function_exists('municipio_intranet_follow_button')) {
    function municipio_intranet_follow_button($blogId, $additionalClasses = array(), $echo = true)
    {
        $additionalClasses = implode(' ', $additionalClasses);

        $html = '<button class="btn btn-primary btn-subscribe ' . $additionalClasses . '" data-subscribe="' . $blogId . '">';

        if (!\Intranet\User\Subscription::hasSubscribed($blogId)) {
            $html .= '<i class="pricon pricon-plus-o"></i> ' . __('Follow', 'municipio-intranet');
        } else {
            $html .= '<i class="pricon pricon-minus-o"></i> ' . __('Unfollow', 'municipio-intranet');
        }

        $html .= '</button>';

        if (!$echo) {
            return $html;
        }

        echo $html;
    }
}
