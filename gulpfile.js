const { stream } = require('browser-sync');
const fileinclude = require('gulp-file-include');

let project__folder = "dist"
let source__folder = "#src"
let fs = require('fs')
// Пути к файлам
let path = {
    // Готовый проект
    build:{
        html: project__folder + '/',
        css: project__folder + '/css/',
        js: project__folder + '/js/',
        img: project__folder + '/img/',
        fonts: project__folder + '/fonts/',
    },
    // Источники
    src:{
        html: [source__folder + '/*.html', '!'+source__folder+'/_*.html'],
        css: source__folder + '/scss/style.scss',
        js: source__folder + '/js/script.js',
        img: source__folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
        fonts: source__folder + '/fonts/*.ttf',
    },
    // Слежение
    watch:{
        html: source__folder + '/**/*.html',
        css: source__folder + '/scss/**/*.scss',
        js: source__folder + '/js/**/*.js',
        img: source__folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
    },
    // Очистка
    clean: "./" + project__folder + "/"
}

// Переменные с подключенными плагинами
let {src, dest} = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileInclude = require('gulp-file-include'),
    del =require('del'),
    scss = require ('gulp-sass')(require('sass')),
    autoprefixer = require ('gulp-autoprefixer'),
    group_media = require ('gulp-group-css-media-queries'),
    clean_css = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify_es = require('gulp-uglify-es').default,
    imagemin = require('gulp-image'),
    webp = require('gulp-webp'),
    webp_html = require('gulp-webp-html'),
    webpcss = require('gulp-webp-css'),
    svgSprite = require('gulp-svg-sprite'),
    ttf2woff = require('gulp-ttf2woff'),
    ttf2woff2 = require('gulp-ttf2woff2'),
    fonter = require('gulp-fonter');



// Обновление браузера с помощью browserSync
function browserSync (params) {
    browsersync.init({
        server:{
            baseDir: "./" + project__folder + "/"
        },
        port: 3000,
        notify: false
    })
};
// Обработка файлов html
function html (){
    return src (path.src.html)
    // Сборка файлов с помощью плагина fileinclude и обновление браузера
    .pipe(fileInclude())
    .pipe(webp_html())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}
// Слежение за изменениями в файлах
function watchFiles(params){
    gulp.watch([path.watch.html],html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js],js);
    gulp.watch([path.watch.img],images);
}
// Очистка пути и папки dist
function clean(){
    return del(path.clean);
}
// Обработка файлов scss и обновление браузера
function css(){
    return src (path.src.css)
    .pipe(
        scss({
            outputStyle: 'expanded'
        })
    )
    .pipe(
        autoprefixer({
            overrideBrowserslist: ['last 5 versions'],
            cascade: true
        })
    )
    .pipe(group_media())
    .pipe(webpcss(['*.jpg','*.jpeg','*.png']))
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(rename({
        extname: '.min.css'
    }))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}
// Обработка файлов javascript
function js (){
    return src (path.src.js)
    .pipe(fileInclude())
    .pipe(dest(path.build.js))
    .pipe(uglify_es())
    .pipe(rename({
        extname: '.min.js'
    }))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}
// Обработка картинок
function images (){
    return src (path.src.img)
    .pipe(
        webp({
            quality: 70
        })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(imagemin())
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}
function fonts(){
    src(path.src.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts))
    return src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts))
}


//  Таск для свг спрайт, выполняется вручную
gulp.task('svg_sprite', function(){
    return gulp.src([source__folder + '/iconsprite/*.svg'])
    .pipe(
        svgSprite({
            mode:{
                stack:{
                    sprite: '../icons/icons.svg'
                }
            }
        }))
        .pipe(dest(path.build.img))
})
// task for fonts format otf, запустить вручную
gulp.task('fonter_task', function(){
    return gulp.src([source__folder + '/fonts/*.otf'])
    .pipe(fonter({
        formats: ['ttf']
    }))
    .pipe(dest(source__folder + '/fonts/'))
})
function cb (){

}
    function fontsStyle(params) {

        let file_content = fs.readFileSync(source__folder + '/scss/fonts.scss');
            if (file_content == '') {
                fs.writeFile(source__folder + '/scss/fonts.scss', '', cb);
                return fs.readdir(path.build.fonts, function (err, items) {
                    if (items) {
                        let c_fontname;
                        for (var i = 0; i < items.length; i++) {
                            let fontname = items[i].split('.');
                            fontname = fontname[0];
                            if (c_fontname != fontname) {
                                fs.appendFile(source__folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                            }
                        c_fontname = fontname;
                    }
                }
            })
        }
    }



let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;