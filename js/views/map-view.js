var app = app || {};

(function () {
	'use strict';

	app.MapView = Backbone.View.extend({
		el: '#map',

		events: {},

		initialize () {
			this.$input = $('#input');
            this.markers = [];
            this.currentMarker = null;

			this.listenTo(app.places, 'add', this.addPlace);
            app.NhRouter.on('route:setPlace', this.toMarker.bind(this));

            this.map = new google.maps.Map(this.$el[0], {
                center: {lat: 50, lng: 10},
                zoom: 5
            });

            // Set to the user position if there is no preset marker.
            !app.currentPlace && navigator.geolocation.getCurrentPosition(position => {
                this.map.setCenter({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            });
		},

		toMarker (id) {
            if (id) {
                id = Number.parseInt(id);
                this.markers.some((marker) => {
                    // Find marker with id and focus on it
                    if (marker.id === id) {
                        this.map.setCenter(marker.getPosition());
                        return true;
                    }
                });
            }
        },

		startAdding () {
            this.map.setOptions({draggableCursor: 'crosshair'});

            return new Promise((resolve, reject) => {
                var position;

                this.map.addListener('click', e => {
                    if (this.currentMarker) {
                        this.currentMarker.setMap(null);
                    }

                    position = e.latLng;
                    this.currentMarker = new google.maps.Marker({
                        position,
                        map: this.map,
                        title: ''
                    });

                    // Set the input below the marker
                    this.$input.css({
                        top: e.pixel.y,
                        left: e.pixel.x - this.$input.width() / 2
                    });
                    this.$input.addClass('visible');
                    this.$input.focus();
                });

                this.$input.on('keypress', e => {
                    if (e.which === 13) {
                        // User pressed enter, resolve with the title.
                        let title = this.$input.val() || 'untitled';
                        resolve({
                            title,
                            position
                        });
                        this.$input.val('');
                        this.stopAdding();
                    }
                });
            });
		},

        stopAdding () {
            this.map.setOptions({draggableCursor: 'default'});
            google.maps.event.clearListeners(this.map, 'click');
            this.currentMarker.setMap(null);

            this.$input.removeClass('visible');
            this.$input.off();
        },

        addMarker (model) {
            this.markers.push(new google.maps.Marker({
                position: model.attributes.position,
                map: this.map,
                title: model.attributes.title,
                id: model.attributes.id
            }));
        }
	});
})();
