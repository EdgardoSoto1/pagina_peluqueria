# 💇 Página Web de Peluquería

Sistema de gestión de turnos para peluquería con interfaz web moderna.

## 🌐 Ver la Página Web en GitHub Pages

Para que tu página se vea desde este repositorio y funcione en el navegador, sigue estos pasos:

### Paso 1: Habilitar GitHub Pages

1. Ve a la página de tu repositorio en GitHub
2. Haz clic en **Settings** (Configuración) en la parte superior
3. En el menú lateral izquierdo, busca y haz clic en **Pages**
4. En la sección **Build and deployment** (Compilación e implementación):
   - En **Source** (Fuente), selecciona **GitHub Actions**
5. Guarda los cambios

### Paso 2: Esperar el Despliegue

1. Ve a la pestaña **Actions** en tu repositorio
2. Verás un workflow llamado "Desplegar contenido estático a Pages" ejecutándose
3. Espera a que termine (puede tomar 1-2 minutos)
4. Cuando tenga una marca verde ✓, el sitio estará listo

### Paso 3: Acceder a tu Sitio

Tu página web estará disponible en:
```
https://edgardosoto1.github.io/pagina_peluqueria/
```

## 📁 Estructura del Proyecto

```
pagina_peluqueria/
├── index.html              # Página principal - Reserva de turnos
├── login.html              # Login de administrador
├── menu.html               # Menú de administrador
├── panel.html              # Panel de control
├── confirmacion.html       # Confirmación de reservas
├── agregar-trabajo.html    # Agregar trabajos
├── css/                    # Estilos CSS
│   ├── index.css
│   ├── login.css
│   ├── menu.css
│   ├── panel.css
│   ├── confirmacion.css
│   └── agregar-trabajo.css
├── js/                     # Scripts JavaScript
│   ├── index.js
│   ├── login.js
│   ├── menu.js
│   ├── panel.js
│   ├── confirmacion.js
│   └── agregar-trabajo.js
├── img/                    # Imágenes
│   ├── logo_1.png
│   └── medida_1.jpeg
└── app.py                  # Backend Flask (requiere despliegue separado)
```

## ⚠️ Importante: Backend Flask

La aplicación tiene dos partes:

### 1. Frontend (Páginas HTML/CSS/JS) - ✅ Se puede hospedar en GitHub Pages
- Páginas web estáticas
- Interfaz de usuario
- Ya funcionará con GitHub Pages

### 2. Backend (app.py - Flask) - ❌ NO se puede hospedar en GitHub Pages
- Servidor Python
- Base de datos MongoDB
- API para guardar turnos

**Para que el sistema completo funcione**, necesitas:

1. **Desplegar el backend** en un servicio como:
   - [PythonAnywhere](https://www.pythonanywhere.com/) (Gratis para proyectos pequeños)
   - [Heroku](https://www.heroku.com/)
   - [Railway](https://railway.app/)
   - [Render](https://render.com/)

2. **Configurar MongoDB** en alguno de estos servicios:
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Gratis)
   
3. **Actualizar las URLs** en los archivos JavaScript para apuntar a tu backend desplegado

## 🚀 Despliegue del Backend (Opcional)

Si quieres que la funcionalidad completa (guardar turnos, login, etc.) funcione, necesitas desplegar el backend:

### Opción 1: PythonAnywhere (Recomendado para principiantes)

1. Crea una cuenta en [PythonAnywhere](https://www.pythonanywhere.com/)
2. Sube el archivo `app.py`
3. Instala las dependencias: `flask`, `pymongo`, `flask-cors`
4. Configura MongoDB Atlas y actualiza la conexión en `app.py`
5. Anota la URL de tu aplicación (ej: `https://tunombre.pythonanywhere.com`)
6. Actualiza los archivos JS para usar esta URL

### Opción 2: Solo usar GitHub Pages (Sin funcionalidad de backend)

Si solo quieres mostrar la página como portafolio sin funcionalidad de guardado:
- La página se verá perfectamente
- Los formularios se mostrarán pero no guardarán datos
- Es útil para demostración visual

## 🛠️ Funcionalidades

- ✅ Interfaz moderna y responsive
- ✅ Sistema de reserva de turnos
- ✅ Selección de trabajos (Corte, Tintura, Alisado, Permanente)
- ✅ Calendario para selección de fechas
- ✅ Panel de administración
- ⚠️ Guardado de turnos (requiere backend desplegado)
- ⚠️ Login de administrador (requiere backend desplegado)

## 📝 Credenciales de Administrador

Usuario: `edgardo`  
Contraseña: `123456`

**⚠️ IMPORTANTE**: Cambia estas credenciales en el archivo `app.py` antes de desplegar en producción.

## 🤝 Desarrollador

Desarrollada por Edgardo Soto

---

## ❓ Preguntas Frecuentes

**P: ¿Por qué no funciona el guardado de turnos en GitHub Pages?**  
R: GitHub Pages solo puede hospedar archivos estáticos (HTML, CSS, JS). El backend de Python necesita un servidor que ejecute código, lo cual GitHub Pages no proporciona.

**P: ¿Es gratis hospedar mi página?**  
R: Sí, GitHub Pages es completamente gratis. Para el backend, hay opciones gratuitas como PythonAnywhere (limitado) o MongoDB Atlas.

**P: ¿Puedo usar solo la parte visual sin el backend?**  
R: Sí, la página se verá perfectamente en GitHub Pages. Solo que los formularios no guardarán datos reales.
