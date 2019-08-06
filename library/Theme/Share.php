<?php

namespace Municipio\Theme;

class Share
{
    public function __construct()
    {
        add_action('wp_ajax_share_email', array($this, 'socialShareEmail'));
        add_action('wp_ajax_nopriv_share_email', array($this, 'socialShareEmail'));
    
        //Adds redirect to full url
        add_action('template_redirect', array($this, 'redirectFromShortlink')); 

        //Add new allowed query vars (purpose redirect)
        add_filter('query_vars', array($this, 'addAllowedQueryVars'));
    }

    /**
     * Register new allowed qs
     * @return array
     */
    public function addAllowedQueryVars($vars)
    {
        if(!is_array($vars)) {
            $vars = array(); 
        }

        $vars[] = "socialShareId"; 
        
        return $vars; 
    }

    /**
     * Make a redirect to the actiual page 
     * @return void
     */
    public function redirectFromShortlink()
    {

        //Check if is admin
        if(is_admin()) {
            return; 
        }

        //Get the post id
        $postId = get_query_var('socialShareId', null); 

        //Do redirect
        if(!is_null($postId) && is_numeric($postId)) {
            wp_safe_redirect(get_permalink($postId), 301);
            exit; 
        }
    }

    /**
     * Share a post by email
     * @return void
     */
    public function socialShareEmail()
    {

        //Check nonce
        if(!isset($_REQUEST['_wpnonce']) ||!wp_verify_nonce($_REQUEST['_wpnonce'], 'share-page' . (isset($_POST['post_id']) ? $_POST['post_id'] : null))) {
            wp_send_json_error(__('Something went wrong, please try again', 'municipio'));
            exit;
        }

        //Validate reCaptcha
        if (!is_user_logged_in() && defined('G_RECAPTCHA_KEY')) {
            $response   = isset($_POST['g-recaptcha-response']) ? esc_attr($_POST['g-recaptcha-response']) : '';
            $reCaptcha = \Municipio\Helper\ReCaptcha::controlReCaptcha($response);

            if (!$reCaptcha) {
                wp_send_json_error(__('Something went wrong, please try again', 'municipio'));
                exit;
            }
        }

        //Get user data
        $user        = wp_get_current_user();
        $shareType   = isset($_POST['share_type']) ? $_POST['share_type'] : 'share';
        $postId      = isset($_POST['post_id']) ? $_POST['post_id'] : null;
        $senderName  = is_user_logged_in() ? $user->display_name : (isset($_POST['sender_name']) ? $_POST['sender_name'] : "");
        $senderEmail = is_user_logged_in() ? $user->user_email : (isset($_POST['sender_email']) ? $_POST['sender_email'] : "");
        $recipients  = isset($_POST['recipient_email']) ? explode(',', str_replace(' ', '', trim($_POST['recipient_email'], ','))) : null;
        // Build message
        $message = sprintf('<strong>%s</strong> %s <a href="%s" target="_blank">%s</a><br><br>%s<br><br>---<br>%s %s via <a href="%s" target="_blank">%s</a>',
            $senderName,
            $shareType == 'invite' ? __('has invited you to join', 'municipio') : __('shared the post', 'municipio'),
            get_permalink($postId),
            get_the_title($postId),
            !empty($_POST['message']) ? '<strong>' . __('Message', 'municipio') . '</strong><br>' . $_POST['message'] : '',
            __('This message was sent by', 'municipio'),
            $senderEmail,
            get_site_url(),
            get_site_url()
        );

        // Send the email
        $mail = false;
        if (is_array($recipients) && !empty($recipients)) {

            // Do additional actions when notifying recipients
            if ($user) {
                do_action('Municipio/share_post/recipients', $postId, $user, $recipients, $shareType);
            }

            foreach ($recipients as $recipient) {
                $mail = wp_mail(
                    $recipient,
                    $shareType == 'invite' ? __('Invitation', 'municipio') : $senderName . ' ' . __('shared a post via', 'municipio') . ': ' . get_site_url(),
                    $message,
                    array(
                        'From: ' . $senderName . ' <' . $senderEmail . '>',
                        'Content-Type: text/html; charset=UTF-8'
                    )
                );
            }
        }

        if ($mail === true) {
            wp_send_json_success(__('The message was sent successfully', 'municipio'));
        } else {
            wp_send_json_error(__('Something went wrong, please try again', 'municipio'));
        }
        exit;
    }
}
