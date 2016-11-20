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
			app.router.on('route:setPlace', this.route.bind(this));

			// Only renders when the 'reset' event is triggered at the end of the fetch.
			app.places.fetch({reset: true});
		},

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
			app.currentPlace && this.map.toMarker(Number.parseInt(app.currentPlace));
		},

		route (id) {
			id = id && Number.parseInt(id);
			app.places.select(id);
			this.map.toMarker(id);
		}
	});
})();
