let todosLosTurnos = [];

document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacion();
    cargarTurnos();
});

function cargarTurnos() {
    fetch('http://localhost:5000/listar_turnos')
        .then(response => response.json())
        .then(turnos => {
            todosLosTurnos = turnos;
            mostrarTurnos(turnos);
        });
}

function mostrarTurnos(turnos) {
    const tbody = document.getElementById('tabla-turnos-body');
    tbody.innerHTML = '';
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (turnos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center;">No se encontraron turnos en el rango seleccionado</td></tr>';
        return;
    }
    
    turnos.forEach(turno => {
        const fechaTurno = new Date(turno.fecha);
        fechaTurno.setHours(0, 0, 0, 0);
        
        let estado = 'Pendiente';
        if (fechaTurno < hoy) {
            estado = 'Realizado';
        }
        tr = document.createElement('tr');
        
        const responsableNombre = turno.responsable?.nombre || 'No registrado';
        const responsableEmail = turno.responsable?.email || 'No registrado';
        
        tr.innerHTML = `
            <td>${turno.nombre}</td>
            <td>${turno.trabajo}</td>
            <td>${turno.medida || 'No especificada'}</td>
            <td>${turno.fecha}</td>
            <td>${turno.horario}</td>
            <td>${responsableNombre}</td>
            <td>${responsableEmail}</td>
            <td>${estado}</td>
            <td>
                <button class="agregar_style cancelar-btn" ${estado === 'Realizado' ? 'disabled' : ''}>Cancelar</button>
            </td>
        `;
        if (estado === 'Pendiente') {
            tr.querySelector('.cancelar-btn').onclick = function() {
                if (confirm('¿Seguro que deseas cancelar este turno?')) {
                    fetch('http://localhost:5000/cancelar_turno', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({
                            nombre: turno.nombre,
                            fecha: turno.fecha,
                            horario: turno.horario
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        alert(data.mensaje);
                        tr.remove();
                    });
                }
            };
        }
        tbody.appendChild(tr);
    });
}

function filtrarPorFechas() {
    const fechaInicio = document.getElementById('fecha-inicio').value;
    const fechaFin = document.getElementById('fecha-fin').value;
    
    if (!fechaInicio && !fechaFin) {
        alert('Por favor selecciona al menos una fecha');
        return;
    }
    
    let turnosFiltrados = todosLosTurnos;
    
    if (fechaInicio && fechaFin) {
        if (new Date(fechaInicio) > new Date(fechaFin)) {
            alert('La fecha de inicio no puede ser mayor que la fecha fin');
            return;
        }
        
        turnosFiltrados = todosLosTurnos.filter(turno => {
            const fechaTurno = new Date(turno.fecha);
            return fechaTurno >= new Date(fechaInicio) && fechaTurno <= new Date(fechaFin);
        });
    } else if (fechaInicio) {
        turnosFiltrados = todosLosTurnos.filter(turno => {
            return new Date(turno.fecha) >= new Date(fechaInicio);
        });
    } else if (fechaFin) {
        turnosFiltrados = todosLosTurnos.filter(turno => {
            return new Date(turno.fecha) <= new Date(fechaFin);
        });
    }
    
    mostrarTurnos(turnosFiltrados);
}

function limpiarFiltros() {
    document.getElementById('fecha-inicio').value = '';
    document.getElementById('fecha-fin').value = '';
    mostrarTurnos(todosLosTurnos);
}

function verificarAutenticacion() {
    const sesion = localStorage.getItem('admin_session');
    if (!sesion) {
        alert('Acceso no autorizado. Redirigiendo al login...');
        window.location.href = 'login.html';
    }
}
