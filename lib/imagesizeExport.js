var fs = require('fs');
var glob = require('glob');
var path = require('path');
var _ = require('underscore');
var helpers = require('./utils');
var sizeOf = require('image-size');
var handlebars = require('handlebars');

var imageSizeExport;

var ImageSizeExport = function (obj) {
	this.options = {
		path: 'temp/pictures/**/*.jpg',
		output: 'test.json',
		breakpoints: 'file',
		delimiter: '--',
		template: '',
		types: [
			'.png',
			'.gif',
			'.bmp',
			'.psd',
			'.jpg',
			'.tiff',
			'.webp'
		]
	};

	this.options = _.defaults(obj || {}, this.options);
	this.options.path = glob.sync(this.options.path);
};

ImageSizeExport.prototype.getImageInfos = function () {
	var _this = this;
	var output = {};
	output.images = [];
	var validFiles = this.options.path;

	validFiles.forEach(function (file) {
		var width = sizeOf(file).width;
		var height = sizeOf(file).height;

		output.images.push({
			breakpoint: helpers.deleteExtension(file.substr(file.lastIndexOf(_this.options.delimiter) + _this.options.delimiter.length)),
			name: file.substr(file.lastIndexOf('/') + 1),
			path: file,
			width: width,
			height: height
		});
	});

	return output;
};

ImageSizeExport.prototype.render = function (callback) {
	var data = this.getImageInfos();
	this.options.template = this.options.template !== '' ? this.options.template : path.join(__dirname, '../templates/json.hbs');
	this.renderTemplate(data, callback);
};

ImageSizeExport.prototype.renderTemplate = function (data, callback) {
	var _this = this;

	fs.readFile(this.options.template, "utf-8", function (err, template) {
		if (err) {
			throw err;
		}

		var tpl = template.toString();
		var compiler = handlebars.compile(tpl);
		var source = compiler(data);

		helpers.write(_this.options.output, source, callback);
	});
};

var imageSize = new ImageSizeExport({
	output: 'new.json'
});

imageSize.render(function () {
	console.log('File successfully created.');
});

imageSizeExport = function (opts) {
	return new ImageSizeExport(opts);
};

module.exports = imageSizeExport;