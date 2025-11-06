from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
import os

app = Flask(__name__, 
            static_folder='../.',
            static_url_path='')
CORS(app)


client = MongoClient('mongodb://localhost:27017/')
db = client['peluqueria']
turnos = db['turnos']
trabajos = db['trabajos']


ADMIN_USER = 'edgardo'
ADMIN_PASSWORD = '123456'

@app.route('/login', methods=['POST'])
def login():
    datos = request.get_json()
    usuario = datos.get('usuario')
    password = datos.get('password')
    
    if usuario == ADMIN_USER and password == ADMIN_PASSWORD:
        return jsonify({
            'success': True,
            'mensaje': 'Login exitoso',
            'usuario': usuario
        })
    else:
        return jsonify({
            'success': False,
            'mensaje': 'Usuario o contraseña incorrectos'
        }), 401

@app.route('/guardar_turno', methods=['POST'])
def guardar_turno():
    datos = request.form
    if not all([datos.get('nombre'), datos.get('trabajo'), datos.get('medida'), datos.get('fecha'), datos.get('horario')]):
        return jsonify({'mensaje': 'Faltan datos'}), 400
    
    # Verifica si ya existe un turno en esa fecha y horario
    fecha = datos.get('fecha')
    horario = datos.get('horario')
    
    turno_existente = turnos.find_one({
        'fecha': fecha,
        'horario': horario
    })
    
    if turno_existente:
        return jsonify({'mensaje': 'Ya existe un turno reservado para esa fecha y horario'}), 409
    
    turno = {
        'nombre': datos.get('nombre'),
        'trabajo': datos.get('trabajo'),
        'medida': datos.get('medida'),
        'fecha': datos.get('fecha'),
        'horario': datos.get('horario'),
        'responsable': {
            'nombre': datos.get('responsable_nombre', ''),
            'telefono': datos.get('responsable_telefono', ''),
            'email': datos.get('responsable_email', '')
        }
    }
    turnos.insert_one(turno)
    return jsonify({'mensaje': 'Turno registrado correctamente'})

@app.route('/listar_turnos', methods=['GET'])
def listar_turnos():
    turnos_lista = list(turnos.find({}, {'_id': 0}))  # No mostrar el _id
    return jsonify(turnos_lista)

@app.route('/agregar_trabajo', methods=['POST'])
def agregar_trabajo():
    datos = request.get_json()
    
    if not datos.get('nombre'):
        return jsonify({'mensaje': 'El nombre del trabajo es obligatorio'}), 400
    
    # Verifica si ya existe un trabajo con ese nombre
    trabajo_existente = trabajos.find_one({'nombre': datos.get('nombre')})
    if trabajo_existente:
        return jsonify({'mensaje': 'Ya existe un trabajo con ese nombre'}), 409
    
    nuevo_trabajo = {
        'nombre': datos.get('nombre'),
        'descripcion': datos.get('descripcion', ''),
        'duracion': datos.get('duracion', 30),
        'precio': datos.get('precio', 0),
        'requiereMedida': datos.get('requiereMedida', True),
        'activo': datos.get('activo', True)
    }
    
    trabajos.insert_one(nuevo_trabajo)
    return jsonify({'mensaje': 'Trabajo agregado exitosamente'})

@app.route('/listar_trabajos', methods=['GET'])
def listar_trabajos():
    trabajos_lista = list(trabajos.find({'activo': True}, {'_id': 0}))
    return jsonify(trabajos_lista)

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