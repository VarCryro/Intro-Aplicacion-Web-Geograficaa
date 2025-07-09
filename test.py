import psycopg2
import sys

# Asegúrate de que esta cadena sea IDÉNTICA a la de tu api.py,
# incluyendo el final "?client_encoding=utf8"
DB_URI = "postgresql://geo_user:loki0919@localhost:5432/nuevagloria?client_encoding=utf8"

print("--- Iniciando prueba de conexión ---")

try:
    # Intentamos conectar usando la URI
    conn = psycopg2.connect(DB_URI)
    print("\n*************************")
    print("¡CONEXIÓN EXITOSA!")
    print("*************************")
    conn.close()
    print("Conexión cerrada correctamente.")

except Exception as e:
    print("\n--------------------------")
    print("¡FALLÓ LA CONEXIÓN!")
    print("--------------------------")
    print(f"El error fue: {e}")
    # Imprimimos la versión de la librería para tener más datos
    print(f"Versión de psycopg2: {psycopg2.__version__}")
    sys.exit(1) # Salimos con un código de error