# Cuaderno de Bitácora del Proyecto: "Problemática de Inseguridad La Nueva Gloria"

**Autor:** Cristian Rodrigo Vanegas Gutiérrez
**Periodo:** Junio 2025 - Julio 2025

---

### Iteración 0: Conceptualización y Prototipado Inicial (Previo al 09/Jun)

*   **Actividades Realizadas:**
    *   El proyecto no partió completamente de cero. Se tomó como base un ejercicio práctico anterior de la asignatura, enfocado en la conexión de una aplicación web con una base de datos SQL.
    *   Se reutilizó la estructura fundamental de dicho proyecto, incluyendo la configuración inicial del servidor **Flask** y la maquetación del frontend con **HTML y Bootstrap**.
    *   Sobre esta base, se realizaron mejoras estéticas y de usabilidad significativas, adaptando la paleta de colores, la tipografía y la disposición de los elementos para alinearlos con la temática específica de la inseguridad en La Nueva Gloria.
    *   Esta fase de prototipado permitió establecer una base sólida sobre la cual se construirían las funcionalidades específicas del proyecto, como el mapa interactivo y la persistencia de datos geoespaciales.

---

### Iteración 1: Implementación del Mapa y Persistencia Inicial (09/Jun - 16/Jun)

*   **Versiones:** 0.1 a 0.4
*   **Fechas de Commits Relevantes:** 9, 13, 16 de junio.

*   **Actividades Realizadas:**
    *   Integración del mapa interactivo usando la librería **Leaflet.js** sobre la estructura base existente.
    *   Se dibujó mediante código el polígono del área de estudio (La Nueva Gloria) para delimitar la zona de interés.
    *   **Primer intento de persistencia:** Para validar el concepto rápidamente, se implementó una lógica para guardar los puntos en un archivo plano `puntos.geojson`.

*   **Problemas Encontrados:**
    *   La gestión de datos mediante un archivo plano demostró ser propensa a errores y no escalable para un uso real.
    *   Se confirmó que el manejo de caracteres especiales (tildes, ñ) generaba conflictos de codificación, un problema crítico para la integridad de los datos.

*   **Soluciones Aplicadas:**
    *   Se tomó la decisión estratégica de abandonar el enfoque de archivo plano y migrar a una base de datos relacional en la siguiente iteración.

---

### Iteración 2: Desarrollo del Backend y Migración a PostgreSQL (18/Jun - 27/Jun)

*   **Versiones:** 0.5 a 0.6.6
*   **Fechas de Commits Relevantes:** 18, 24, 25, 27 de junio.

*   **Actividades Realizadas:**
    *   Desarrollo del backend en **Flask** y el ORM **SQLAlchemy** para la gestión de la base de datos.
    *   Diseño del modelo de datos `Predio` en `api.py`.
    *   **Migración de la arquitectura:** Se reemplazó el sistema de archivo plano por una base de datos **PostgreSQL**, elegida por su robustez y soporte para extensiones geoespaciales.
    *   Creación de los endpoints de la API: `/api/add_point` (POST) y `/api/predios` (GET).

*   **Problemas Encontrados:**
    *   **Error Crítico 1:** Al conectar con PostgreSQL, la aplicación fallaba al iniciar con el error `ProgrammingError: no existe el tipo «geometry»`.
    *   **Error Crítico 2 (Resuelto por la migración):** El problema de codificación `UnicodeDecodeError` desapareció al usar una base de datos PostgreSQL configurada en `UTF-8`.

*   **Soluciones Aplicadas:**
    *   El error de `geometry` se solucionó tras investigar y descubrir la necesidad de la extensión **PostGIS**. Se activó en la base de datos con el comando `CREATE EXTENSION postgis;`, habilitando el almacenamiento nativo de datos geográficos.

---

### Iteración 3: Integración Final y Funcionalidad Completa (09/Jul)

*   **Versiones:** 0.7.0 y 0.7.1
*   **Fechas de Commits Relevantes:** 9 de julio.

*   **Actividades Realizadas:**
    *   Refactorización del código JavaScript del frontend (`programa.js`) para consumir el endpoint `/api/predios` mediante `fetch`.
    *   Implementación de la lógica para dibujar dinámicamente los marcadores en el mapa a partir de los datos GeoJSON recibidos de la API.
    *   Se añadió un popup a cada marcador para mostrar la información relevante del predio.
    *   Se realizaron pruebas completas del flujo de usuario: agregar un punto -> guardar en la base de datos -> visualizar en el mapa.
    *   Se consolidó la versión final funcional del proyecto.

*   **Problemas Encontrados:**
    *   Ajustes menores de sincronización entre la petición asíncrona del frontend y la correcta renderización de los datos en el mapa.

*   **Soluciones Aplicadas:**
    *   Se depuró el código JavaScript para manejar correctamente las promesas y el ciclo de vida de los componentes de Leaflet, asegurando que el mapa se actualizara de forma fiable.