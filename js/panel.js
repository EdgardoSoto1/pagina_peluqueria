document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:5000/listar_turnos')
        .then(response => response.json())
        .then(turnos => {
            const tbody = document.getElementById('tabla-turnos-body');
            tbody.innerHTML = '';
            const hoy = new Date();
            turnos.forEach(turno => {
                // Compara la fecha del turno con la fecha actual
                const fechaTurno = new Date(turno.fecha);
                let estado = 'Pendiente';
                if (fechaTurno < hoy) {
                    estado = 'Realizado';
                }
                tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${turno.nombre}</td>
                    <td>${turno.trabajo}</td>
                    <td>${turno.fecha}</td>
                    <td>${turno.horario}</td>
                    <td>${estado}</td>
                    <td>
                        <button class="agregar_style cancelar-btn" ${estado === 'Realizado' ? 'disabled' : ''}>Cancelar</button>
                    </td>
                `;
                // Solo permite cancelar si el turno está pendiente
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
        });
});