var map = L.map('map').setView([4.628039879669676, -74.06591030850961], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var circle = L.circle([4.628039879669676, -74.06591030850961], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 200
}).addTo(map);

// Manejar el evento de hacer click en el mapa

function onMapClick(e) {
    var marker = L.marker(e.latlng).addTo(map);
}

map.on('click', onMapClick);