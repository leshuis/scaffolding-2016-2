var gulp            = require('gulp'),
    autoprefixer    = require('gulp-autoprefixer'),
    babel           = require('gulp-babel'),
    cache           = require('gulp-cache'),
    concat          = require('gulp-concat'),
    connect         = require('gulp-connect'),
    cssmin          = require('gulp-cssmin'),
    csso            = require('gulp-csso'),
    del             = require('del'),
    fs              = require('fs'),
    handlebars      = require('gulp-compile-handlebars'),
    imagemin        = require('gulp-imagemin'),
    jshint          = require('gulp-jshint'),
    merge           = require('merge-stream'),
    notify          = require('gulp-notify'),
    path            = require('path'),
    plumber         = require('gulp-plumber'),
    rename          = require('gulp-rename'),
    responsive      = require('gulp-responsive-images'),
    runSequence     = require('run-sequence'),
    sass            = require('gulp-sass'),
    server          = require('gulp-server-livereload'),
    sitemap         = require('gulp-sitemap'),
    size            = require('gulp-size'),
    stylish         = require('jshint-stylish'),
    sourcemaps      = require('gulp-sourcemaps'),
    uglify          = require('gulp-uglify'),
    uncss           = require('gulp-uncss'),
    watch           = require('gulp-watch'),
    webp            = require('gulp-webp'),
    handlebar_variabels = require('./handlebar_vars.json');

    jshint.options = {
    "esversion": 6,
        "esnext": true,
        "moz": true
    };


/************************/

/************************/

var getFolders = function(dir) {
    var folders = [{path:'',name:'main'}];
    var folder = fs.readdirSync(dir)
        .filter(function(file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
    for (var i=0; i<folder.length;i++) {
        folders.push({path: folder[i], name: folder[i]});
    }
    return folders;
};

/************************/

/************************/

gulp.task('clean:destination', function () {
    del(['./dist/'], function (err, deletedFiles) {
    });
});

/************************/

/************************/

gulp.task('clear:image-cache', function (callback) {
    return cache.clearAll(callback)
});

/************************/

/************************/

gulp.task('copy:root-and-html-pages',['clean:destination'], function () {
    gulp.src(['./source/*.*','./source/**/*.html'])
    // .pipe(size())
        .pipe(gulp.dest('./dist/'))
        .pipe(notify({title: '>> Root and html pages copied <<', message: 'task complete', onLast: true, sound: 'Submarine'}));
});

/************************/

/************************/

gulp.task('process:handlebars', function() {
    var options = {
            ignorePartials: true, //ignores the unknown footer2 partial in the handlebars template, defaults to false
            batch : ['./source/patterns/'],
            helpers : {
                capitals : function(str){
                    return str.toUpperCase();
                },
                picture : function(url){

                    var str = '<img srcset="';
                    var splitUrl = url.split(".");
                    var base = handlebar_variabels.site[0].imagebase;

                    str += base + splitUrl[0] + "@1x." + splitUrl[1] + " 1x";
                    str += "," + base + splitUrl[0] + "@2x." + splitUrl[1] + " 2x";
                    str += "," + base + splitUrl[0] + "@1x.webp 1x";
                    str += "," + base + splitUrl[0] + "@2x.webp 2x";
                    str += '">';
                    return str;

                },
                now : function(){
                    return new Date().toLocaleString();
                },
                linkList: function(items, options) {
                    var out = "<ul>";

                    for(var i=0, l=items.length; i<l; i++) {
                        out = out + "<li><a href='" + items[i]['link'] + "'>" + items[i]['text'] + "</a></li>";
                    }

                    return out + "</ul>";
                },
                list : function(items, options) {
                    var out = "<ul>";

                    for(var i=0, l=items.length; i<l; i++) {
                        out = out + "<li>" + options.fn(items[i]) + "</li>";
                    }

                    return out + "</ul>";
                }
            }
        };

    return gulp.src('./source/content/**/*.handlebars')
        .pipe(handlebars(handlebar_variabels, options))
        .pipe(rename(function (path) {
            path.extname = ".html"
        }))
        .pipe(connect.reload())
        .pipe(gulp.dest('./dist/'));
});


/******* =scripts *****************/

gulp.task('process:scripts', function() {
    var folders = getFolders('./source/scripts/');

    var tasks = folders.map(function(folder) {
        if(folder.name === 'vendor'){
            return gulp.src('./source/scripts/vendor/*.js')
                .pipe(gulp.dest('./dist/scripts/vendor'));

        } else {
            return gulp.src(path.join('./source/scripts/', folder.path, '/*.js'))
            // .pipe(size({showFiles : true}))
                .pipe(sourcemaps.init())
                .pipe(jshint())
                .pipe(jshint.reporter(stylish))
                .pipe(babel({
                    presets: ['es2015','react'],

                }))
                .pipe(concat(folder.name + '.js'))
                .pipe(gulp.dest('./dist/scripts'))
                .pipe(uglify())
                .pipe(concat(folder.name + '.min.js'))
                .pipe(sourcemaps.write('../maps'))
                .pipe(gulp.dest('./dist/scripts'))
                .pipe(connect.reload())
                .pipe(notify({title: '>> Scripts processed <<', message: 'task complete', onLast: true, sound: 'Bottle'}));
        }
    });
    merge(tasks);
});

/********* =styles ***************/

gulp.task('process:styles', function () {
    return gulp.src('./source/styles/**/*.scss')
        .pipe(sass())
        // .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(autoprefixer('last 4 version'))
        .pipe(sourcemaps.init())
        // .pipe(size({showFiles : true}))
        .pipe(gulp.dest('./dist/styles'))
        .pipe(csso())
        .pipe(rename({suffix: '.min'}))
        .pipe(cssmin())
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('./dist/styles'))
        // .pipe(size())
        .pipe(connect.reload())
        .pipe(notify({title: '>> Styles processed <<', message: 'task complete', onLast: true, sound: 'Blow'}));
});

gulp.task('clean:styles', function () {
    return gulp.src('./dist/styles/main.css')
        .pipe(csso())
        .pipe(uncss({
            html: ['./dist/**/*.html']
        }))
        .pipe(rename({suffix: '.clean'}))
        .pipe(gulp.dest('./dist/styles'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssmin())
        .pipe(gulp.dest('./dist/styles'))
        .pipe(connect.reload())
        .pipe(notify({title: '>> Styles cleaned <<', message: 'task complete', onLast: true, sound: 'Blow'}));
});

/********* =images ***************/

gulp.task('process:images',function () {
    return gulp.src('source/images/**/*')
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('./dist/images'))
        // .pipe(size())
        .pipe(connect.reload())
        .pipe(notify({title: '>> Images processed <<', message: 'task complete', onLast: true, sound: 'Frog'}));
});

gulp.task('do:images-responsive', function () {
    gulp.src('source/images/**/*')
        .pipe(responsive({
            '*.*': [{
                width: 300,
                upscale: false,
                suffix: '-300px'
            }, {
                width: 500,
                upscale: false,
                suffix: '-500px'
            },{
                width: 700,
                upscale: false,
                suffix: '-700px'
            },{
                width: 700,
                upscale: false,
                crop: true,
                suffix: '-700px-crop',
                gravity: 'Center'
            },{
                width: 900,
                upscale: false,
                suffix: '-900px'
            },{
                width: 1100,
                upscale: false,
                suffix: '-1100px'
            },{
                width: 1300,
                upscale: false,
                suffix: '-1300px'
            },{
                width: 1500,
                upscale: false,
                suffix: '-1500px'
            },{
                width: 1700,
                upscale: false,
                suffix: '-1700px'
            },{
                width: 1900,
                upscale: false,
                suffix: '-1900px'
            },{
                width: 2100,
                upscale: false,
                suffix: '-2100px'
            },{
                width: '100%',
                suffix: '@1x'
            },{
                width: '200%',
                suffix: '@2x'
            },{
                width: '300%',
                suffix: '@3x'
            }]
        }))
        .pipe(gulp.dest('./dist/images'))
        .pipe(webp())
        .pipe(gulp.dest('dist/images'));
});

/********** =watch **************/

gulp.task('do:watch', function () {

    gulp.watch("./source/styles/**/*.scss", ['process:styles','clean:styles']);
    gulp.watch("./source/scripts/**/*", ['process:scripts']);
    gulp.watch("./source/images/**/*", ['process:images']);
    gulp.watch("./source/**/*.handlebars", ['process:handlebars']);
});

/********** =serve **************/

gulp.task('do:serve', function () {
    gulp.src('./dist/')
        .pipe(server({
            livereload: true,
            directoryListing: false,
            open: true
        }));
});

/******** =connect ****************/

gulp.task('do:connect', function () {
    connect.server({
        name: 'Dev App',
        root: ['./dist/'],
        port: 8000,
        livereload: true
    });
});

/******* =makesitemap *****************/

gulp.task('make:sitemap', function () {
    gulp.src('./dist/**/*.html', {
        read: false
    })
        .pipe(sitemap({
            siteUrl: 'http://www.amazon.com'
        }))
        .pipe(gulp.dest('./dist'));
});

/********* =steps ***************/

gulp.task('start',function(){
    runSequence('copy:root-and-html-pages',
        'process:handlebars',
        'process:styles',
        'process:scripts',
        'process:images',
        'do:images-responsive',
        'clean:styles',
        'do:connect',
        'do:watch'
    )
});

gulp.task('default', function(){
    runSequence('copy:root-and-html-pages',
            'process:handlebars',
            'process:styles',
            'process:scripts',
            'process:images',
            'do:images-responsive',
            'clean:styles'
    )
});