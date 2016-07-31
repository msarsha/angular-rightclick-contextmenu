var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var templateCache = require('gulp-angular-templatecache');
var css = require('browserify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('browserify', function () {
    var b = browserify({
        entries: ['./src/index.js'],
        transform: [css]
    });
    return b.bundle()
        .on('error', function(e){
            console.log(e);
        })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./dist/'))
});

gulp.task('default', ['browserify', 'templatecache'], function () {
    return gulp
        .src('./dist/*.js')
        .pipe(concat('sarsha.contextmenu.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));
})

gulp.task('templatecache', function () {
    return gulp
        .src('src/**/*.html')
        .pipe(templateCache('templates.js', {
            module: 'shContextMenu',
            standAlone: false,
            root: 'src/'
        }))
        .pipe(gulp.dest('dist/'));
});;