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
			this.listenTo(app.places, 'reset', this.addAll);
			//this.listenTo(app.places, 'all', this.render);

			// Only renders when the 'reset' event is triggered at the end of the fetch.
			app.places.fetch({reset: true});
		},

		// render () {
		// 	console.log(app.places.length);
		// },

		add () {
			this.isAddingMode = !this.isAddingMode;
			this.$el.toggleClass('adding-mode');

			if (this.isAddingMode) {
				this.map.startAdding().then((data) => {
					data.id = app.places.nextId();
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
			this.map.addMarker(model);
		},

		addAll (model) {
			app.places.each(this.addPlace, this);
			// Focus on preset marker
			this.map.toMarker(app.currentPlace);
		}
	});
})();
