document.addEventListener('DOMContentLoaded', function() {

    verificarAutenticacion();
    
    console.log('Página Agregar Trabajo cargada');
    

    const form = document.getElementById('formAgregarTrabajo');
    form.addEventListener('submit', manejarEnvioFormulario);
});

function manejarEnvioFormulario(event) {
    event.preventDefault();
    

    const formData = new FormData(event.target);
    const trabajoData = {
        nombre: formData.get('nombreTrabajo'),
        descripcion: formData.get('descripcionTrabajo'),
        duracion: parseInt(formData.get('duracionTrabajo')),
        precio: parseFloat(formData.get('precioTrabajo')) || 0,
        requiereMedida: formData.get('requiereMedida') === 'si',
        activo: formData.get('activo') === 'true'
    };

    console.log('Datos del trabajo a guardar:', trabajoData);


    if (!trabajoData.nombre.trim()) {
        mostrarError('El nombre del trabajo es obligatorio');
        return;
    }

    if (trabajoData.duracion < 15) {
        mostrarError('La duración mínima es de 15 minutos');
        return;
    }


    simularGuardado(trabajoData);
}

function simularGuardado(trabajoData) {

    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Guardando...';
    submitBtn.disabled = true;


    fetch('/agregar_trabajo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(trabajoData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensaje === 'Trabajo agregado exitosamente') {
            mostrarExito(data.mensaje);
            

            setTimeout(() => {
                document.getElementById('formAgregarTrabajo').reset();
                document.getElementById('duracionTrabajo').value = '30';
                ocultarMensajes();
            }, 2000);
        } else {
            mostrarError(data.mensaje || 'Error al guardar el trabajo');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarError('Error de conexión al servidor');
    })
    .finally(() => {

        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function mostrarExito(mensaje) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = mensaje;
    successDiv.style.display = 'block';
    
    ocultarError();
    

    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 5000);
}

function mostrarError(mensaje) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = mensaje;
    errorDiv.style.display = 'block';
    
    ocultarExito();
}

function ocultarExito() {
    document.getElementById('successMessage').style.display = 'none';
}

function ocultarError() {
    document.getElementById('errorMessage').style.display = 'none';
}

function ocultarMensajes() {
    ocultarExito();
    ocultarError();
}


function verificarAutenticacion() {
    const sesion = localStorage.getItem('admin_session');
    if (!sesion) {
        alert('Acceso no autorizado. Redirigiendo al login...');
        window.location.href = 'login.html';
    }
}
