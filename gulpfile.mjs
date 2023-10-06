
import gulp from 'gulp';
import rev from 'gulp-rev';
// import imagemin from 'gulp-imagemin';
import cssnano from 'gulp-cssnano';


gulp.task('css', function(){
    console.log('minifying css...');
    gulp.src('./assets/css/**/*.css')
    .pipe(cssnano())
    .pipe(gulp.dest('./assets.css'));

    return gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
})
