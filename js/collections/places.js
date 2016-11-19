/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// The collection of places is backed by localStorage instead of a remote server.
	var Places = Backbone.Collection.extend({
		model: app.Place,

		localStorage: new Backbone.LocalStorage('places'),

		nextId: function () {
			return this.length ? this.last().get('id') + 1 : 1;
		},

		comparator: 'id'
	});

	app.places = new Places();
})();
