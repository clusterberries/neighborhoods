/*global Backbone, _ */
var app = app || {};

(function () {
	'use strict';

	app.AppView = Backbone.View.extend({

		el: '#app',

		events: {
			'click #add-btn': 'add'
		},

		initialize () {
			this.$list = $('#places-list');
			this.$label = $('#label');

			this.isAddingMode = false;
			this.map = new app.MapView();

			this.listenTo(app.places, 'add', this.addPlace);
		},

		render () {},

		add () {
			this.isAddingMode = !this.isAddingMode;
			this.$el.toggleClass('adding-mode');

			if (this.isAddingMode) {
				this.map.startAdding().then((data) => {
					app.places.create(data);
					this.isAddingMode = false;
					this.$el.removeClass('adding-mode');
				});
			} else {
				this.map.stopAdding();
			}
		},

		addPlace (model) {
			var view = new app.PlaceView({ model });
			this.$list.append(view.render().el);
		}
	});
})();
