from pymongo import MongoClient, ASCENDING

# Conectar a MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['peluqueria']

print("Creando índices en la base de datos...")

# Índice único en clientes.email
try:
    db.clientes.create_index([("email", ASCENDING)], unique=True)
    print("✓ Índice único creado en clientes.email")
except Exception as e:
    print(f"✗ Error al crear índice en clientes.email: {e}")

# Índice en clientes.telefono
try:
    db.clientes.create_index([("telefono", ASCENDING)])
    print("✓ Índice creado en clientes.telefono")
except Exception as e:
    print(f"✗ Error al crear índice en clientes.telefono: {e}")

# Índice compuesto en turnos (email + fecha)
try:
    db.turnos.create_index([("email", ASCENDING), ("fecha", ASCENDING)])
    print("✓ Índice compuesto creado en turnos.email + turnos.fecha")
except Exception as e:
    print(f"✗ Error al crear índice en turnos: {e}")

# Índice en turnos (fecha + horario) - ya existente pero lo verificamos
try:
    db.turnos.create_index([("fecha", ASCENDING), ("horario", ASCENDING)])
    print("✓ Índice compuesto creado en turnos.fecha + turnos.horario")
except Exception as e:
    print(f"✗ Error al crear índice en turnos: {e}")

# Índice único en trabajos.nombre
try:
    db.trabajos.create_index([("nombre", ASCENDING)], unique=True)
    print("✓ Índice único creado en trabajos.nombre")
except Exception as e:
    print(f"✗ Error al crear índice en trabajos.nombre: {e}")

# Índice en trabajos.activo
try:
    db.trabajos.create_index([("activo", ASCENDING)])
    print("✓ Índice creado en trabajos.activo")
except Exception as e:
    print(f"✗ Error al crear índice en trabajos.activo: {e}")

# Índice único en usuarios.usuario
try:
    db.usuarios.create_index([("usuario", ASCENDING)], unique=True)
    print("✓ Índice único creado en usuarios.usuario")
except Exception as e:
    print(f"✗ Error al crear índice en usuarios.usuario: {e}")

print("\n✓ Proceso completado. Mostrando índices creados:")
print("\n--- Clientes ---")
for index in db.clientes.list_indexes():
    print(f"  {index['name']}: {index.get('key', {})}")

print("\n--- Turnos ---")
for index in db.turnos.list_indexes():
    print(f"  {index['name']}: {index.get('key', {})}")

print("\n--- Trabajos ---")
for index in db.trabajos.list_indexes():
    print(f"  {index['name']}: {index.get('key', {})}")

print("\n--- Usuarios ---")
for index in db.usuarios.list_indexes():
    print(f"  {index['name']}: {index.get('key', {})}")

client.close()
