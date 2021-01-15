<?php
	$uniqueId = rand(0, 1000);
?>

<div id="modal-target-{{ get_the_ID() }}" class="modal modal-backdrop-2 modal-xs text-left" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-content material-shadow-lg">
        <form class="social-share-email">
            <div class="modal-header">
                <a href="#" class="btn btn-close"></a>
                <h2 class="modal-title"><?php _e('Share as e-mail', 'municipio'); ?></h2>
            </div>
            <div class="modal-body">
                <article>
                    <div class="form-group">
                        <label>URL</label>
                        <a href="{{ get_permalink(get_the_ID()) }}" target="_blank">{{ get_permalink(get_the_ID()) }}</a>
                    </div>
                    @if (!is_user_logged_in())
                        <div class="form-group">
                            <label for="sender-name-{{$uniqueId}}"><?php _e('Your name', 'municipio'); ?> <span class="text-danger">*</span></label>
                            <input type="text" name="sender_name" id="sender-name-{{$uniqueId}}" placeholder="<?php _e('Your name', 'municipio'); ?>" required>
                        </div>
                        <div class="form-group">
                            <label for="sender-email-{{$uniqueId}}"><?php _e('Your email', 'municipio'); ?> <span class="text-danger">*</span></label>
                            <input type="email" name="sender_email" id="sender-email-{{$uniqueId}}" placeholder="<?php _e('Your email', 'municipio'); ?>" required>
                        </div>
                    @endif
                    <div class="form-group">
                        <label for="recipient-email-{{$uniqueId}}"><?php _e('Recipient email', 'municipio'); ?> <span class="text-danger">*</span></label>
                        <span class="label-sm"><?php _e('Enter one or many e-mail addresses. Separate with comma.', 'municipio'); ?></span>
                        <input type="text" name="recipient_email" id="recipient-email-{{$uniqueId}}" placeholder="<?php _e('Recipient email', 'municipio'); ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="message-{{$uniqueId}}"><?php _e('Message', 'municipio'); ?></label>
                        <textarea name="message" id="message-{{$uniqueId}}" rows="4" placeholder="<?php _e('Message', 'municipio'); ?>"></textarea>
                    </div>
                    @if (!is_user_logged_in())
                        <div class="form-group">
                            <div class="g-recaptcha" data-sitekey="{{ defined('G_RECAPTCHA_KEY') ? G_RECAPTCHA_KEY : '' }}"></div>
                        </div>
                    @endif
                </article>
            </div>
            <div class="modal-footer">
                <input type="hidden" name="post_id" value="{{ the_ID() }}">
                <input type="hidden" name="share_type" value="share">
                <input type="submit" class="btn btn-primary" value="<?php _e('Send', 'municipio'); ?>">
                {!! wp_nonce_field('share-page' . get_the_ID(), '_wpnonce', true, false) !!}
            </div>
        </form>
    </div>
    <a href="#" class="backdrop"></a>
</div>
