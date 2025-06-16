# Importamos las librerías necesarias
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
# ¡Importante! Importamos el tipo 'Geometry' de GeoAlchemy2
# Este es el encargado de manejar los tipos de datos geoespaciales.
from geoalchemy2.types import Geometry

# --- Configuración de la aplicación Flask (Ejemplo) ---
# En una aplicación real, esto estaría en tu archivo principal (app.py)
app = Flask(__name__)

# Configuración de la base de datos PostgreSQL.
# ¡RECUERDA CAMBIAR ESTO por tus datos reales!
# Formato: 'postgresql://usuario:contraseña@host:puerto/nombre_base_de_datos'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:tu_contraseña@localhost/tu_basedatos'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializamos la extensión SQLAlchemy, que ahora será "consciente"
# de los tipos de datos de GeoAlchemy2.
db = SQLAlchemy(app)
# --- Fin de la configuración ---


# Definición del Modelo 'Predio'
class Predio(db.Model):
    """
    Modelo de la tabla 'predio'.
    Cada atributo de la clase representa una columna de la tabla.
    """
    # __tablename__ le dice a SQLAlchemy el nombre exacto de la tabla en la BD.
    __tablename__ = 'predio'

    # id: Llave primaria, tipo entero.
    # primary_key=True lo marca como llave primaria y lo hace autoincremental por defecto,
    # gestionando el 'nextval' de PostgreSQL automáticamente.
    id = db.Column(db.Integer, primary_key=True)

    # nombre: Cadena de texto (varchar) de hasta 100 caracteres, no puede ser nulo.
    nombre = db.Column(db.String(100), nullable=False)

    # -----------------------------------------------------------------
    # localizacion: ¡La columna especial de tipo 'point'!
    # Usamos el tipo 'Geometry' que importamos de GeoAlchemy2.
    # 1. Geometry: El tipo de dato general para datos espaciales.
    # 2. geometry_type='POINT': Le especificamos que, dentro de las geometrías,
    #    esta columna almacenará específicamente un 'POINT' (Punto).
    # 3. srid=4326 (Opcional pero muy recomendado): El SRID es el "Identificador de
    #    Referencia Espacial". 4326 es el estándar mundial para coordenadas de
    #    latitud/longitud (WGS 84). Usarlo asegura la consistencia.
    # 4. nullable=False: La localización es obligatoria.
    localizacion = db.Column(Geometry(geometry_type='POINT', srid=4326), nullable=False)
    # -----------------------------------------------------------------

    # direccion: Cadena de texto de hasta 100 caracteres, no puede ser nulo.
    direccion = db.Column(db.String(100), nullable=False)

    # estado: Entero, puede ser nulo (nullable=True por defecto).
    estado = db.Column(db.Integer)

    # celular: Entero, puede ser nulo.
    # Nota: Es común guardar teléfonos como String para manejar prefijos '+' o ceros.
    # Pero aquí nos ceñimos a tu script SQL.
    celular = db.Column(db.Integer)

    # nupre: Cadena de texto de hasta 30 caracteres, no puede ser nulo.
    nupre = db.Column(db.String(30), nullable=False)

    # El método __repr__ es para que, cuando imprimas un objeto Predio,
    # veas algo útil y legible. ¡Ideal para depurar!
    def __repr__(self):
        # Cuando consultemos un predio, su localización se mostrará en un formato
        # llamado WKT (Well-Known Text), ej: 'POINT (-74.072 4.711)'
        return f"<Predio id={self.id} nombre='{self.nombre}' localizacion='{self.localizacion}'>"