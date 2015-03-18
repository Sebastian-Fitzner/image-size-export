'use strict';

module.exports = function (grunt) {
	var pkg = require('../package.json');

	grunt.registerMultiTask('imageSizeExport', pkg.description, function () {
		var imageSizeExport = require('../index');
		var path = require('path');

		var options = this.options({
			path: 'img/**/*.jpg',
			output: 'imageSizeExport.json',
			folderDepth: 1,
			categorizeBy: false,
			breakpointDelimiter: '--',
			types: [
				'.png',
				'.gif',
				'.bmp',
				'.psd',
				'.jpg',
				'.tiff',
				'.webp'
			]
		});

		var done = this.async();

		console.log("Getting image infos ...");

		imageSizeExport.record(options, function () {
			console.log("Done.");
			done();
		});

	});
};
