var app = app || {};

(function () {
	'use strict';

    const PLACES = [
        'amusement_park',
        'aquarium',
        'art_gallery',
        'bar',
        'beauty_salon',
        'book_store',
        'bowling_alley',
        'cafe',
        'casino',
        'cemetery',
        'church',
        'city_hall',
        'clothing_store',
        'hindu_temple',
        'jewelry_store',
        'library',
        'mosque',
        'movie_theater',
        'museum',
        'night_club',
        'park',
        'place_of_worship',
        'restaurant',
        'shopping_mall',
        'spa',
        'synagogue',
        'zoo'
    ];

	app.MapView = Backbone.View.extend({
		el: '#map',

		initialize() {
			this.$input = $('#input');
            this.markers = [];
            this.currentMarker = null;
            this.infoWin = null;

			this.listenTo(app.places, 'add', this.addPlace);

            this.map = new google.maps.Map(this.$el[0], {
                center: {lat: 50, lng: 10},
                zoom: 7
            });
            this.placeService = new google.maps.places.PlacesService(this.map);

            // Set to the user position if there is no preset marker.
            !app.currentPlace && navigator.geolocation.getCurrentPosition(position => {
                this.map.setCenter({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            });
		},

		toMarker(id) {
            if (!id) { return; }

            if (this.infoWin) {
                // Close opened info window
                this.infoWin.close();
                this.infoWin = null;
            }

            this.markers.some((marker) => {
                // Find marker with id and focus on it
                if (marker.id === id) {
                    this.map.setCenter(marker.getPosition());
                    if (marker.placeInfo) {
                        // Show infoWindow for this place
                        this.infoWin = new google.maps.InfoWindow({
                            content: marker.placeInfo
                        });
                        this.infoWin.open(this.map, marker);
                    }

                    return true;
                }
            });
        },

		startAdding() {
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
                    let offset = e.pixel ? {
                        top: e.pixel.y,
                        left: e.pixel.x
                    } : {
                        top: e.sa.clientY,
                        left: e.sa.clientX
                    };
                    this.$input.css(offset);
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

        stopAdding() {
            this.map.setOptions({draggableCursor: 'default'});
            google.maps.event.clearListeners(this.map, 'click');
            this.currentMarker.setMap(null);

            this.$input.removeClass('visible');
            this.$input.off();
        },

        addMarker(model) {
            let {position, title, id} = model.attributes;
            let marker = new google.maps.Marker({
                map: this.map,
                position,
                title,
                id
            });

            marker.addListener('click', (param) => {
                app.router.navigate(`#${id}`, {trigger: true});
            });

            this.placeService.nearbySearch({
                location: position,
                types: PLACES,
                rankBy: google.maps.places.RankBy.DISTANCE
            }, (results, status) => {
                let content, img = '';
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    // Set the closest result
                    let place = results[0];
                    content = `Place name: ${place.name}`;
                    if (place.photos && place.photos.length) {
                        let url = place.photos[0].getUrl({
                            maxWidth: 150,
                            maxHeight: 150
                        });
                        img = `<div class="img"><img src="${url}" /></div>`;
                    }
                } else {
                    content = 'No information about this place';
                }

                marker.placeInfo = `
                    <div class="info">
                        ${img}
                        <div class="content">
                            <h1>${marker.title}</h1>
                            <p>${content}</p>
                        </div>
                    </div>`;
            });

            this.markers.push(marker);
        }
	});
})();
