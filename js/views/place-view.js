var app = app || {};

(function ($) {
	'use strict';

	app.PlaceView = Backbone.View.extend({
		tagName:  'li',

		// Cache the template function for a single item.
		template: _.template($('#item-template').html()),

		// The DOM events specific to an item.
		events: {
			'click .edit-btn': 'edit',
			'click .destroy': 'destroy'
		},

		initialize () {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render () {
			this.$el.html(this.template(this.model.toJSON()));
			// this.$input = this.$('.edit');
			return this;
		},

        edit () {

        },

		// Remove the item, destroy the model from *localStorage* and delete its view.
		destroy () {
			this.model.destroy();
		}
	});
})(jQuery);
