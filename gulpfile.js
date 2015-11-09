var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var bower = require('gulp-bower');

// Typescript sources
var editorTsProject = ts.createProject('editor-ts/tsconfig.json');
gulp.task('editor-ts', function() {
    var tsResult = editorTsProject
        .src() // instead of gulp.src(...) 
        .pipe(sourcemaps.init())
        .pipe(ts(editorTsProject));
    
    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('release'));
});

// Editor 
gulp.task('editor', function() {
    return gulp.src(['editor/**/*'])
        .pipe(gulp.dest('release'));
});

// Bower dependencies
gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest('release/lib/'));
});

// Assets
gulp.task('assets', function() {
    return gulp.src(['assets/**/*'])
        .pipe(gulp.dest('release/assets'));
});

// Default task
gulp.task('default', ['editor-ts', 'editor', 'bower', 'assets']);

// Clean task
gulp.task('clean', function() {
    return del(['release']);
});

