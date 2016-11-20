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

		initialize () {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render () {
			this.$el.html(this.template(this.model.toJSON()));
            this.model.get('selected') && app.places.select(this.model);
			return this;
		},

        select () {
            app.places.select(this.model);
        }
	});
})(jQuery);
