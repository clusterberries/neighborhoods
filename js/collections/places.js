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

		select(id) {
			// Unselect all places except current
			for (let i = 0; i < this.length; ++i) {
				let model = this.models[i];
				model.select(id === model.id);
			}
		},

		filter(value) {
			// Show places that contain the value
			for (let i = 0; i < this.length; ++i) {
				let model = this.models[i];
				model.hide(value && !model.attributes.title.includes(value));
			}
		}
	});

	app.places = new Places();
})();
