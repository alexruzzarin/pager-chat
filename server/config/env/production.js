/**
 * Created by alex on 20/04/15.
 */
'use strict';

module.exports = {
	port: process.env.PORT,
	log: {
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
		format: 'combined',
		// Stream defaults to process.stdout
		// Uncomment to enable logging to a log on the file system
		options: {
			stream: 'access.log'
		}
	},
	db: {
		uri: process.env.MONGOLAB_URI
	}
};
