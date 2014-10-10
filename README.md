# gulp-scale-css

Scale your entire website through CSS by scaling all unit values by a percentage.

## Usage

```js
var gulp = require('gulp');
var scale = require('gulp-scale-css');

gulp.task('scale', function () {
	return gulp.src('stylesheets/*.css')
		.pipe(scale({
            scale: 1.2
            units: 'px'
        }));
});
```

## Output

```css
// before
.wrapper {
    width:900px;
    font-size:14px;
    line-height:1.4em;
}
// after
.wrapper {
    width:1080px;
    font-size:16.8px;
    line-height:1.4em;
}
```

## Author

Meerkats The Brand Leadership Company in Subiaco, Western Australia.
