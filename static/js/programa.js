// static/js/programa.js
document.addEventListener('DOMContentLoaded', () => {
  /* ------- MAPA -------- */
  const mapDiv = document.getElementById('map');
  if (mapDiv && !window.map) {
    // 1) crea el mapa y lo hace global
    window.map = L.map('map');

    // 2) capa base OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(window.map);

    // 3) polígono del barrio La Nueva Gloria / Miraflores
    const laNuevaGloriaCoords = [
      [4.5449, -74.0939], [4.5450, -74.0930], [4.5445, -74.0922],
      [4.5435, -74.0907], [4.5426, -74.0896], [4.5407, -74.0903],
      [4.5408, -74.0913], [4.5413, -74.0923], [4.5423, -74.0937],
      [4.5436, -74.0943]
    ];

    const barrioPoligono = L.polygon(laNuevaGloriaCoords, {
      color: 'blue',
      fillColor: '#3388ff',
      fillOpacity: 0.4,
      weight: 2
    }).addTo(window.map);

    barrioPoligono.bindPopup('<b>Barrio La Nueva Gloria / Miraflores</b>');

    // Centra y ajusta el zoom al polígono
    window.map.fitBounds(barrioPoligono.getBounds());
  }

  /* ------- FOOTER YEAR -------- */
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
