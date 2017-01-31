var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var templateCache = require('gulp-angular-templatecache');
var css = require('browserify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');

gulp.task('browserify', function () {
    var b = browserify({
        entries: ['./src/index.js'],
        transform: [css]
    });
    return b.bundle()
        .on('error', function (e) {
            console.log(e);
        })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./dist/'))
});

gulp.task('clean', function(){
    return gulp.src('dist/sarsha.contextmenu.js')
        .pipe(clean());    
})

gulp.task('build-js', ['clean', 'browserify', 'templatecache'], function () {
    return gulp
        .src('./dist/*.js')
        .pipe(concat('sarsha.contextmenu.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));
})

gulp.task('default', ['build-js'], function () {
    return gulp
        .src(['./dist/bundle.js', './dist/templates.js'])
        .pipe(clean())
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
});

gulp.task('watch', function () {
    var watcher = gulp
        .watch(['src/**/*.js', 'src/**/*.html', 'src/**/*.css'], ['build-js']);

    watcher.on('change', function(event){
        console.log(event);
    })
})