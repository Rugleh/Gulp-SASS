/*
--- Gulp Boilerplate file for front-end block based development
--- Author: Diego Rubilar
--- Year: 2021
*/

const gulp = require('gulp');
const fileinclude = require('gulp-file-include');
const server = require('browser-sync').create();
const { watch, series } = require('gulp');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');

const paths = {
    scripts: {
        src: './',
        dest: './build/'
    }
};

// Reload Server
async function reload() {
    server.reload();
}

// Copy assets after build
async function copyAssets() {
    gulp.src(['assets/**/*'])
        .pipe(gulp.dest(paths.scripts.dest));
}

// Build files html and reload server
async function buildAndReload() {
    await includeHTML();
    await copyAssets();
    reload();
}

// Sass compiler
async function compileSass() {
    gulp.src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./assets/css'));
}


async function includeHTML() {
    return gulp.src([
        '*.html',
        '!components/header.html', // ignore
        '!components/footer.html' // ignore
    ])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(paths.scripts.dest));
}
exports.includeHTML = includeHTML;

exports.default = async function () {
    // Init serve files from the build folder
    server.init({
        server: {
            baseDir: paths.scripts.dest
        }
    });
    // Watch Sass task
    watch('./sass/**/*.scss', series(compileSass));
    // Build and reload at the first time
    buildAndReload();
    // Watch task
    watch(["*.html", "assets/**/*"], series(buildAndReload));
};