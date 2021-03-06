/**
 * Helper utilities
 */

var fs = require("fs");
var path = require("path");
var mkdirp = require("mkdirp");
var handlebars = require('handlebars');

var helpers = {};

handlebars.registerHelper('is', function (value, test, options) {
	if (value === test) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});

helpers.extend = function (a, b) {
	for (var key in b) {
		if (b.hasOwnProperty(key)) {
			a[key] = b[key];
		}
	}
	return a;
};

helpers.cleanupPath = function (path) {
	if (path !== '') {
		return path.replace(/\/?$/, '/');
	}
};

helpers.write = function (filepath, data, callback) {
	mkdirp(path.dirname(filepath), function (err) {
		if (err) {
			throw err;
		}
		fs.writeFile(filepath, data, function (err) {
			if (err) {
				throw err;
			}
			if (callback) {
				callback(null, filepath);
			} else {
				console.log('File ' + filepath + ' successfully created.');
			}
		});
	});
};

helpers.deleteExtension = function (filename) {
	return filename.replace(/\.[^/.]+$/, "");
};

module.exports = helpers;