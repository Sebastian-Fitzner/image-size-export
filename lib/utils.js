/**
 * Helper utilities
 */

var fs = require("fs");
var path = require("path");
var mkdirp = require("mkdirp");

var helpers = {};

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
			callback(null, filepath);
		});
	});
};

helpers.deleteExtension = function (filename) {
	return filename.replace(/\.[^/.]+$/, "");
};

module.exports = helpers;