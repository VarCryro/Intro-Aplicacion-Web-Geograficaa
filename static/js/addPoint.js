document.addEventListener('DOMContentLoaded', function () {
    // --- REFERENCIAS A ELEMENTOS DEL DOM ---
    const latInput = document.getElementById('latitud');
    const lngInput = document.getElementById('longitud');
    const formContainer = document.getElementById('form-container'); // Referencia al contenedor del formulario
    const form = document.getElementById('predioForm');

    // --- INICIALIZACIÓN DEL MAPA ---
    const map = L.map('map').setView([4.543, -74.091], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let marker; // Variable para guardar el marcador

    // --- FUNCIÓN AL HACER CLIC EN EL MAPA ---
    function onMapClick(e) {
        const coords = e.latlng;
        
        latInput.value = coords.lat.toFixed(6);
        lngInput.value = coords.lng.toFixed(6);

        if (marker) {
            marker.setLatLng(coords);
        } else {
            marker = L.marker(coords, {
                draggable: true // Tu excelente función de arrastrar
            }).addTo(map);

            marker.on('dragend', function(event) {
                const newCoords = event.target.getLatLng();
                latInput.value = newCoords.lat.toFixed(6);
                lngInput.value = newCoords.lng.toFixed(6);
            });
        }
        
        marker.bindPopup(`<b>Predio seleccionado</b><br>Arrastra para ajustar la posición.`).openPopup();

        // --- LÓGICA DE INTERFAZ CORREGIDA ---
        // 1. Muestra el contenedor del formulario que estaba oculto
        if (formContainer.style.display === 'none') {
            formContainer.style.display = 'block';
        }

        // 2. Desplázate suavemente hacia el formulario para que el usuario lo vea
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    map.on('click', onMapClick);

    // --- MANEJO DEL ENVÍO DEL FORMULARIO (TU LÓGICA ORIGINAL MEJORADA) ---
    form.addEventListener('submit', function(event) {
        event.preventDefault(); 

        if (!latInput.value || !lngInput.value) {
            alert('Por favor, haz clic en el mapa para seleccionar una ubicación.');
            return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        console.log('Enviando datos:', data);

        fetch('/api/add_point', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
            return response.json();
        })
        .then(result => {
            console.log('Respuesta del servidor:', result);
            alert(result.message); 
            if (result.status === 'success') {
                form.reset(); // Limpia el formulario
                formContainer.style.display = 'none'; // Oculta el formulario de nuevo
                if (marker) {
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