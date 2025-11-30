from pymongo import MongoClient

# Conectar a MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['peluqueria']
trabajos = db['trabajos']

print("=== CREAR TRABAJOS DE EJEMPLO ===\n")

# Datos de trabajos
trabajos_ejemplo = [
    {
        'nombre': 'Corte',
        'descripcion': 'Corte de cabello básico',
        'duracion': 30,
        'precio': 100,
        'requiereMedida': False,  # NO requiere medida
        'medidas': [],
        'activo': True
    },
    {
        'nombre': 'Tintura',
        'descripcion': 'Coloración de cabello',
        'duracion': 90,
        'precio': 300,
        'requiereMedida': True,  # SÍ requiere medida
        'medidas': ['Corto', 'Medio', 'Largo'],
        'activo': True
    },
    {
        'nombre': 'Alisado',
        'descripcion': 'Alisado de cabello',
        'duracion': 120,
        'precio': 500,
        'requiereMedida': True,
        'medidas': ['Corto', 'Medio', 'Largo'],
        'activo': True
    },
    {
        'nombre': 'Permanente',
        'descripcion': 'Permanente de cabello',
        'duracion': 150,
        'precio': 450,
        'requiereMedida': True,
        'medidas': ['Corto', 'Medio', 'Largo'],
        'activo': True
    }
]

# Insertar trabajos
for trabajo in trabajos_ejemplo:
    # Verificar si ya existe
    existente = trabajos.find_one({'nombre': trabajo['nombre']})
    
    if existente:
        print(f"⚠️  El trabajo '{trabajo['nombre']}' ya existe. Actualizando...")
        trabajos.update_one(
            {'nombre': trabajo['nombre']},
            {'$set': trabajo}
        )
        print(f"✅ Trabajo '{trabajo['nombre']}' actualizado")
    else:
        trabajos.insert_one(trabajo)
        print(f"✅ Trabajo '{trabajo['nombre']}' creado")

print("\n=== TRABAJOS EN LA BASE DE DATOS ===")
for trabajo in trabajos.find({'activo': True}, {'_id': 0}):
    requiere = "SÍ" if trabajo.get('requiereMedida') else "NO"
    medidas_str = ", ".join(trabajo.get('medidas', [])) if trabajo.get('medidas') else "N/A"
    print(f"""
  📌 {trabajo['nombre']}
     Duración: {trabajo['duracion']} min
     Precio: ${trabajo['precio']}
     Requiere medida: {requiere}
     Medidas: {medidas_str}
    """)

client.close()
