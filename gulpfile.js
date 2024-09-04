const gulp = require('gulp');
const replace = require('gulp-replace');

// Cache-bust task to append a unique query string (?v=timestamp) to CSS and JS references
gulp.task('cache-bust', function () {
  const timestamp = new Date().getTime(); // Use current timestamp for cache-busting
  
  return gulp.src('./**/*.html') // Process all HTML files in the root directory and subdirectories
    .pipe(replace(/\.css(\?v=\d+)?/g, '.css?v=' + timestamp)) // Append timestamp to CSS
    .pipe(replace(/\.js(\?v=\d+)?/g, '.js?v=' + timestamp))   // Append timestamp to JS
    .pipe(gulp.dest('./')); // Save the modified HTML files in their original location
});

// Default task to run cache-bust
gulp.task('default', gulp.series('cache-bust'));
