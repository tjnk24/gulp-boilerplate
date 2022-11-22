const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass')(require('sass'));
const pump = require('pump');
const cleanFolder = require('del');
const minifyHtml = require('gulp-htmlmin');
const minifyCss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const minifyJs = require('gulp-uglify');
const gulpEmbedSvg = require('gulp-embed-svg');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const gulpConcat = require('gulp-concat');

// потребуется для оповещения о изменении live-reload сервера
const {reload} = browserSync;

// задание запускает live-reload сервер
const browsSync = () => browserSync({
    server: {
        baseDir: './build',
    },
    open: false,
    notify: false,
});

// минификация html, копирование из папки src в папку build
const copyHtml = () => pump([
    gulp.src('src/**/*.html'),
    minifyHtml({collapseWhitespace: true}),
    gulp.dest('build/'),
    reload({stream: true}),
]);

// минификация js, копирование из папки src в папку build
const copyJs = () => {
    cleanFolder('build/**/*.js');

    return pump([
        gulp.src('src/**/*.js'),
        plumber(),
        babel({
            sourceType: 'module',
            presets: [
                ['@babel/env'],
            ],
        }),
        gulpConcat('js/index.js'),
        minifyJs(),
        gulp.dest('build/'),
        reload({stream: true}),
    ]);
};

// компиляция стилей scss -> css, автопрефиксер, минификация
const parseAndCopyStyles = () => pump([
    gulp.src('src/**/*.scss'),
    sass().on('error', sass.logError),
    autoprefixer(),
    minifyCss(),
    gulp.dest('build/'),
    reload({stream: true}),
]);

// копирование картинок из src/img в build/img
const copyFiles = () => {
    cleanFolder('build/img/**');

    return pump([
        gulp.src('src/img/*.jpg'),
        gulp.src('src/img/*.jpeg'),
        gulp.src('src/img/*.png'),
        gulp.src('src/img/*.svg'),
        gulp.dest('build/img/'),
        reload({stream: true}),
    ]);
};

const embedSvgs = () => pump([
    gulp.src('src/*.html'),
    gulpEmbedSvg(),
    gulp.dest('src/img/*'),
]);

// наблюдение за файлами при сохранении
const watchFiles = () => {
    gulp.watch('src/**/*.html', copyHtml);
    gulp.watch('src/**/*.js', copyJs);
    gulp.watch('src/**/*.scss', parseAndCopyStyles);
    gulp.watch('src/img/*', copyFiles);
    gulp.watch('src/img/*', embedSvgs);
};

// стартовое задание, которое запускается через gulp
const initializeBuild = callback => {
    cleanFolder('build/**', {force: true});

    pump([
        copyHtml(),
        copyJs(),
        parseAndCopyStyles(),
        copyFiles(),
    ], callback);

    embedSvgs();
};

// запуск live-reload сервера с отслеживанием изменений
gulp.task('dev', gulp.parallel([
    initializeBuild,
    watchFiles,
    browsSync,
]));

exports.default = initializeBuild;
