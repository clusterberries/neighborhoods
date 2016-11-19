var app = app || {};

// Function to call when the map is loaded.
var initMap;

(function () {
	'use strict';

    var _map;

    initMap = () => {
        _map = new google.maps.Map($('#map')[0], {
            center: {lat: 50, lng: 10},
            zoom: 5
        });

        navigator.geolocation.getCurrentPosition(position => {
            _map.setCenter({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        });
    };

	app.MapView = Backbone.View.extend({
		el: '#map',

		events: {},

		initialize () {
			this.$input = $('#input');

			this.listenTo(app.places, 'add', this.addPlace);
		},

		render () {},

		startAdding () {
            _map.setOptions({draggableCursor: 'crosshair'});

            return new Promise((resolve, reject) => {
                _map.addListener('click', e => {
                    var position = e.latLng;
                    var marker = new google.maps.Marker({
                        position,
                        map: _map,
                        title: ''
                    });

                    // Set the input below the marker
                    this.$input.offset({
                        top: e.pixel.y,
                        left: e.pixel.x - this.$input.width() / 2
                    });
                    this.$input.addClass('visible');
                    this.$input.focus();
                    this.$input.on('keypress', e => {
                        if (e.which === 13) {
                            // User pressed enter, resolve with the title.
                            let title = this.$input.val() || 'untitled';
                            marker.setTitle(title);
                            resolve({
                                title,
                                position
                            });
                            this.$input.val('');
                            this.stopAdding();
                        }
                    });
                });
            });
		},

        stopAdding () {
            _map.setOptions({draggableCursor: 'default'});
            this.$input.removeClass('visible');
            this.$input.off();
        }
	});
})();
