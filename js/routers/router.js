/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	var Router = Backbone.Router.extend({
		routes: {
			'*place': 'setPlace'
		},

		setPlace (param = '') {
			app.currentPlace = param;
		}
	});

	app.router = new Router();
	Backbone.history.start();
})();
