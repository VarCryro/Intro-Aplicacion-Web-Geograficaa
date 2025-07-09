document.addEventListener('DOMContentLoaded', function () {
  // --- REFERENCIAS DEL DOM ---
  const form = document.getElementById('formPredio');
  const saveBtn = document.getElementById('saveBtn');
  const latInput = document.querySelector('input[name="latitud"]');
  const lngInput = document.querySelector('input[name="longitud"]');
  const predioModal = new bootstrap.Modal(document.getElementById('predioModal'));

  // --- MAPA ---
  const map = L.map('map').setView([4.541887730694171, -74.09165321850323], 17); // Coordenadas para La Nueva Gloria
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  let tempMarker = null; // Marcador temporal

  // --- LÓGICA DE CLIC EN EL MAPA ---
  map.on('click', (e) => {
    const { lat, lng } = e.latlng;

    if (tempMarker) {
      map.removeLayer(tempMarker);
    }
    tempMarker = L.marker([lat, lng]).addTo(map);

    latInput.value = lat;
    lngInput.value = lng;
    predioModal.show();
  });

  // --- ENVÍO DEL FORMULARIO (VERSIÓN MEJORADA) ---
  saveBtn.addEventListener('click', async (evt) => {
    evt.preventDefault(); // Prevenimos el envío tradicional

    if (!latInput.value || !lngInput.value) {
      alert('Error: No se ha seleccionado una ubicación en el mapa.');
      return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validación simple en el frontend para dar feedback inmediato
    if (!data.direccion || !data.estado) {
      alert("Por favor, rellena los campos 'Dirección' y 'Estado'. Son obligatorios.");
      return;
    }

    try {
      const res = await fetch('/api/add_point', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      // Leemos la respuesta del servidor sea cual sea el resultado
      const json = await res.json();
      
      if (res.ok) {
        // Si todo fue bien (código 2xx)
        alert(json.message || 'Predio guardado con éxito');
        predioModal.hide();
        form.reset(); 
        if (tempMarker) {
          map.removeLayer(tempMarker);
          tempMarker = null;
        }
      } else {
        // Si el servidor devolvió un error (código 4xx o 5xx)
        // MOSTRAMOS EL MENSAJE DE ERROR REAL DEL SERVIDOR
        alert('Error al guardar: ' + (json.message || 'Error desconocido.'));
      }

    } catch (err) {
      console.error('Error de conexión:', err);
      alert('Error al conectar con el servidor.');
    }
  });

  // Limpiar el marcador si el usuario cierra el modal sin guardar
  document.getElementById('predioModal').addEventListener('hidden.bs.modal', () => {
    if (tempMarker) {
      map.removeLayer(tempMarker);
      tempMarker = null;
    }
  });
});