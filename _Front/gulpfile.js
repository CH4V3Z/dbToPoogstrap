'use strict'
let gulp = require('gulp')
let pug = require('gulp-pug');
let watch = require('gulp-watch');

gulp.task('pug', ()=> {
	return gulp.src("./src/app/**/*.pug")
	.pipe(pug({pretty: true}))
	.pipe(gulp.dest("./src/app/"));
});

gulp.task('pug:watch',  ()=> {
	gulp.watch(["./src/app/*.pug","./src/app/components/**/*.pug","./src/app/routes/**/*.pug","./src/app/layout/**/*.pug"], ['pug']);
});

gulp.task('watch', ()=> {
	gulp.watch(
		["./src/app/*.pug","./src/app/components/**/*.pug","./src/app/routes/**/*.pug","./src/app/layout/**/*.pug"],['pug']);
});

//gulp.watch(, ['sass']);
