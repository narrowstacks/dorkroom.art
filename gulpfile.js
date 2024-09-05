const gulp = require('gulp');
const replace = require('gulp-replace');
const git = require('gulp-git');
const fs = require('fs');

// Function to get the list of modified files (HTML, CSS, JS) from Git
function getModifiedFiles(cb) {
  let files = [];
  // Use `git diff --name-only` to get the list of modified files
  git.exec({ args: 'diff --name-only HEAD' }, function (err, stdout) {
    if (err) throw err;
    files = stdout
      .split('\n')
      .filter(file => 
        (file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.js')) && 
        fs.existsSync(file)
      ); // Only include HTML, CSS, and JS files that exist

    cb(null, files); // Pass the modified files to the callback
  });
}

// Cache-bust task for HTML files, only appending timestamps to updated CSS and JS files
gulp.task('cache-bust', function (done) { // Use 'done' to signal async completion
  getModifiedFiles(function (err, files) {
    if (files.length === 0) {
      console.log('No modified files found.');
      return done(); // No modified files, end the task
    }

    // Separate the modified CSS, JS, and HTML files
    const cssFiles = files.filter(file => file.endsWith('.css'));
    const jsFiles = files.filter(file => file.endsWith('.js'));
    const htmlFiles = files.filter(file => file.endsWith('.html'));

    if (cssFiles.length === 0 && jsFiles.length === 0) {
      console.log('No modified CSS or JS files found.');
      return done(); // No CSS or JS changes, no cache-busting needed
    }

    // Create a regex to match exactly the modified files' paths in the HTML files
    let cssRegex = cssFiles.map(file => file.replace('./', '').replace(/\./g, '\\.')).join('|');
    let jsRegex = jsFiles.map(file => file.replace('./', '').replace(/\./g, '\\.')).join('|');

    const timestamp = new Date().getTime(); // Use current timestamp for cache-busting

    if (htmlFiles.length > 0) {
      gulp.src(htmlFiles) // Only process the modified HTML files
        // Append timestamp only to the specific modified CSS file references in the HTML
        .pipe(replace(new RegExp(`(href=".*?(${cssRegex}))(?:"|\\?v=\\d+)`, 'g'), `$1?v=${timestamp}`))
        // Append timestamp only to the specific modified JS file references in the HTML
        .pipe(replace(new RegExp(`(src=".*?(${jsRegex}))(?:"|\\?v=\\d+)`, 'g'), `$1?v=${timestamp}`))
        .pipe(gulp.dest('./')) // Save the modified HTML files
        .on('end', done); // Signal completion once task is finished
    } else {
      done(); // No HTML files to process, signal task completion
    }
  });
});

// Default task to run cache-bust
gulp.task('default', gulp.series('cache-bust'));