var app = app || {};

function initMap() {
	app.map = new google.maps.Map($('#map')[0], {
		center: {lat: 50, lng: 10},
		zoom: 7
	});

    navigator.geolocation.getCurrentPosition(position => {
		app.map.setCenter({
			lat: position.coords.latitude,
			lng: position.coords.longitude
		});
	});
}

(function () {
	'use strict';

	new app.AppView();
})();
