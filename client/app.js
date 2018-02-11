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
// Init socket
var socket = io('http://localhost:2000');

// Switch heartbeat indicator to green blinker
socket.on('connect', function() {
    heartbeat.setAttribute('class', 'blink');
});

// Switch heartbeat indicator to red blinker
socket.on('disconnect', function() {
    heartbeat.setAttribute('class', 'linkDown');
});

// When the socket is connected, the server send to the client the covered zone
// via a mapZone event
socket.on('mapZone', (zone) => {
    radarMap.fitBounds([
        [zone.minLon, zone.minLat],
        [zone.maxLon, zone.maxLat]
    ])
});

// Receive zombies scan resfresh from the server
socket.on('scanResfresh', function(zombies) {
    zombieGroup.clearLayers();
    zombieGroup.addLayer(L.geoJSON(zombies, {
        pointToLayer: function(geoJsonPoint, latlng) {
            return L.marker(latlng, {
                icon: zombieIcon
            });
        }
    }));
});

// Receive log info
var infoItems = [];
socket.on('info', function(msg) {
    if(infoItems.length >= 10) {
        infoItems.shift();
    }
    infoItems.push(msg);

    info.innerHTML = "";
    for (let item of infoItems) {
        info.innerHTML += '<li>' + item + '</li>';
    }
})
