from pymongo import MongoClient
from datetime import datetime

# Conectar a MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['peluqueria']
usuarios = db['usuarios']

print("=== Crear Usuario Admin ===\n")

# Datos del usuario
usuario_data = {
    'usuario': 'lucas',
    'password': 'lucas123',  # En producción, usa bcrypt para hashear
    'nombre': 'Lucas Paladini',
    'rol': 'admin',
    'activo': True,
    'fechaCreacion': datetime.now()
}

# Verificar si ya existe
usuario_existente = usuarios.find_one({'usuario': usuario_data['usuario']})

if usuario_existente:
    print(f"⚠️  El usuario '{usuario_data['usuario']}' ya existe.")
    print(f"Datos actuales: {usuario_existente}")
else:
    # Insertar usuario
    resultado = usuarios.insert_one(usuario_data)
    print(f"✅ Usuario '{usuario_data['usuario']}' creado exitosamente!")
    print(f"ID: {resultado.inserted_id}")
    print(f"\nCredenciales:")
    print(f"  Usuario: {usuario_data['usuario']}")
    print(f"  Contraseña: {usuario_data['password']}")

print("\n=== Usuarios en la base de datos ===")
for user in usuarios.find({}, {'_id': 0, 'password': 0}):
    print(f"  - {user}")

# Crear índice único en usuario
try:
    usuarios.create_index([("usuario", 1)], unique=True)
    print("\n✅ Índice único creado en usuarios.usuario")
except Exception as e:
    print(f"\n⚠️  Índice ya existe o error: {e}")

client.close()
