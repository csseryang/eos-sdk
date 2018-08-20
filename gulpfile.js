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
                "presets": ["es2015", "stage-2"],
                "plugins": [
                    ["transform-runtime", {
                        "helpers": true,
                        "polyfill": true,
                        "regenerator": true,
                        "moduleName": "babel-runtime"
                    }],
                    ["transform-class-properties", {"loose": false}],
                    ["transform-object-assign"],
                    ["transform-es2015-classes", {"loose": true}],
                    ["transform-es2015-modules-commonjs", {"loose": false}],
                    ["transform-es2015-for-of", {"loose": true}]
                ]
            }
        )  //使用babel转换es6代码
        .bundle()  //合并打包
        .pipe(source('eos-sdk.js'))  //将常规流转换为包含Stream的vinyl对象，并且重命名
        .pipe(buffer())  //将vinyl对象内容中的Stream转换为Buffer
        .pipe(gulp.dest('./dist/'));  //输出打包后的文件
});


