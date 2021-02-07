var gulp = require('gulp');
var zip = require('gulp-zip')
var del = require('del');

var excludeFiles = [
    ".gitignore",
    "README.md",
    "gulpfile.js",
    "dist/**/*",
    ".vscode",
    "node_modules/**/*",
    ".DS_STORE",
    ".env.example",
    ".git/**/*",
    "searchlogs/**/*",
    "venv/**/*",
    "scripts/**/*",
    ".idea/**/*",
    "extras/**/*",
    "thumbnails.*",
    "api-logs/**/*"
];

var srcFiles = function () {
    var src = ["./**"];
    var exclude = excludeFiles.map((value) => {
        return "!" + value;
    });
    return [].concat(src, exclude);
}

gulp.task('zip', ['clean'], function () {
    return gulp.src(srcFiles(), {
        nodir: true,
        dot: true
    })
        .pipe(zip("api.zip"))
        .pipe(gulp.dest('dist/'))
});

gulp.task('clean', () => {
    return del(['dist/**/*', '!dist/**/*.jpg']);
})

// Gulp Commands

gulp.task('build', ['zip'])