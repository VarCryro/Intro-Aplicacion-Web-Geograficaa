import json
from flask import (
    Flask, render_template, request,
    jsonify
)
from flask_sqlalchemy import SQLAlchemy
from geoalchemy2 import Geometry
from geoalchemy2.shape import from_shape
from shapely.geometry import Point
from sqlalchemy import func, exc

# --- CONFIGURACIÓN DE LA APLICACIÓN ---
app = Flask(__name__)

# USA LOS DATOS NUEVOS QUE CREASTE
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://gloria_user:gloria_pass_123@localhost:5432/gloria_db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# --- MODELO DE LA BASE DE DATOS ---
class Predio(db.Model):
    __tablename__ = "predio"
    id          = db.Column(db.Integer, primary_key=True)
    nupren      = db.Column(db.String(30))
    nombre      = db.Column(db.String(100))
    direccion   = db.Column(db.String(100), nullable=False)
    estado      = db.Column(db.Integer)
    propietario = db.Column(db.String(100))
    localizacion = db.Column(Geometry("POINT", srid=4326), nullable=False)

# --- RUTAS ---
@app.route("/")
def index(): return render_template("index.html")
@app.route("/appPoint.html")
def app_point(): return render_template("appPoint.html")
# (Aquí van tus otras rutas HTML)

# --- API ---
@app.route("/api/add_point", methods=["POST"])
def add_point():
    try:
        data = request.get_json(force=True) # Usamos force=True como último seguro
        
        if not all(k in data and data[k] for k in ["direccion", "estado", "latitud", "longitud"]):
            return jsonify(status="error", message="Faltan campos obligatorios."), 400

        nuevo = Predio(
            nupren=data.get("nupren"), nombre=data.get("nombre"),
            direccion=data["direccion"], estado=int(data["estado"]),
            propietario=data.get("propietario"),
            localizacion=from_shape(Point(float(data["longitud"]), float(data["latitud"])), srid=4326),
        )
        db.session.add(nuevo)
        db.session.commit()
        return jsonify(status="success", message="¡Predio guardado con éxito!"), 201
    except Exception as e:
        db.session.rollback()
        return jsonify(status="error", message=f"Error inesperado al guardar: {e}"), 500

@app.route("/api/predios")
def predios():
    try:
        rows = db.session.query(Predio.id, Predio.nombre, Predio.estado, func.ST_AsGeoJSON(Predio.localizacion).label("geom")).all()
        features = [
            {"type": "Feature", "geometry": json.loads(r.geom), "properties": {"id": r.id, "nombre": r.nombre, "estado": r.estado}}
            for r in rows if r.geom
        ]
        return jsonify({"type": "FeatureCollection", "features": features})
    except Exception as e:
        print(f"ERROR en /api/predios: {e}")
        return jsonify(status="error", message="Error interno al obtener los predios."), 500

# --- EJECUCIÓN ---
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)