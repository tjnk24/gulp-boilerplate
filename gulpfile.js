const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const pump = require('pump');
const cleanFolder = require('del');
const minifyHtml = require('gulp-htmlmin');
const minifyCss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const minifyJs = require('gulp-uglify');

// потребуется для оповещения о изменении live-reload сервера
const reload = browserSync.reload;

// задание запускает live-reload сервер
const browsSync = () => browserSync({
        server: {
            baseDir: './build'
        },
        open: false,
        notify: false
    });

// минификация html, копирование из папки src в папку build
const copyHtml = (cb) => pump([
        gulp.src('src/**/*.html'),
        minifyHtml({ collapseWhitespace: true }),
        gulp.dest('build/'),
        reload({stream: true})
    ], cb);

// минификация js, копирование из папки src в папку build
const copyJs = (cb) => pump([
        gulp.src('src/**/*.js'),
        minifyJs(),
        gulp.dest('build/'),
        reload({stream: true})
    ], cb);

// компиляция стилей scss -> css, автопрефиксер, минификация
const parseAndCopyStyles = (cb) => pump([
        gulp.src('src/**/*.scss'),
        sass().on('error', sass.logError),
        autoprefixer(),
        minifyCss(),
        gulp.dest('build/'),
        reload({stream: true})
    ], cb)

// копирование картинок из src/img в build/img
const copyImages = (cb) => pump([
        gulp.src('src/img/*'),
        gulp.dest('build/img/'),
        reload({stream: true})
    ], cb);

// наблюдение за файлами при сохранении
const watchFiles = () => {
    gulp.watch('src/**/*.html', copyHtml);
    gulp.watch('src/**/*.js', copyJs);
    gulp.watch('src/**/*.scss', parseAndCopyStyles);
    gulp.watch('src/img/*', copyImages);
};

// стартовое задание, которое запускается через gulp
const initializeBuild = (cb) => {
    cleanFolder('./build/**', { force: true });
    pump([
        copyHtml(),
        copyJs(),
        parseAndCopyStyles(),
        copyImages()
    ], cb);
};

// запуск live-reload сервера с отслеживанием изменений
gulp.task('dev', gulp.parallel(initializeBuild, watchFiles, browsSync));

exports.default = initializeBuild;