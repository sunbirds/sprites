var gulp = require('gulp');
var buffer = require('vinyl-buffer');
var csso = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var merge = require('merge-stream');

var spritesmith = require('gulp.spritesmith');
var replace = require('gulp-replace');

gulp.task('sprite', function () {
  // Generate our spritesheet
  var spriteData = gulp.src('./icon/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.scss',
    cssTemplate: 'handlebarsStr.css.handlebars',
    algorithm:'binary-tree',//left-right,top-down,binary-tree
    padding: 10
  }));

  // Pipe image stream through image optimizer and onto disk
  var imgStream = spriteData.img
  // DEV: We must buffer our stream into a Buffer for `imagemin`
  .pipe(buffer())
  .pipe(imagemin())
  .pipe(gulp.dest('./dist/img/'));

  // Pipe CSS stream through CSS optimizer and onto disk
  var cssStream = spriteData.css
  // .pipe(csso())
  .pipe(gulp.dest('./dist/css/'));

  // Return a merged stream to handle both `end` events
  return merge(imgStream, cssStream);
});

gulp.task('replace',['sprite'], function(){
  gulp.src('./dist/css/sprite.scss')
    .pipe(replace(/(\d+)px/g, 'rem($1)'))
    .pipe(replace(/-rem\((\d+)\)/g, 'rem(-$1)'))
    .pipe(replace(/sprite.png/g, '../img/sprite.png'))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('default',['sprite','replace']);
