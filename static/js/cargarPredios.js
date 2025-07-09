// Este es el contenido completo para tu archivo static/js/cargarPredios.js

document.addEventListener('DOMContentLoaded', async () => {
  // Asegúrate de que esta línea que obtiene el mapa esté en tu código, 
  // usualmente en otro script o antes de este bloque.
  // Si 'map' no está definido, esta parte fallará.
  const map = window.map;
  if (!map) {
    console.error("El objeto 'map' de Leaflet no se encontró. Asegúrate de que se inicialice antes de llamar a este script.");
    return;
  }

  try {
    const res = await fetch('/api/predios');
    const geojson = await res.json();

    // =========================================================
    // LÍNEA DE DEPURACIÓN CLAVE:
    // Esta línea nos mostrará en la consola del navegador
    // la respuesta exacta que recibimos del servidor.
    console.log("Respuesta recibida del servidor:", geojson);
    // =========================================================

    // Esta línea de abajo es la que probablemente falla.
    // La dejaremos aquí para ver el error, pero ahora también veremos qué datos recibió.
    L.geoJSON(geojson, {
      pointToLayer: (feature, latlng) =>
        L.marker(latlng).bindPopup(`<b>${feature.properties.nombre}</b>`)
    }).addTo(map);

  } catch (err) {
    // Este catch captura errores como "Invalid GeoJSON object"
    // o si la respuesta del servidor no es un JSON válido.
    console.error("Error al procesar la respuesta del servidor:", err);
  }
});