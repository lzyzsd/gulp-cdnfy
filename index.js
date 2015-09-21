var through = require("through2"),
	gutil = require("gulp-util"),
	cdnfy = require('cdnfy');

function pluginError(msg) {
	return new gutil.PluginError("gulp-cdnfy", msg);
}

module.exports = function(opts) {
	"use strict";

	var cdnfyHandler = cdnfy(opts);


	//noinspection JSUnusedLocalSymbols
	function cdnfyStream(file, enc, callback) {

		// Do nothing if no contents
		if(file.isNull()) {
			this.push(file);
			return callback();
		}

		if(file.isStream()) {
			this.emit("error", pluginError("Stream content is not supported"));
			return callback();
		}

		// check if file.contents is a `Buffer`
		if(file.isBuffer()) {
			try {
				file.contents = new Buffer(cdnfyHandler(String(file.contents)));
				this.push(file);
			} catch(error) {
				this.emit("error", pluginError(error.toString()))
			}
		}
		return callback();
	}

	return through.obj(cdnfyStream);
};
