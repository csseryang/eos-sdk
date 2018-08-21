const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const standalonify = require('standalonify');
const babelify = require('babelify');

gulp.task('build-js', function () {
    return browserify({
        entries: './src/index.js'
    })
        .plugin(standalonify, {
            name: 'EosSdk',
        })
        .transform(babelify, {
                "presets": ["env"],
                // "plugins": [
                //     ["transform-runtime"],
                // ]
            }
        )
        .bundle()
        .pipe(source('eos-sdk.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./dist/'));
});


