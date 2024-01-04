const gulp = require('gulp');
const webpack = require('webpack-stream');
const eslint = require('gulp-eslint');
const todo = require('gulp-todo');

function getWebpackConfig() {
    return require('./webpack.config.js')(!process.env.IS_DEV)
}

function copyClientResources() {
    return gulp.src(['src/client/**/*.*', '!src/client/**/*.js'])
        .pipe(gulp.dest('./bin/client/'));
}

function buildClientJS() {
    return gulp.src(['src/client/js/app.js'])
        .pipe(webpack(getWebpackConfig()))
        .pipe(gulp.dest('bin/client/js/'));
}

gulp.task('lint-client', () => {
    return gulp.src(['src/client/**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('todo-client', gulp.series('lint-client', () => {
    return gulp.src('src/client/**/*.js')
        .pipe(todo())
        .pipe(gulp.dest('./'));
}));

gulp.task('run', gulp.series('lint-client', gulp.parallel(copyClientResources, buildClientJS)));

gulp.task('default', gulp.series('run'));
