from pymongo import MongoClient

# Conectar a MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['peluqueria']
usuarios = db['usuarios']

print("=== Actualizar Permisos de Usuarios ===\n")

# Usuarios que NO pueden cancelar turnos
usuarios_sin_permiso = ['lucas', 'guillermo']

# Actualizar usuarios - agregar campo 'puedeCancelarTurnos'
for nombre_usuario in usuarios_sin_permiso:
    resultado = usuarios.update_one(
        {'usuario': nombre_usuario},
        {'$set': {'puedeCancelarTurnos': False}}
    )
    
    if resultado.matched_count > 0:
        print(f"✅ Usuario '{nombre_usuario}' actualizado - NO puede cancelar turnos")
    else:
        print(f"⚠️  Usuario '{nombre_usuario}' no encontrado")

# Actualizar el resto de usuarios para que SÍ puedan cancelar
resultado_otros = usuarios.update_many(
    {'usuario': {'$nin': usuarios_sin_permiso}},
    {'$set': {'puedeCancelarTurnos': True}}
)

print(f"\n✅ {resultado_otros.modified_count} usuarios actualizados - PUEDEN cancelar turnos")

print("\n=== Estado de Permisos ===")
for user in usuarios.find({}, {'_id': 0, 'usuario': 1, 'nombre': 1, 'puedeCancelarTurnos': 1}):
    permiso = "✓ SÍ" if user.get('puedeCancelarTurnos', True) else "✗ NO"
    print(f"  - {user.get('usuario'):<15} ({user.get('nombre'):<20}) puede cancelar: {permiso}")

client.close()
