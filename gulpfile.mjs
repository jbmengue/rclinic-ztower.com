import gulp from 'gulp'
import gulpif from 'gulp-if'
import replace from 'gulp-replace';

import * as dartSass from 'sass'
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);

import sourcemaps from 'gulp-sourcemaps'
import postCss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'

import cleanCss from 'gulp-clean-css';

import browserify from 'browserify';
import babelify from 'babelify';
import tsify from 'tsify';
import buffer from 'vinyl-buffer'
import source from 'vinyl-source-stream';

import uglify from 'gulp-uglify';
import concat from 'gulp-concat';

import strip from 'gulp-strip-comments';

import jsonminify from 'gulp-jsonminify';

import chalk from 'chalk';
import dotenv from 'dotenv';
import { env } from 'process';
    
//import webp from 'gulp-webp';

const pathRoot = '';

const paths = {
    styles: {
        src: './resource/sass/**/*.page.scss',
        plugins: [
            './resource/dependencies/styles/fonts/**/*.css',
            './resource/dependencies/styles/plugins/**/**/*.css',
            './resource/dependencies/styles/plugins/**/*.css'
        ],
        all: './resource/sass/**/*.scss',
        dist: './' + pathRoot + '/assets/css'
    },
    typescript: {
        src: './resource/typescript',
        dist: './' + pathRoot + '/assets/js'
    },
    dependencies: {
        src: [
            './resource/dependencies/**/*.js',
        ],
        dist: './' + pathRoot + '/assets/js/dependencies'
    },
    images: {
        src: [
            './resource/images/**/*.jpg',
            './resource/images/**/*.jpeg',
            './resource/images/**/*.png',
            './resource/images/**/*.gif'
        ],
        dist: './' + pathRoot + '/assets/images'
    },
    json: {
        src: './resource/json/**/*.json',
        dist: './' + pathRoot + '/assets/json'
    },
}

const isProduction = () => {
    return (env.NODE_ENV === 'production') ? true : false 
}

const initializeEnvironment = () => {
    const pathRootEnviroment = './resource/environments/'
    const envFile = isProduction() ? `${pathRootEnviroment}.env.production` : `${pathRootEnviroment}.env.development`; 
    dotenv.config({ path: envFile });
    console.log(chalk.dim(`\nBASE_URL: ${env.BASE_URL}\n`));
}
initializeEnvironment();

const buildSass = () => {
    return gulp.src([paths.styles.src])
        .pipe(gulpif(!isProduction(), sourcemaps.init()))
        .pipe(sass.sync({includePaths: ['node_modules'], outputStyle: 'compressed', quietDeps: true, silenceDeprecations: ['import', 'global-builtin', 'legacy-js-api', 'lighten']}).on('error', sass.logError))
        .pipe(postCss([autoprefixer()]))
        .pipe(gulpif(!isProduction(), sourcemaps.write('.')))
        .pipe(gulp.dest(paths.styles.dist))
}

const buildCssPlugins = () =>{
    return gulp.src(paths.styles.plugins)
        .pipe(sourcemaps.init())
        .pipe(cleanCss())
        .pipe(concat({ path: 'plugins.css', stat: { mode: '0666' }}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.styles.dist))
}

const buildTypescript = () => {
    return browserify({
        basedir: '.',
        debug: true,
        entries: [`${paths.typescript.src}/main.ts`],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify, { noImplicitAny: true })
    .transform(babelify.configure({
        extensions: ['.ts']
    }))
    .bundle().on('error', (e) => console.log(e))
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(gulpif(!isProduction(), sourcemaps.init({loadMaps: true})))
    .pipe(gulpif(isProduction(), uglify()))
    .pipe(gulpif(!isProduction(), sourcemaps.write(".")))
    .pipe(replace(/ENVIRONMENT_BASE_URL/g, process.env.BASE_URL))
    .pipe(gulp.dest(paths.typescript.dist));
}

const buildDependencies = () => {
    return gulp.src(paths.dependencies.src)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(strip())
        .pipe(concat({ path: 'dependencies.js', stat: { mode: '0666' }}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dependencies.dist))
}

const buildJson = () =>{
    return gulp.src(paths.json.src)
        .pipe(jsonminify())
        .pipe(gulp.dest(paths.json.dist));
}

const watch = () => {
    gulp.watch(paths.styles.all, buildSass)
    gulp.watch(paths.styles.plugins, buildCssPlugins)
    gulp.watch(paths.dependencies.src, buildDependencies)
    gulp.watch(paths.typescript.src, buildTypescript)
    gulp.watch(paths.json.src, buildJson);
}

export const appSass = buildSass
export const appCssPlugins = buildCssPlugins
export const appTypescript = buildTypescript
export const appJsDependencies = buildDependencies
export const appJson = buildJson
export const appWatch = watch

export default  gulp.series(
    appJsDependencies,
    appTypescript,
    appCssPlugins,
    appSass,
    appJson,
    appWatch
)