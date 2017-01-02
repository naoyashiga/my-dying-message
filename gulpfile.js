var gulp = require('gulp'), 
    webserver = require('gulp-webserver');

gulp.task('server', function() {
  gulp.src('./')
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});

// Rerun the task when a file changes
 gulp.task('watch', function() {
     gulp.watch(['js/**/*.js','index.html']); 
});

  gulp.task('default', ['watch','server']);
