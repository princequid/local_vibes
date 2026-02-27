 // Create map and set view to Accra (example)
var map = L.map('map').setView([5.639438362640519, -0.15909221847242153], 15);

// Load OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Add a marker
L.marker([5.639438362640519, -0.15909221847242153]).addTo(map)
    .bindPopup("Local Vibes Restaurant<br>12 Nikoi street, East Legon, Accra, Ghana")
    .openPopup();