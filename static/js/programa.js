// Contenido para: static/js/programa.js

document.addEventListener('DOMContentLoaded', function () {
    // Solo ejecuta el código del mapa si existe un elemento con id="map" en la página
    if (document.getElementById('map')) {
        // Coordenadas para el marcador y el polígono (las tuyas originales)
        const tuCuadraLat = 4.541920221090718; 
        const tuCuadraLng = -74.09174847415579;
        
        const map = L.map('map');

        // Capa de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Marcador
        L.marker([tuCuadraLat, tuCuadraLng]).addTo(map)
          .bindPopup('<b>¡Aquí está mi cuadra!</b>')
          .openPopup();

        // Coordenadas del polígono para el barrio
        var laNuevaGloriaCoordinates = [
            [4.5449, -74.0939], [4.5450, -74.0930], [4.5445, -74.0922],
            [4.5435, -74.0907], [4.5426, -74.0896], [4.5407, -74.0903],
            [4.5408, -74.0913], [4.5413, -74.0923], [4.5423, -74.0937],
            [4.5436, -74.0943]
        ];

        // Creación del polígono
        var barrioPoligono = L.polygon(laNuevaGloriaCoordinates, {
            color: 'blue',
            fillColor: '#3388ff',
            fillOpacity: 0.4,
            weight: 2
        }).addTo(map);

        barrioPoligono.bindPopup("<b>Barrio La Nueva Gloria / Miraflores</b>");
        
        // Ajusta el zoom para que el polígono sea visible
        map.fitBounds(barrioPoligono.getBounds()); 
    }
    
    // Función para actualizar el año del copyright
    function updateCopyrightYear() {
        const yearSpan = document.getElementById('currentYear');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }
    
    // Llama a la función al cargar la página
    updateCopyrightYear();
});