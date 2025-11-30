from pymongo import MongoClient
from datetime import datetime

# Conectar a MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['peluqueria']
usuarios = db['usuarios']

print("=== AGREGAR NUEVO USUARIO ===\n")

# Solicitar datos
usuario = input("Usuario (nombre de login): ").strip()
password = input("Contraseña: ").strip()
nombre = input("Nombre completo: ").strip()
rol = input("Rol (admin/empleado): ").strip() or 'empleado'

# Validaciones básicas
if not usuario or not password:
    print("\n❌ Error: Usuario y contraseña son obligatorios")
    exit(1)

# Verificar si ya existe
if usuarios.find_one({'usuario': usuario}):
    print(f"\n❌ Error: El usuario '{usuario}' ya existe")
    exit(1)

# Crear usuario
nuevo_usuario = {
    'usuario': usuario,
    'password': password,
    'nombre': nombre or usuario,
    'rol': rol,
    'activo': True,
    'fechaCreacion': datetime.now()
}

resultado = usuarios.insert_one(nuevo_usuario)

print(f"\n✅ Usuario creado exitosamente!")
print(f"   ID: {resultado.inserted_id}")
print(f"   Usuario: {usuario}")
print(f"   Nombre: {nombre}")
print(f"   Rol: {rol}")

print("\n=== Todos los usuarios ===")
for user in usuarios.find({}, {'_id': 0, 'password': 0}):
    print(f"  - {user['usuario']} ({user['nombre']}) - Rol: {user['rol']}")

client.close()
