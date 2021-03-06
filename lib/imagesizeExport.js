var fs = require('fs');
var glob = require('glob');
var path = require('path');
var helpers = require('./utils');
var sizeOf = require('image-size');
var handlebars = require('handlebars');
var formatJSON = require('format-json');

var imageSizeExport;

var ImageSizeExport = function (obj) {
	this.options = {
		path: 'img/**/*.jpg',
		output: 'imageSizeExport.json',
		folderDepth: 1,
		categorizeBy: false,
		breakpointDelimiter: '--',
		template: path.join(__dirname, '../templates/simple.hbs'),
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

	this.options = helpers.extend(this.options, obj);
	this.options.path = glob.sync(this.options.path);
};

ImageSizeExport.prototype.getImageInfos = function () {
	var _this = this;
	var validFiles = this.options.path;
	var output = {
		images: [],
		breakpoints: [],
		folders: []
	};

	validFiles.forEach(function (file) {
		var width = sizeOf(file).width;
		var height = sizeOf(file).height;
		var breakpoint = helpers.deleteExtension(file.substr(file.lastIndexOf(_this.options.breakpointDelimiter) + _this.options.breakpointDelimiter.length));
		var folders = file.split('/');
		var folder = _this.getFolderDepth(folders);

		// Push breakpoints into our data array
		if (output.breakpoints.indexOf(breakpoint) == -1) output.breakpoints.push(breakpoint);

		// Push folders into our data array
		if (output.folders.indexOf(folder) == -1) output.folders.push(folder);

		// Push images into our data array
		output.images.push({
			breakpoint: breakpoint,
			name: file.substr(file.lastIndexOf('/') + 1),
			width: width,
			height: height,
			folder: folder,
			path: file
		});
	});

	return output;
};

ImageSizeExport.prototype.getFolderDepth = function (path) {
	var string = '';

	for (var i = this.options.folderDepth; i > 0; i--) {
		string = string + path[path.length - i - 1];

		if (i > 1) {
			string = string + '-';
		}
	}

	return string;
};

ImageSizeExport.prototype.record = function (callback) {
	var data = this.getImageInfos();

	if (this.options.categorizeBy) {
		data = this.categorizeData(data);
	}

	this.writeOutput(data, callback);
};

ImageSizeExport.prototype.categorizeData = function (data) {
	var categorizedData;

	switch (this.options.categorizeBy) {
		case 'breakpoints':
			// categorizedData = this.categorizeByBreakpoints(data);
			categorizedData = this.categorizeByData('breakpoints', data.breakpoints, data);
			break;

		case 'folders':
			categorizedData = this.categorizeByData('folders', data.folders, data);
			break;

		default:
			categorizedData = data;
			break;
	}

	return categorizedData;
};

ImageSizeExport.prototype.categorizeByData = function (cat, catData, data) {
	var modData = catData.map(function (val) {
		var obj = {};
		obj[val] = [];
		return obj;
	}, {});

	data.images.forEach(function (image) {
		var category = cat === 'breakpoints' ? image.breakpoint : image.folder;
		modData.forEach(function (key) {
			if (key[category] !== undefined) {
				key[category].push(image);
			}
		});
	});

	return modData;
};

ImageSizeExport.prototype.writeOutput = function (data, callback) {
	var _this = this;

	switch (_this.options.categorizeBy) {
		case 'breakpoints':
			helpers.write(_this.options.output, formatJSON.plain(data), callback);
			break;

		case 'folders':
			helpers.write(_this.options.output, formatJSON.plain(data), callback);
			break;

		default:
			fs.readFile(this.options.template, "utf-8", function (err, template) {
				var tpl = template.toString();
				var compiler = handlebars.compile(tpl);
				var source = compiler(data);

				if (err) {
					throw err;
				}

				helpers.write(_this.options.output, source, callback);
			});

			break;
	}
};

imageSizeExport = function (opts) {
	return new ImageSizeExport(opts);
};

imageSizeExport.record = function (opts, callback) {
	return imageSizeExport(opts).record(callback);
};

module.exports = imageSizeExport;