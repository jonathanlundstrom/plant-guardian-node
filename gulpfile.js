'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const stylus = require('gulp-stylus');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const nodemon = require('gulp-nodemon');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer-stylus');
const browsersync = require('browser-sync').create();

const babelify = require('babelify');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const source = require('vinyl-source-stream');

const paths = {
    style: 'include/css/*.styl',
    script: 'include/js/**/*.es6',
    output: {
        js: {
            dir: 'include/js',
            name: 'bundle.min.js'
        },
        css: {
            dir: 'include/css',
            name: 'bundle.min.css'
        }
    }
};

// Compile all stylus files:
gulp.task('stylus', () => {
    gulp.src(paths.style)
        .pipe(sourcemaps.init())
        .pipe(stylus({
            compress: true,
            use: autoprefixer({
                browsers: [
                    'iOS >= 7.0',
                    'Android >= 4.0',
                    'last 4 versions'
                ]
            })
        }))
        .pipe(concat(paths.output.css.name))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.output.css.dir))
        .pipe(browsersync.stream())
});

// Compile all ES2015 files:
gulp.task('ecmascript', () => {
    return browserify({ entries: 'include/js/app.es6', debug: true })
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source(paths.output.js.name))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.output.js.dir))
        .pipe(browsersync.stream());
});

// Build then start BrowserSync and watchers:
gulp.task('watch', [ 'stylus', 'ecmascript', 'serve' ], function() {
    
    // Start BrowserSync:
    browsersync.init(null, {
        open: false,
        notify: false,
        proxy: 'http://localhost:1337'
    });
    
    // Set file watchers:
    gulp.watch(paths.style, ['stylus']);
    gulp.watch(paths.script, ['ecmascript']);
    gulp.watch(['views/*']).on('change', () => browsersync.reload());
    gulp.watch(['include/img/*']).on('change', () => browsersync.reload());
    
});

// Start the Nodemon server:
gulp.task('serve', function (cb) {
    let called = false;
    return nodemon({
        script: 'index.js',
        watch: [ 'index.js' ]
    }).on('start', function() {
        if (!called) {
            called = true;
            cb();
        }
    }).on('restart', function() {
        setTimeout(browsersync.reload, 2000);
    });
});

gulp.task('default', ['stylus', 'ecmascript']);