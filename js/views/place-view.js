var app = app || {};

(function ($) {
	'use strict';

	app.PlaceView = Backbone.View.extend({
		tagName:  'li',

		// Cache the template function for a single item.
		template: _.template($('#item-template').html()),

		// The DOM events specific to an item.
		events: {
			'click a': 'select'
		},

		initialize() {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render() {
            let id = app.currentPlace && Number.parseInt(app.currentPlace);
            // Check is current place is active
            this.model.select(id === this.model.id);
			this.$el.html(this.template(this.model.toJSON()));

			return this;
		}
	});
})(jQuery);
