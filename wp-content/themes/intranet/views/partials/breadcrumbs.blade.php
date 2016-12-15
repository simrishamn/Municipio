@if (!is_main_site() || (is_main_site() && !is_front_page()))

<div class="grid no-margin-top">
    <div class="grid-xs-12">
        <div class="breadcrumbs-wrapper">
            <div class="grid">
                @if (apply_filters('Municipio/Breadcrumbs', wp_get_post_parent_id(get_the_id()) != 0, get_queried_object()))
                <div class="grid-sm-8 hidden-xs">
                    {{ \Municipio\Theme\Navigation::outputBreadcrumbs() }}
                </div>
                @endif

                @include('partials.header.subscribe')
            </div>
        </div>
    </div>
</div>

@elseif (is_main_site() && is_front_page() && is_user_logged_in())

<section class="gutter gutter-vertical gutter-xl">
    <div class="grid">
        <div class="grid-xs-12 text-center">
            <span class="h1 greeting">
                {!! \Intranet\User\General::greet() !!}
            </span>

            <div class="greeting-actions gutter gutter-margin gutter-top gutter-sm">
                <div class="pos-relative inline-block greeting-options">
                    <button class="btn btn-sm" data-dropdown=".greeting-dropdown"><i class="pricon pricon-xs pricon-caret-down"></i></button>
                    <ul class="greeting-dropdown dropdown-menu dropdown-menu-arrow dropdown-menu-arrow-left">
                        <li><a href="#">Dölj hälsningsfras</a></li>
                    </ul>
                </div>

                <?php $unit = \Intranet\User\AdministrationUnits::getUsersAdministrationUnitIntranet(); ?>
                @if ($unit)
                <a href="{{ $unit->path }}" class="btn btn-sm">
                    <?php _e('Go to', 'municipio-intranet'); ?> {{ substr($unit->name, -1, 1) === 's' ? strtolower($unit->name) : strtolower($unit->name . 's') }} <?php _e('intranet', 'municipio-intranet'); ?>
                </a>
                @endif
            </div>
        </div>
    </div>
</section>

@endif
