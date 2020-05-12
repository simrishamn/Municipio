//
//  GULPFILE.JS
//  Author: Nikolas Ramstedt (nikolas.ramstedt@helsingborg.se)
//
//  CHEATSHEET:
//  "gulp"                  -   Build and watch combined
//  "gulp watch"            -   Watch for file changes and compile changed files
//  "gulp build"            -   Re-build dist folder and build assets
//
//
// => ATTENTION: use "npm install" before first build!

/* ==========================================================================
   Dependencies
   ========================================================================== */

    const {
        series,
        parallel,
        watch: gulpWatch,
        src,
        dest
    }               =   require('gulp'),
    rename          =   require('gulp-rename'),
    gulpSass        =   require('gulp-sass'),
    concat          =   require('gulp-concat'),
    autoprefixer    =   require('gulp-autoprefixer'),
    sourcemaps      =   require('gulp-sourcemaps'),
    uglify          =   require('gulp-uglify'),
    gulpRev         =   require('gulp-rev'),
    revDel          =   require('rev-del'),
    revReplaceCSS   =   require('gulp-rev-css-url'),
    del             =   require('del'),
    runSequence     =   require('run-sequence'),
    plumber         =   require('gulp-plumber'),
    jshint          =   require("gulp-jshint"),
    cleanCSS        =   require('gulp-clean-css'),
    gulpImage       =   require('gulp-image'),
    node_modules    =   'node_modules/';

/* ==========================================================================
   Load configuration file
   ========================================================================== */

    var config = (require('fs').existsSync('./config.json') ? JSON.parse(require('fs').readFileSync('./config.json')) : {});

/* ==========================================================================
   Build tasks
   ========================================================================== */

    const build = series(cleanDist, parallel(sass, scripts), rev, image);
    exports.build = build;

    const buildSass = series(sass, rev);

    const buildScripts = series(scripts, rev);

/* ==========================================================================
   Watch task
   ========================================================================== */

    // gulp.task('watch', function() {
    //     gulp.watch('./assets/source/sass/**/*.scss', ['build:sass']);
    //     gulp.watch('./assets/source/js/**/*.js', ['build:scripts']);
    // });
    function watch() {
        gulpWatch('./assets/source/sass/**/*.scss', [buildSass]);
        gulpWatch('./assets/source/js/**/*.js', [buildScripts]);
    }

/* ==========================================================================
   Rev task
   ========================================================================== */

    function rev() {
        return src(["./assets/tmp/**/*"])
          .pipe(gulpRev())
          .pipe(revReplaceCSS())
          .pipe(dest('./assets/dist'))
          .pipe(gulpRev.manifest())
          .pipe(revDel({dest: './assets/dist'}))
          .pipe(dest('./assets/dist'));
    }

/* ==========================================================================
   SASS Task
   ========================================================================== */

    function sass() {
        var app = src('assets/source/sass/app.scss')
                .pipe(plumber())
                .pipe(sourcemaps.init())
                .pipe(gulpSass().on('error', gulpSass.logError))
                .pipe(autoprefixer({
                        browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1']
                    }))
                .pipe(sourcemaps.write())
                .pipe(dest('./assets/dist/css'))
                .pipe(cleanCSS({debug: true}))
                .pipe(dest('./assets/tmp/css'));

        var admin = src('assets/source/sass/admin.scss')
                .pipe(plumber())
                .pipe(sourcemaps.init())
                .pipe(gulpSass().on('error', gulpSass.logError))
                .pipe(autoprefixer({
                        browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1']
                    }))
                .pipe(sourcemaps.write())
                .pipe(dest('./assets/dist/css'))
                .pipe(cleanCSS({debug: true}))
                .pipe(dest('./assets/tmp/css'));

        return Promise.all([app, admin]);
    }

/* ==========================================================================
   Scripts task
   ========================================================================== */

    function scripts() {
        const app = src(['assets/source/js/app.js', 'assets/source/js/*.js', 'assets/source/js/*/*.js', '!assets/source/js/admin/*.js', '!assets/source/js/admin/*/*.js'])
            .pipe(plumber())
            .pipe(sourcemaps.init())
            .pipe(jshint({multistr: true}))
            .pipe(concat('app.js'))
            .pipe(sourcemaps.write())
            .pipe(dest('./assets/dist/js'))
            .pipe(uglify())
            .pipe(dest('./assets/tmp/js'));

        const admin = src(['assets/source/js/admin/*.js', 'assets/source/js/admin/*/*.js'])
            .pipe(plumber())
            .pipe(sourcemaps.init())
            .pipe(jshint({multistr: true}))
            .pipe(jshint.reporter("default"))
            .pipe(concat('admin.js'))
            .pipe(sourcemaps.write())
            .pipe(dest('./assets/dist/js'))
            .pipe(uglify())
            .pipe(dest('./assets/tmp/js'));

        const vendor = src([
                'assets/source/js/vendor/*.js'
            ])
            .pipe(plumber())
            .pipe(sourcemaps.init())
            .pipe(concat('vendor.js'))
            .pipe(sourcemaps.write())
            .pipe(dest('./assets/dist/js'))
            .pipe(uglify())
            .pipe(dest('./assets/tmp/js'));

        const mce = src([
                'assets/source/mce-js/*.js'
            ])
            .pipe(plumber())
            .pipe(sourcemaps.init())
            .pipe(concat('mce.js'))
            .pipe(sourcemaps.write())
            .pipe(dest('./assets/dist/js'))
            .pipe(uglify())
            .pipe(dest('./assets/tmp/js'));

        return Promise.all([app, vendor, admin, mce]);
    }

/* ==========================================================================
   Image optimization tasks
   ========================================================================== */

    function image() {
        return src('assets/source/images/**/*',)
            .pipe(gulpImage())
            .pipe(dest('./assets/dist/images'));
    }

/* ==========================================================================
   Clean/Clear tasks
   ========================================================================== */

    function cleanDist() {
        return del('./assets/dist');
    }

    function cleanTmp() {
        return del.sync('./assets/tmp');
    }

/* ==========================================================================
   Default task
   ========================================================================== */

   exports.default = series(build, watch);
