/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	var NhRouter = Backbone.Router.extend({
		routes: {
			'*place': 'setPlace'
		},

		setPlace (param = '') {
			app.currentPlace = param;
		}
	});

	app.NhRouter = new NhRouter();
	Backbone.history.start();
})();
