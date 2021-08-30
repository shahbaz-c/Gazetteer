// Add map layers
var atlas = L.tileLayer(
	'https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=49c8e7a325eb4028b9672341a1241e33'
);

var transportDark = L.tileLayer(
	'https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=49c8e7a325eb4028b9672341a1241e33'
);

var landscape = L.tileLayer(
	'https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=49c8e7a325eb4028b9672341a1241e33'
);

var mobileAtlas = L.tileLayer(
	'https://tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png?apikey=49c8e7a325eb4028b9672341a1241e33'
);

var baseMaps = {
	Atlas: atlas,
	'Transport-Dark': transportDark,
	Landscape: landscape,
	'Mobile-Atlas': mobileAtlas,
};

var map = L.map('map', {
	layers: [atlas],
});

L.control.layers(baseMaps).addTo(map);

map.zoomControl.setPosition('bottomright');

// Generate select drop down
$(window).on('load', function () {
	$.ajax({
		url: 'libs/php/getGeoJSON.php',
		type: 'POST',
		dataType: 'json',

		success: function (result) {
			for (var i = 0; i < result.data.length; i++) {
				$('#countrySearch').append(
					$('<option>', {
						value: result.data[i].code,
						text: result.data[i].name,
					})
				);
			}

			getUserLocation();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert('Error fetching Country Select data!');
		},
	});
});

// ****************************************************************

// Get country information from API and populate section
function getCountryData() {
	$.ajax({
		url: 'libs/php/getCountryData.php',
		type: 'POST',
		dataType: 'json',
		data: {
			isoCode: $('#countrySearch').val(),
		},

		success: function (result) {
			if (result.status.name == 'ok') {
				var popultation = result.data[0].population.toLocaleString('en-GB');
				var lat = result.data[0].latlng[0].toLocaleString('en-GB');
				var lng = result.data[0].latlng[1].toLocaleString('en-GB');

				$('#country').html(result['data'][0]['name']);
				$('#flag').attr('src', result['data'][0]['flag']);
				$('#capital').html(result['data'][0]['capital']);
				$('#population').html(popultation);
				$('#latlng').html(`${lat}, ${lng}`);
				$('#currency').html(result['data'][0]['currencies'][0]['name']);
				$('#region').html(result['data'][0]['region']);
				$('#subRegion').html(result['data'][0]['subregion']);
				$('#language').html(result['data'][0]['languages'][0]['name']);

				// Change currency to selected countries currency
				$('#currencyFrom').val(result.data[0].currencies[0].code).change();
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert('Error fetching country data!');
		},
	});
}

// ****************************************************************

// Weather modal for capital city
function getWeatherData() {
	$.ajax({
		url: 'libs/php/getWeatherData.php',
		type: 'POST',
		dataType: 'json',
		data: {
			isoCode: $('#countrySearch').val(),
		},

		success: function (result) {
			if (result.status.name == 'ok') {
				var sunrise = new Date(result.weather.sys.sunrise * 1000)
					.toISOString()
					.substr(11, 8);

				var sunset = new Date(result.weather.sys.sunset * 1000)
					.toISOString()
					.substr(11, 8);

				$('#weatherLocation').html(
					`${result.weather.name}, <i>${result.geonames.geonames[0].countryName}</i>`
				);

				$('#weatherIcon').attr(
					'src',
					`http://openweathermap.org/img/wn/${result.weather.weather[0].icon}.png`
				);

				$('#description').html(result.weather.weather[0].main);

				$('#temp').html(`${result.weather.main.temp}&deg;C`);

				$('#minTemp').html(`${result.weather.main.temp_min}&deg;C`);

				$('#maxTemp').html(`${result.weather.main.temp_max}&deg;C`);

				$('#wind').html(`${result.weather.wind.speed}m/s`);

				$('#sunrise').html(`${sunrise} GMT`);

				$('#sunset').html(`${sunset} GMT`);
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert('Error fetching Weather data!');
		},
	});
}

// ****************************************************************

// Populate currency select
function getCurrencyList() {
	$.ajax({
		url: 'libs/php/getCurrencyJSON.php',
		type: 'POST',
		dataType: 'json',

		success: function (result) {
			for (var i = 0; i < result.data.length; i++) {
				$('.currency-list').append(
					$('<option>', {
						value: result.data[i].code,
						text: `${result.data[i].name} (${result.data[i].symbol})`,
					})
				);
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert('Error fetching currency list data!');
		},
	});
}

getCurrencyList();

// ****************************************************************

// Currency conversion
var currencySelect = $('#currencyData').find('select');
var currencyInput = $('#currencyData').find('input');

function getExchangeRates() {
	$.ajax({
		url: 'libs/php/getExchangeRates.php',
		type: 'POST',
		dataType: 'json',

		success: function (result) {
			if (result.status.name == 'ok') {
				function conversion(a, b) {
					currencyInput[a].value = (
						(currencyInput[b].value *
							result.data.rates[currencySelect[a].value]) /
						result.data.rates[currencySelect[b].value]
					).toFixed(2);
				}

				currencyInput.bind('click keyup', () => conversion(1, 0));
				currencyInput
					.filter(':visible:first')
					.bind('click keyup', () => conversion(0, 1));
				currencySelect.on('change', () => conversion(1, 0));
				currencySelect
					.filter(':visible:first')
					.on('change', () => conversion(0, 1));
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert('Error fetching currency exchange data!');
		},
	});
}

// ****************************************************************

// Populate News modal
function getNewsData() {
	$.ajax({
		url: 'libs/php/getNewsData.php',
		type: 'POST',
		dataType: 'json',
		data: {
			country: $('#countrySearch option:selected').text(),
		},

		success: function (result) {
			if (result.status.name == 'ok') {
				$('#newsItem1').html(result.data.data[0].title);
				$('#newsItem2').html(result.data.data[1].title);
				$('#newsItem3').html(result.data.data[2].title);
				$('#newsItem4').html(result.data.data[3].title);
				$('#newsItem5').html(result.data.data[4].title);

				$('#description1').html(result.data.data[0].description);
				$('#description2').html(result.data.data[1].description);
				$('#description3').html(result.data.data[2].description);
				$('#description4').html(result.data.data[3].description);
				$('#description5').html(result.data.data[4].description);

				$('#newsLink1').attr('href', result.data.data[0].url);
				$('#author1').html(result.data.data[0].source);
				$('#newsLink2').attr('href', result.data.data[1].url);
				$('#author2').html(result.data.data[1].source);
				$('#newsLink3').attr('href', result.data.data[2].url);
				$('#author3').html(result.data.data[2].source);
				$('#newsLink4').attr('href', result.data.data[3].url);
				$('#author4').html(result.data.data[3].source);
				$('#newsLink5').attr('href', result.data.data[4].url);
				$('#author5').html(result.data.data[4].source);
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert('Error fetching News data!');
		},
	});
}

// ****************************************************************

// Populate Wikipedia Modal
function getWikiData() {
	$.ajax({
		url: 'libs/php/getWikiData.php',
		type: 'POST',
		dataType: 'json',
		data: {
			country: $('#countrySearch option:selected').text(),
		},

		success: function (result) {
			if (result.status.name == 'ok') {
				if (
					result.data.geonames[0].title ==
					$('#countrySearch option:selected').text()
				) {
					$('#summary').html(result.data.geonames[0].summary);
					$('#wikiLink').attr(
						'href',
						'https://' + result.data.geonames[0].wikipediaUrl
					);
				} else {
					for (var i = 0; i < result.data.geonames.length; i++) {
						if (
							result.data.geonames[i].title ==
							$('#countrySearch option:selected').text()
						) {
							$('#summary').html(result.data.geonames[i].summary);
							$('#wikiLink').attr(
								'href',
								'https://' + result.data.geonames[i].wikipediaUrl
							);
						}
					}
				}
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert('Error fetching wikipedia data!');
		},
	});
}

// ****************************************************************

// Add city markers on country select
function getCitiesData() {
	$.ajax({
		url: 'libs/php/getCitiesData.php',
		type: 'POST',
		dataType: 'json',
		data: {
			isoCode: $('#countrySearch').val(),
			limit: 30,
		},

		success: function (result) {
			if (result.status.name == 'ok') {
				var marker = L.markerClusterGroup();
				var city = result.data;

				var cityIcon = L.divIcon({
					html: '<img src="https://img.icons8.com/color-glass/48/000000/place-marker.png"/>',
					iconSize: [30, 30],
					className: 'cityIcon',
				});

				for (let i = 0; i < city.length; i++) {
					marker.addLayer(
						L.marker(
							[city[i].coordinates.latitude, city[i].coordinates.longitude],
							{ icon: cityIcon }
						).bindPopup(`
						<h5>
						<b>${city[i].name}</b>, <i>${city[i].country.name}</i>
						</h5>
						<h6>
						<b>Population:</b> ${city[i].population.toLocaleString('en-GB')} <br>
						<b>Latitude:</b> ${city[i].coordinates.latitude.toLocaleString('en-GB')} <br>
						<b>Longitude:</b> ${city[i].coordinates.longitude.toLocaleString('en-GB')}
						</h6>
						`)
					);

					map.addLayer(marker);
				}
				// Remove marker on country change
				$('#countrySearch').on('change', function () {
					marker.clearLayers();
				});

				// Clear City markers on POI Button click
				$('#poiBtn').on('click', function () {
					marker.clearLayers();
				});
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert('Error fetching Cities data!');
		},
	});
}

// ****************************************************************

// Populate Covid modal
function getCovidData() {
	$.ajax({
		url: 'libs/php/getCovidData.php',
		type: 'POST',
		dataType: 'json',
		data: {
			isoCode: $('#countrySearch').val(),
		},

		success: function (result) {
			if (result.status.name == 'ok') {
				if (
					result.data.message != "Country not found or doesn't have any cases"
				) {
					$('#covidCountry').html(result.data.country);
					$('#newCases').html(result.data.todayCases.toLocaleString('en-GB'));
					$('#todayDeaths').html(
						result.data.todayDeaths.toLocaleString('en-GB')
					);
					$('#tests').html(result.data.tests.toLocaleString('en-GB'));
					$('#active').html(result.data.active.toLocaleString('en-GB'));
					$('#critical').html(result.data.critical.toLocaleString('en-GB'));
					$('#totalCases').html(result.data.cases.toLocaleString('en-GB'));
					$('#recovered').html(result.data.recovered.toLocaleString('en-GB'));
					$('#deaths').html(result.data.deaths.toLocaleString('en-GB'));
				} else {
					$('#covidCountry').html('No data available.');
					$('#newCases').html('N/A');
					$('#todayDeaths').html('N/A');
					$('#tests').html('N/A');
					$('#active').html('N/A');
					$('#critical').html('N/A');
					$('#totalCases').html('N/A');
					$('#recovered').html('N/A');
					$('#deaths').html('N/A');
				}
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert('Error fetching Covid data!');
		},
	});
}

// ****************************************************************

// Add POI marker to capital cities
function getPOIData() {
	$.ajax({
		url: 'libs/php/getPOIData.php',
		type: 'POST',
		dataType: 'json',
		data: {
			isoCode: $('#countrySearch').val(),
		},

		success: function (result) {
			if (result.status.name == 'ok') {
				var marker = L.markerClusterGroup();
				var place = result.poi.results;

				var poiIcon = L.divIcon({
					html: '<img src="https://img.icons8.com/color/48/000000/museum.png"/>',
					iconSize: [30, 30],
					className: 'poiIcon',
				});

				for (let i = 0; i < place.length; i++) {
					marker.addLayer(
						L.marker([place[i].location.lat, place[i].location.lng], {
							icon: poiIcon,
						}).bindPopup(
							`<h5><b>${place[i].name}</b></h5>
							<h6>${place[i].address}</h6>`
						)
					);

					map.addLayer(marker);
					map.panTo([place[i].location.lat, place[i].location.lng]);
				}

				// Clear markers on country change
				$('#countrySearch').on('change', function () {
					marker.clearLayers();
				});
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert('Error fetching POI data!');
		},
	});
}

// ****************************************************************

// AJAX call to change position of map to selected country
var border;

$('#countrySearch').change(function () {
	var name = $('#countrySearch').val();
	$.ajax({
		url: 'libs/php/getBorderJSON.php',
		type: 'POST',
		dataType: 'json',
		success: function (result) {
			const filterBorder = result.data.filter((b) => b.code === name);

			border = L.geoJSON(filterBorder[0]['border']);
			map.fitBounds(border.getBounds());

			// Highlight and reset selected country on mouseover/mouseout
			function highlightFeature(e) {
				var layer = e.target;

				layer.setStyle({
					weight: 2,
				});
			}

			function resetHighlight(e) {
				geojson.resetStyle(e.target);
			}

			function onEachFeature(feature, layer) {
				layer.on({
					mouseover: highlightFeature,
					mouseout: resetHighlight,
				});
			}

			geojson = L.geoJson(filterBorder[0]['border'], {
				onEachFeature: onEachFeature,
			}).addTo(map);

			$('#countrySearch').change(function () {
				geojson.remove();
			});
		},
	});

	// Show POI for country on button click
	$('#poiBtn').on('click', function () {
		getPOIData();
	});

	getCountryData();
	getWikiData();
	getWeatherData();
	getNewsData();
	getCitiesData();
	getCovidData();
	getExchangeRates();
});

// ****************************************************************

// Get user country location on load
var latlng = [];

function getCountryOnLoad() {
	$.ajax({
		url: 'libs/php/getCountryOnLoad.php',
		type: 'POST',
		dataType: 'json',
		data: {
			lat: latlng[0],
			lng: latlng[1],
		},

		success: function (result) {
			if (result.status.name == 'ok') {
				$('#countrySearch')
					.val(result.data.results[0].components['ISO_3166-1_alpha-2'])
					.change();
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert('Error fetching country on load data!');
		},
	});
}

function userLocation(position) {
	let latitude = position.coords.latitude;
	let longitude = position.coords.longitude;
	latlng.push(latitude);
	latlng.push(longitude);
	getCountryOnLoad();
}

// Set default position if unable to find user location
function defaultCountry() {
	latlng.push(51.52255);
	latlng.push(-0.10249);
	getCountryOnLoad();
}

function getUserLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(userLocation);
	} else {
		// No browser supports geolocation service
		console.log('Geolocation is not supported by this browser.');
		defaultCountry();
	}
}

// ****************************************************************

// Buttons

var info = L.easyButton({
	position: 'topright',
	id: 'countryDataBtn',
	states: [
		{
			icon: '<i class="fas fa-info fa-lg"></i>',
			title: 'CountryData',
			onClick: function () {
				$('#countryData').modal('show');
			},
		},
	],
});

info.addTo(map);

var weather = L.easyButton({
	position: 'topright',
	id: 'weatherBtn',
	states: [
		{
			icon: '<i class="fas fa-cloud-sun fa-lg"></i>',
			title: 'Weather',
			onClick: function () {
				$('#weatherData').modal('show');
			},
		},
	],
});

weather.addTo(map);

var currency = L.easyButton({
	position: 'topright',
	id: 'currencyBtn',
	states: [
		{
			icon: '<i class="fas fa-euro-sign fa-lg"></i>',
			title: 'Currency Exchange',
			onClick: function () {
				$('#currencyData').modal('show');
			},
		},
	],
});

currency.addTo(map);

var news = L.easyButton({
	position: 'topright',
	id: 'newsBtn',
	states: [
		{
			icon: '<i class="fas fa-newspaper fa-lg"></i>',
			title: 'News',
			onClick: function () {
				$('#newsData').modal('show');
			},
		},
	],
});

news.addTo(map);

var wiki = L.easyButton({
	position: 'topright',
	id: 'wikiBtn',
	states: [
		{
			icon: '<i class="fab fa-wikipedia-w fa-lg"></i>',
			title: 'Wikipedia',
			onClick: function () {
				$('#wikiData').modal('show');
			},
		},
	],
});

wiki.addTo(map);

var poi = L.easyButton({
	position: 'topright',
	id: 'poiBtn',
	states: [
		{
			icon: '<i class="fas fa-landmark fa-lg"></i>',
			title: 'Capital City POI',
		},
	],
});

poi.addTo(map);

var covid = L.easyButton({
	position: 'topright',
	id: 'covidBtn',
	states: [
		{
			icon: '<i class="fas fa-virus fa-lg"></i>',
			title: 'Covid',
			onClick: function () {
				$('#covidData').modal('show');
			},
		},
	],
});

covid.addTo(map);

// ****************************************************************

// Pre loader
function preloaderFadeOutInit() {
	$('.preloader').fadeOut(2500);
	$('body').attr('id', '');
}
// Window load function
jQuery(window).on('load', function () {
	(function ($) {
		preloaderFadeOutInit();
	})(jQuery);
});
