// Contenido para: static/js/appPoint.js

document.addEventListener('DOMContentLoaded', function () {
    // Referencias a los campos del formulario que se llenarán automáticamente
    const latInput = document.getElementById('latitud');
    const lngInput = document.getElementById('longitud');

    // Centramos el mapa en la zona de La Nueva Gloria
    const map = L.map('map').setView([4.543, -74.091], 16);

    // Capa de mapa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let marker; // Variable para guardar el marcador

    // Función que se ejecuta al hacer clic en el mapa
    function onMapClick(e) {
        const coords = e.latlng;
        
        // Actualiza los valores en el formulario con 6 decimales de precisión
        latInput.value = coords.lat.toFixed(6);
        lngInput.value = coords.lng.toFixed(6);

        // Si el marcador ya existe, mueve su posición. Si no, lo crea.
        if (marker) {
            marker.setLatLng(coords);
        } else {
            marker = L.marker(coords, {
                draggable: true // Permite arrastrar el marcador para un ajuste fino
            }).addTo(map);

            // Evento para actualizar las coordenadas si el marcador es arrastrado
            marker.on('dragend', function(event) {
                const newCoords = event.target.getLatLng();
                latInput.value = newCoords.lat.toFixed(6);
                lngInput.value = newCoords.lng.toFixed(6);
            });
        }
        
        // Muestra un pop-up en el marcador
        marker.bindPopup(`<b>Predio seleccionado</b><br>Arrastra para ajustar la posición.`).openPopup();
    }

    // Asocia la función onMapClick al evento 'click' del mapa
    map.on('click', onMapClick);

    // (Opcional) Lógica para manejar el envío del formulario con JavaScript (Fetch API)
    // Esto te da más control que un envío de formulario tradicional.
    const form = document.getElementById('predioForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que la página se recargue

        // Validar que se haya seleccionado un punto
        if (!latInput.value || !lngInput.value) {
            alert('Por favor, haz clic en el mapa para seleccionar una ubicación.');
            return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        console.log('Enviando datos:', data);

        // Aquí envías los datos a tu backend (api.py)
        fetch('/api/add_point', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(result => {
            console.log('Respuesta del servidor:', result);
            alert(result.message); // Muestra mensaje de éxito o error del servidor
            if (result.status === 'success') {
                form.reset(); // Limpia el formulario
                if(marker) {
                    map.removeLayer(marker); // Quita el marcador del mapa
                    marker = null;
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al enviar los datos.');
        });
    });
});