/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// The collection of places is backed by localStorage instead of a remote server.
	var Places = Backbone.Collection.extend({
		model: app.Place,

		localStorage: new Backbone.LocalStorage('places'),
	});

	app.places = new Places();
})();
