from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['peluqueria']
turnos = db['turnos']

@app.route('/guardar_turno', methods=['POST'])
def guardar_turno():
    datos = request.form
    if not all([datos.get('nombre'), datos.get('trabajo'), datos.get('medida'), datos.get('fecha'), datos.get('horario')]):
        return jsonify({'mensaje': 'Faltan datos'}), 400
    turno = {
        'nombre': datos.get('nombre'),
        'trabajo': datos.get('trabajo'),
        'medida': datos.get('medida'),
        'fecha': datos.get('fecha'),
        'horario': datos.get('horario')
    }
    turnos.insert_one(turno)
    return jsonify({'mensaje': 'Turno registrado correctamente'})

@app.route('/listar_turnos', methods=['GET'])
def listar_turnos():
    turnos_lista = list(turnos.find({}, {'_id': 0}))  # No mostrar el _id
    return jsonify(turnos_lista)

@app.route('/cancelar_turno', methods=['POST'])
def cancelar_turno():
    datos = request.form
    nombre = datos.get('nombre')
    fecha = datos.get('fecha')
    horario = datos.get('horario')
    resultado = turnos.delete_one({
        'nombre': nombre,
        'fecha': fecha,
        'horario': horario
    })
    if resultado.deleted_count:
        return jsonify({'mensaje': 'Turno cancelado'})
    else:
        return jsonify({'mensaje': 'No se encontró el turno'}), 404

if __name__ == '__main__':
    app.run(debug=True)