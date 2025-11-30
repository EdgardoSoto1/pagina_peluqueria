from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
import os

app = Flask(__name__, 
            static_folder='../.',
            static_url_path='')
CORS(app)


# MONGODB_URI = "mongodb+srv://edgardosoto_db_user:Lunita2080@clusteredgardo.hcqxxzs.mongodb.net/?appName=clusterEdgardo"

# client = MongoClient(MONGODB_URI)
client = MongoClient('mongodb://localhost:27017/')
db = client['peluqueria']
turnos = db['turnos']
trabajos = db['trabajos']
clientes = db['clientes']
usuarios = db['usuarios']

@app.route('/guardar_cliente', methods=['POST'])
def guardar_cliente():
    datos = request.get_json()
    email = datos.get('email')
    
    if not email:
        return jsonify({'mensaje': 'Email es requerido'}), 400
    
    # Verificar si el cliente ya existe
    cliente_existente = clientes.find_one({'email': email})
    
    if cliente_existente:
        return jsonify({
            'email': email,
            'mensaje': 'Cliente existente',
            'existe': True
        })
    else:
        # Crear nuevo cliente
        from datetime import datetime
        nuevo_cliente = {
            'nombre': datos.get('nombre'),
            'email': email,
            'telefono': datos.get('telefono'),
            'fechaRegistro': datetime.now()
        }
        clientes.insert_one(nuevo_cliente)
        return jsonify({
            'email': email,
            'mensaje': 'Cliente creado',
            'existe': False
        })

@app.route('/login', methods=['POST'])
def login():
    datos = request.get_json()
    usuario = datos.get('usuario')
    password = datos.get('password')
    
    if not usuario or not password:
        return jsonify({
            'success': False,
            'mensaje': 'Usuario y contraseña son requeridos'
        }), 400
    
    # Buscar usuario en la base de datos
    usuario_bd = usuarios.find_one({'usuario': usuario})
    
    if usuario_bd and usuario_bd.get('password') == password:
        return jsonify({
            'success': True,
            'mensaje': 'Login exitoso',
            'usuario': usuario,
            'puedeCancelarTurnos': usuario_bd.get('puedeCancelarTurnos', True),
            'nombre': usuario_bd.get('nombre', usuario)
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
    
    # Ahora solo guardamos el email del cliente como referencia
    turno = {
        'nombre': datos.get('nombre'),
        'trabajo': datos.get('trabajo'),
        'medida': datos.get('medida'),
        'fecha': datos.get('fecha'),
        'horario': datos.get('horario'),
        'email': datos.get('responsable_email', '')  # Solo el email como referencia
    }
    turnos.insert_one(turno)
    return jsonify({'mensaje': 'Turno registrado correctamente'})

@app.route('/listar_turnos', methods=['GET'])
def listar_turnos():
    # Usamos aggregation con $lookup para unir datos del cliente
    pipeline = [
        {
            '$lookup': {
                'from': 'clientes',
                'localField': 'email',
                'foreignField': 'email',
                'as': 'responsable'
            }
        },
        {
            '$unwind': {
                'path': '$responsable',
                'preserveNullAndEmptyArrays': True  # Por si hay turnos sin cliente
            }
        },
        {
            '$project': {
                '_id': 0,
                'nombre': 1,
                'trabajo': 1,
                'medida': 1,
                'fecha': 1,
                'horario': 1,
                'email': 1,
                'responsable.nombre': 1,
                'responsable.telefono': 1,
                'responsable.email': 1
            }
        }
    ]
    
    turnos_lista = list(turnos.aggregate(pipeline))
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
        'medidas': datos.get('medidas', ['Corto', 'Medio', 'Largo']),  # Opciones de medida
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
    usuario_actual = datos.get('usuario')
    
    # Verificar permiso del usuario
    if not usuario_actual:
        return jsonify({'mensaje': 'Usuario no especificado'}), 400
    
    usuario_bd = usuarios.find_one({'usuario': usuario_actual})
    
    if not usuario_bd:
        return jsonify({'mensaje': 'Usuario no encontrado'}), 404
    
    # Verificar si tiene permiso para cancelar
    puede_cancelar = usuario_bd.get('puedeCancelarTurnos', True)
    
    if not puede_cancelar:
        return jsonify({'mensaje': 'No tienes permiso para cancelar turnos'}), 403
    
    # Si tiene permiso, proceder con la cancelación
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
    app.run(debug=True, port=5001)