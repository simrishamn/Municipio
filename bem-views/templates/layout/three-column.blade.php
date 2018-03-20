@extends('templates.master')

@section('site-body')
    <div class="container">
        <div class="grid">
            @section('above-content')
                <div class="grid-s-12">
                    @include('partials.breadcrumbs')
                </div>
            @show

            <div class="grid-s-12 grid-md-3 s-sidebar-left">
                @yield('sidebar-left')
            </div>

            <div class="grid-s-12 grid-md-6 s-content">
                @yield('content')
            </div>

            <div class="grid-s-12 grid-md-3 s-sidebar-right">
                @yield('sidebar-right')
            </div>

            @yield('below-content')
        </div>
    </div>
@endsection



