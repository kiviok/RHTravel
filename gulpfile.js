const gulp = require('gulp');
const exec = require('child_process').exec;
const bs = require('browser-sync').create();
const sass = require('gulp-sass');

const path = {
    html: ['*.html', '_includes/*.html', '_layouts/*.html'],
    scss: 'scss/**/*.scss',
    posts: ['_posts/*.*', '_country-list/*.*'],
    config: ['_config.yml', '_data/*.yml']
};

gulp.task('jekyll:build', ['sass'], function (done) {
    exec('jekyll build', function (error, stdout, stderr) {
        if (error) {
            console.log(`exec error ${error}`);
            return;
        }
        console.log(`exec stdout ${stdout}`);
        console.log(`exec stderr ${stderr}`);
        done();
    });
});

// 2. Запустить локальный сервер из папки _site
gulp.task('browser-sync', ['jekyll:build'], function () {
    bs.init({
        server: {
            baseDir: "_site"
        }
    });
});

gulp.task('sass', function () {
    return gulp.src('scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('_site/assets/styles/'))
        .pipe(bs.stream())
        .pipe(gulp.dest('assets/styles/'));
});

// 3. следить за изменениями исходных файлов и перезапускать сервер и сборку нашего сайта
gulp.task('jekyll:rebuild', ['jekyll:build'], function () {
    bs.reload();
});

gulp.task('watch', function () {
    gulp.watch([path.html, path.config, path.posts], ['jekyll:rebuild']);
    gulp.watch(path.scss, ['sass']);
});

gulp.task('serve', ['browser-sync', 'watch']);