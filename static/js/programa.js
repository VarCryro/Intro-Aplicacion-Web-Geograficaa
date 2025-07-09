// static/js/programa.js
document.addEventListener('DOMContentLoaded', () => {
  /* ------- MAPA -------- */
  const mapDiv = document.getElementById('map');
  if (mapDiv) {
    // 1) Crea el mapa
    const map = L.map('map');

    // 2) Capa base OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // 3) Polígono del barrio La Nueva Gloria / Miraflores
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
    }).addTo(map);

    barrioPoligono.bindPopup('<b>Barrio La Nueva Gloria / Miraflores</b>');

    // Centra y ajusta el zoom al polígono
    map.fitBounds(barrioPoligono.getBounds());

    // 4) *** NUEVO: Cargar los predios desde la API ***
    fetch('/api/predios')
      .then(response => {
        if (!response.ok) {
          throw new Error('La respuesta de la red no fue exitosa');
        }
        return response.json();
      })
      .then(data => {
        L.geoJSON(data, {
          onEachFeature: function (feature, layer) {
            if (feature.properties) {
              let popupContent = '<h4>Información del Predio</h4>';
              if (feature.properties.nombre) {
                popupContent += `<b>Nombre:</b> ${feature.properties.nombre}<br>`;
              }
              // Asegúrate de que el nombre de la propiedad coincida con lo que envías desde Flask
              if (feature.properties.estado !== undefined) { 
                popupContent += `<b>Estado:</b> ${feature.properties.estado}`;
              }
              layer.bindPopup(popupContent);
            }
          }
        }).addTo(map);
      })
      .catch(error => {
        console.error('Error al cargar los predios:', error);
        alert('No se pudieron cargar los datos de los predios. Revisa la consola para más detalles.');
      });
  }

  /* ------- FOOTER YEAR -------- */
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});