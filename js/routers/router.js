/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	var NhRouter = Backbone.Router.extend({
		routes: {
			'*filter': 'setFilter'
		},

		setFilter (param = '') {
			app.NhFilter = param;
		}
	});

	app.NhRouter = new NhRouter();
	Backbone.history.start();
})();
