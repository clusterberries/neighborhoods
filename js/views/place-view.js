var app = app || {};

(function ($) {
	'use strict';

	app.PlaceView = Backbone.View.extend({
		tagName:  'li',

		// Cache the template function for a single item.
		template: _.template($('#item-template').html()),

		initialize() {
			this.listenTo(this.model, 'change', this.render);
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
