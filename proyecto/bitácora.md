# Cuaderno de Bitácora del Proyecto: "Problemática de Inseguridad La Nueva Gloria"

**Autor:** Cristian Rodrigo Vanegas Gutiérrez
**Periodo:** 09 de junio de 2025 - 09 de julio de 2025

---

### Iteración 1: Prototipo y Estructura Inicial (09/Jun - 16/Jun)

*   **Versiones:** 0.1 a 0.4
*   **Fechas de Commits Relevantes:** 9, 13, 16 de junio.

*   **Actividades Realizadas:**
    *   Inicialización del repositorio en GitHub.
    *   Creación de la estructura básica del proyecto (carpetas `static`, `templates`).
    *   Desarrollo del frontend inicial con HTML5 y Bootstrap para una interfaz limpia.
    *   Implementación del mapa interactivo usando la librería Leaflet.js.
    *   Se dibujó el polígono del área de estudio (La Nueva Gloria) para delimitar la zona.
    *   **Primer intento de persistencia:** Se implementó una lógica para guardar los puntos en un archivo plano `puntos.geojson` directamente desde el frontend.

*   **Problemas Encontrados:**
    *   La gestión de datos mediante un archivo plano era propensa a errores y no escalable.
    *   Se anticipó que el manejo de caracteres especiales (tildes, ñ) podría generar conflictos de codificación.

*   **Soluciones Aplicadas:**
    *   Se decidió que para la siguiente iteración era fundamental migrar a una arquitectura cliente-servidor con una base de datos real.

---

### Iteración 2: Desarrollo del Backend y Migración a Base de Datos (18/Jun - 27/Jun)

*   **Versiones:** 0.5 a 0.6.6
*   **Fechas de Commits Relevantes:** 18, 24, 25, 27 de junio.

*   **Actividades Realizadas:**
    *   Creación del backend usando el microframework **Flask**.
    *   Se implementó el ORM **SQLAlchemy** para la gestión de la base de datos.
    *   Se diseñó el modelo de datos `Predio` en `api.py`.
    *   **Migración de la arquitectura:** Se reemplazó el archivo `.geojson` por una base de datos **PostgreSQL**, elegida por su robustez.
    *   Se crearon los endpoints de la API: `/api/add_point` (POST) para guardar nuevos predios y `/api/predios` (GET) para obtenerlos.
    *   Se configuró un archivo `static.yml` para una futura integración con GitHub Actions (demuestra visión a futuro).

*   **Problemas Encontrados:**
    *   **Error Crítico 1:** Al intentar guardar datos con tildes, surgió el error de codificación: `UnicodeDecodeError: 'utf-8' codec can't decode byte...`. Esto confirmó que la arquitectura de archivo plano era inviable.
    *   **Error Crítico 2:** Al conectar con PostgreSQL, la aplicación fallaba al iniciar con el error `ProgrammingError: no existe el tipo «geometry»`.

*   **Soluciones Aplicadas:**
    *   El error de codificación se resolvió de raíz al usar una base de datos PostgreSQL configurada en `UTF-8`.
    *   El error de `geometry` se solucionó tras investigar y descubrir la necesidad de la extensión geoespacial **PostGIS**. Se activó en la base de datos con el comando `CREATE EXTENSION postgis;`, habilitando el almacenamiento de datos geográficos.

---

### Iteración 3: Integración Final y Despliegue Funcional (09/Jul)

*   **Versiones:** 0.7.0 y 0.7.1
*   **Fechas de Commits Relevantes:** 9 de julio (hoy).

*   **Actividades Realizadas:**
    *   Se refactorizó el código JavaScript del frontend (`programa.js`) para que consumiera el endpoint `/api/predios`.
    *   Se implementó la lógica para que los puntos guardados en la base de datos se dibujaran dinámicamente como marcadores en el mapa de Leaflet.
    *   Se añadió un popup a cada marcador para mostrar la información del predio.
    *   Se realizaron pruebas completas del flujo: agregar un punto -> guardar en la base de datos -> visualizar en el mapa.
    *   Se hizo un `merge` de la rama de desarrollo a la rama `main`, consolidando la versión final funcional del proyecto.

*   **Problemas Encontrados:**
    *   Ajustes menores de sincronización entre la petición `fetch` del frontend y la respuesta de la API.

*   **Soluciones Aplicadas:**
    *   Se depuró el código JavaScript para manejar correctamente las promesas y el formato GeoJSON devuelto por la API, asegurando que el mapa se actualizara correctamente.