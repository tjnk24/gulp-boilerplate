const gulp = require('gulp');
const sass = require('gulp-sass');
const pump = require('pump');
const browserSync = require('browser-sync');

// потребуется для оповещения о изменении live-reload сервера
const reload = browserSync.reload;

// задание запускает live-reload сервер
const browsSync = () => {
    browserSync({
        server: {
            baseDir: './build'
        },
        open: false,
        notify: false
    })
};

// компиляции стилей scss -> css
const style = cb => {
    pump([
        gulp.src('src/*.scss'),
        sass().on('error', sass.logError),
        gulp.dest('build/'),
        reload({stream: true})
    ], cb)
};

// просто копирование из папки src в папку build
const html = cb => {
    pump([
        gulp.src('src/index.html'),
        gulp.dest('build/'),
        reload({stream: true})
    ], cb);
};

// просто копирование из папки src в папку build
const js = cb => {
    pump([
        gulp.src('src/*.js'),
        gulp.dest('build/'),
        reload({stream: true})
    ], cb);
};

// задание для перекомпиляции при изменении
const watching = () => {
    gulp.watch('src/*.scss', style);
    gulp.watch('src/*.html', html);
    gulp.watch('src/*.js', js);
};

// основная gulp задание, которое запускается через gulp
const defaultFunc = (cb) => {
    gulp.parallel(style, html, js);
    cb();
};

// запуск live-reload сервера с отслеживанием изменений
gulp.task('dev', gulp.parallel(defaultFunc, watching, browsSync));

exports.default = defaultFunc;