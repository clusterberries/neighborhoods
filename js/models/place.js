/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	app.Place = Backbone.Model.extend({
		// Default attributes for the place
		defaults: {
			title: 'untitled',
			selected: false,
			hidden: false
		},

		select(selected) {
			this.set({selected});
		},

		hide(hidden = true) {
			this.set({hidden});
		}
	});
})();
