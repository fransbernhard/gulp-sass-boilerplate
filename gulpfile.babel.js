import gulp from 'gulp';
import sass from 'gulp-sass';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import del from 'del';
import imagemin from 'gulp-imagemin';
import autoprefixer from 'gulp-autoprefixer';

var browserSync = require('browser-sync').create();
 
const paths = {
    styles: {
        src: 'app/sass/style.scss',
        dest: 'dist/',
    },
    scripts: {
        src: 'app/js/**/*.js',
        dest: 'dist/',
    },
    img: {
        src: 'app/img/**/*',
        dest: 'dist/img/',
    }
};
 
export const clean = () => del([ 'dist' ]);
 
function styles(){
    return gulp.src(paths.styles.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(rename({
			suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}
 
function scripts(){
	return gulp.src(paths.scripts.src, {
		sourcemaps: true 
	})
		.pipe(babel())
		.pipe(uglify())
		.pipe(concat('script.min.js'))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

function images(){
	return gulp.src(paths.img.src)
		.pipe(imagemin())
		.pipe(gulp.dest(paths.img.dest))
}

/*
 * Define tasks
 */
 
function development() {
    browserSync.init({
        server: "./"
    });

	gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.styles.src, styles);
    gulp.watch("./*.html").on('change', browserSync.reload);
}
export { development as watch };

const build = gulp.series(clean, gulp.parallel(styles, scripts, images));
export default build;