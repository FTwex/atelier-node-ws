// elements
var heartbeat = document.getElementById('heartbeat');
var info = document.getElementById('info-list');

/*
 * Leaflet part
 */
// Init map
var radarMap = L.map('radarMap');

// Map background
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(radarMap);

// Define a Leaflet group to manage markers
var zombieGroup = L.layerGroup().addTo(radarMap);

// Define a zombie icon to be added on each markers
var zombieIcon = L.icon({
    iconUrl: '/zombie.png',
    iconSize: [64, 64],
    iconAnchor: [22, 94],
});


/*
 * Socket.io part
 */
//TODO
