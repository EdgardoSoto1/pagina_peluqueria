
let datosReserva = null;


document.addEventListener('DOMContentLoaded', function() {
    cargarDatosReserva();
    configurarFormulario();
});


function cargarDatosReserva() {
    const datosString = sessionStorage.getItem('datosReserva');
    
    if (!datosString) {
        alert('No se encontraron datos de reserva. Redirigiendo al inicio...');
        window.location.href = '../index.html';
        return;
    }
    
    try {
        datosReserva = JSON.parse(datosString);
        mostrarResumenTurnos();
    } catch (error) {
        alert('Error en los datos de reserva. Redirigiendo al inicio...');
        window.location.href = '../index.html';
    }
}


function mostrarResumenTurnos() {
    const listaTurnos = document.getElementById('listaTurnos');
    const totalTurnos = document.getElementById('totalTurnos');
    
    if (!datosReserva || !datosReserva.turnos) {
        listaTurnos.innerHTML = '<p>No hay turnos para mostrar</p>';
        return;
    }
    
    let html = '';
    let totalServicios = 0;
    
    datosReserva.turnos.forEach((turno, index) => {
        const trabajosTexto = turno.trabajos.map(t => `${t.trabajoTexto} (${t.medidaTexto})`).join(', ');
        
        html += `
            <div class="turno-item">
                <strong>Cliente:</strong> ${turno.nombre}<br>
                <strong>Fecha:</strong> ${turno.fecha}<br>
                <strong>Horario:</strong> ${turno.horario}<br>
                <strong>Trabajos:</strong> ${trabajosTexto}<br>
                <strong>Duración:</strong> ${turno.trabajos.length * 30} minutos
            </div>
            ${index < datosReserva.turnos.length - 1 ? '<hr class="turno-divisor">' : ''}
        `;
        
        totalServicios += turno.trabajos.length;
    });
    
    listaTurnos.innerHTML = html;
    totalTurnos.innerHTML = `Total: ${datosReserva.turnos.length} turno(s) - ${totalServicios} trabajo(s)`;
}


function configurarFormulario() {
    const form = document.getElementById('formResponsable');
    form.addEventListener('submit', procesarConfirmacionFinal);
    

    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', validarCampo);
        input.addEventListener('input', limpiarErrores);
    });
}


function validarCampo(event) {
    const input = event.target;
    const valor = input.value.trim();
    
    switch (input.id) {
        case 'nombreResponsable':
            if (valor.length < 2) {
                mostrarErrorCampo(input, 'El nombre debe tener al menos 2 caracteres');
                return false;
            }
            break;
            
        case 'telefonoResponsable':
            if (!/^\d{8,15}$/.test(valor.replace(/\s/g, ''))) {
                mostrarErrorCampo(input, 'Ingrese un número de teléfono válido');
                return false;
            }
            break;
            
        case 'emailResponsable':
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
                mostrarErrorCampo(input, 'Ingrese un email válido');
                return false;
            }
            break;
    }
    
    limpiarErrorCampo(input);
    return true;
}


function mostrarErrorCampo(input, mensaje) {
    input.style.borderColor = '#dc3545';
    input.style.boxShadow = '0 0 0 3px rgba(220,53,69,0.1)';
    

    const errorAnterior = input.parentNode.querySelector('.campo-error');
    if (errorAnterior) errorAnterior.remove();
    

    const errorDiv = document.createElement('div');
    errorDiv.className = 'campo-error';
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '14px';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = mensaje;
    input.parentNode.appendChild(errorDiv);
}


function limpiarErrorCampo(input) {
    input.style.borderColor = '#e9ecef';
    input.style.boxShadow = 'none';
    
    const errorDiv = input.parentNode.querySelector('.campo-error');
    if (errorDiv) errorDiv.remove();
}


function limpiarErrores() {
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
}


function mostrarError(mensaje) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = mensaje;
    errorDiv.style.display = 'block';
    errorDiv.scrollIntoView({ behavior: 'smooth' });
}


function mostrarExito(mensaje) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = mensaje;
    successDiv.style.display = 'block';
    successDiv.scrollIntoView({ behavior: 'smooth' });
}


async function procesarConfirmacionFinal(event) {
    event.preventDefault();

    if (!validarFormularioCompleto()) {
        return;
    }

    mostrarLoading(true);
    limpiarErrores();
    
    try {

        const responsable = {
            nombre: document.getElementById('nombreResponsable').value.trim(),
            telefono: document.getElementById('telefonoResponsable').value.trim(),
            email: document.getElementById('emailResponsable').value.trim()
        };

        const resultados = await procesarTodosLosTurnos(responsable);
        
        if (resultados.exitosos.length > 0) {
            mostrarExito(`¡Reserva confirmada! Se guardaron ${resultados.exitosos.length} turno(s) exitosamente.`);
            

            sessionStorage.removeItem('datosReserva');
            

            setTimeout(() => {
                window.location.href = '../index.html?reserva=exitosa';
            }, 3000);
        } else {
            mostrarError('No se pudo guardar ningún turno. Por favor, intente nuevamente.');
        }
        
    } catch (error) {
        mostrarError('Error al procesar la reserva. Por favor, intente nuevamente.');
    } finally {
        mostrarLoading(false);
    }
}


function validarFormularioCompleto() {
    const campos = [
        'nombreResponsable',
        'telefonoResponsable', 
        'emailResponsable'
    ];
    
    let valido = true;
    
    campos.forEach(campoId => {
        const input = document.getElementById(campoId);
        if (!validarCampo({ target: input })) {
            valido = false;
        }
    });
    
    if (!valido) {
        mostrarError('Por favor, corrija los errores en el formulario.');
    }
    
    return valido;
}


async function procesarTodosLosTurnos(responsable) {
    const resultados = {
        exitosos: [],
        errores: []
    };
    
    for (const turno of datosReserva.turnos) {
        try {
            await procesarTurnoIndividual(turno, responsable);
            resultados.exitosos.push(turno);
        } catch (error) {
            resultados.errores.push({
                turno: turno,
                error: error.message
            });
        }
    }
    
    return resultados;
}


async function procesarTurnoIndividual(turno, responsable) {
    const [hora, minutos] = turno.horario.split(':').map(Number);
    let minutosInicio = hora * 60 + minutos;

    for (let i = 0; i < turno.trabajos.length; i++) {
        const trabajo = turno.trabajos[i];
        const minutosActuales = minutosInicio + (i * 30);
        const horaActual = Math.floor(minutosActuales / 60);
        const minActual = minutosActuales % 60;
        const horarioTrabajo = `${String(horaActual).padStart(2, '0')}:${String(minActual).padStart(2, '0')}`;
        
        const response = await fetch('http://localhost:5000/guardar_turno', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                nombre: turno.nombre,
                trabajo: trabajo.trabajoTexto,
                medida: trabajo.medidaTexto,
                fecha: turno.fechaCompleta,
                horario: horarioTrabajo,
                responsable_nombre: responsable.nombre,
                responsable_telefono: responsable.telefono,
                responsable_email: responsable.email
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            if (response.status === 409) {
                throw new Error(`El horario ${horarioTrabajo} ya está ocupado`);
            } else {
                throw new Error(data.mensaje || 'Error al guardar el turno');
            }
        }
    }
}


function mostrarLoading(mostrar) {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const btnConfirmar = document.querySelector('button[type="submit"]');
    const btnVolver = document.querySelector('button[type="button"]');
    
    if (mostrar) {
        loadingSpinner.style.display = 'block';
        btnConfirmar.disabled = true;
        btnConfirmar.style.opacity = '0.5';
        btnVolver.disabled = true;
        btnVolver.style.opacity = '0.5';
        btnConfirmar.textContent = 'Procesando...';
    } else {
        loadingSpinner.style.display = 'none';
        btnConfirmar.disabled = false;
        btnConfirmar.style.opacity = '1';
        btnVolver.disabled = false;
        btnVolver.style.opacity = '1';
        btnConfirmar.textContent = 'Confirmar Reserva';
    }
}