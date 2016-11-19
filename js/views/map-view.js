var app = app || {};

(function () {
	'use strict';

	app.MapView = Backbone.View.extend({
		el: '#map',

		events: {},

		initialize () {
			this.$input = $('#input');
            this.markers = [];

			this.listenTo(app.places, 'add', this.addPlace);

            this.map = new google.maps.Map(this.$el[0], {
                center: {lat: 50, lng: 10},
                zoom: 5
            });

            navigator.geolocation.getCurrentPosition(position => {
                this.map.setCenter({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            });
		},

		render () {},

		startAdding () {
            this.map.setOptions({draggableCursor: 'crosshair'});

            return new Promise((resolve, reject) => {
                var marker,
                    position;

                this.map.addListener('click', e => {
                    if (marker) {
                        marker.setMap(null);
                    }

                    position = e.latLng;
                    marker = new google.maps.Marker({
                        position,
                        map: this.map,
                        title: ''
                    });

                    // Set the input below the marker
                    this.$input.offset({
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
                        // The marker will be shown after place is created and saved
                        marker.setMap(null);
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

            this.$input.removeClass('visible');
            this.$input.off();
        },

        addMarker (model) {
            this.markers.push(new google.maps.Marker({
                position: model.attributes.position,
                map: this.map,
                title: model.attributes.title
            }));
        }
	});
})();
