var gulp = require('gulp'), 
    ghPages = require('gulp-gh-pages'), 
    webserver = require('gulp-webserver');

gulp.task('server', function() {
  gulp.src('./src/')
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});

// Rerun the task when a file changes
 gulp.task('watch', function() {
     gulp.watch(['src/js/**/*.js','src/index.html']); 
});

gulp.task('deploy', () => {
  return gulp.src('./src/**/*')
    .pipe(ghPages({
      remoteUrl: "https://github.com/naoyashiga/my-dying-message"
    }));
});

  gulp.task('default', ['watch','server']);
