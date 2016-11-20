/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// The collection of places is backed by localStorage instead of a remote server.
	var Places = Backbone.Collection.extend({
		model: app.Place,

		localStorage: new Backbone.LocalStorage('places'),

		nextId() {
			return this.length ? this.last().get('id') + 1 : 1;
		},

		comparator: 'id',

		select(post) {
			// Unselect all places except current
			for (let i = 0; i < this.length; ++i) {
				let model = this.models[i];
				model.select(post === model);
			}
		}
	});

	app.places = new Places();
})();
