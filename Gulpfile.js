var fs = require('fs');
var gulp = require('gulp');
var awspublish = require('gulp-awspublish');
var parallelize = require("concurrent-transform");

gulp.task('aws-deploy', function() {
	var creds = JSON.parse(fs.readFileSync('./aws.json'));

	var publisher = awspublish.create({
		"params": {
			"Bucket": creds.bucket
		},
		"accessKeyId": creds.key,
		"secretAccessKey": creds.secret,
		"region": creds.region
	});

	var headers = {
		'Cache-Control': 'max-age=86400, public'
	};

	return gulp
		.src(['**/*', '!**/node_modules/', '!**/node_modules/**', '!aws.json', '!Gulpfile.js', '!Gruntfile.js', '!*.md', '!package.json'])
		.pipe(parallelize(publisher.publish(headers), 50))
		.pipe(publisher.cache())
		.pipe(awspublish.reporter());
});
