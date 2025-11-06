let turnosAcumulados = [];
let contadorTrabajos = 1;

function agregarOtroTrabajo() {
    contadorTrabajos++;
    const trabajosContainer = document.getElementById('trabajosContainer');
    
    const nuevoTrabajo = document.createElement('div');
    nuevoTrabajo.className = 'trabajo-item';
    nuevoTrabajo.setAttribute('data-trabajo', contadorTrabajos);
    
    nuevoTrabajo.innerHTML = `
        <h4>Trabajo ${contadorTrabajos}:</h4>
        <button type="button" class="btn-quitar-trabajo" onclick="quitarTrabajo(${contadorTrabajos})">Quitar</button>
        <div class="turno-row">
            <div class="grupo-campo">
                <label for="seleccion_${contadorTrabajos}">Tipo de trabajo(*)</label>
                <select id="seleccion_${contadorTrabajos}" class="trabajo-select" required>
                    <option value="">Selecciona un trabajo</option>
                    <option value="Corte">Corte</option>
                    <option value="Tintura">Tintura</option>
                    <option value="Alisado">Alisado</option>
                    <option value="Permanente">Permanente</option>
                </select>
            </div>
            <div class="grupo-campo">
                <label for="medida_${contadorTrabajos}">Largo de cabello</label>
                <select id="medida_${contadorTrabajos}" class="medida-select" required>
                    <option value="vacio" readonly>Selecciona una medida</option>
                    <option value="Corto">Corto</option>
                    <option value="Medio">Medio</option>
                    <option value="Largo">Largo</option>
                </select>
            </div>
            <button type="button" id="verMedidaBtn_${contadorTrabajos}">Ver medida de cabello</button>
        </div>
        <div id="contenedorMedida_${contadorTrabajos}" class="modal">
            <div class="modal-contenido">
                <img class="medida" src="./img/medida_1.jpeg" alt="medida">
            </div>
        </div>
    `;
    
    trabajosContainer.appendChild(nuevoTrabajo);
    

    const trabajoSelect = document.getElementById(`seleccion_${contadorTrabajos}`);
    const medidaSelect = document.getElementById(`medida_${contadorTrabajos}`);
    const verMedidaBtn = document.getElementById(`verMedidaBtn_${contadorTrabajos}`);
    
    trabajoSelect.addEventListener('change', function() {
        if (this.value === 'Corte') {
            medidaSelect.disabled = true;
            medidaSelect.value = 'vacio';
            verMedidaBtn.disabled = true;
        } else {
            medidaSelect.disabled = false;
            verMedidaBtn.disabled = false;
        }
    });
    

    const contenedorMedida = document.getElementById(`contenedorMedida_${contadorTrabajos}`);
    const imagen = contenedorMedida.querySelector('.medida');
    asignarEventosMedida(contenedorMedida, verMedidaBtn, imagen);
    

    if (contadorTrabajos >= 4) {
        document.getElementById('btnAgregarTrabajo').style.display = 'none';
    }
}


function quitarTrabajo(numeroTrabajo) {
    const trabajoItem = document.querySelector(`[data-trabajo="${numeroTrabajo}"]`);
    if (trabajoItem) {
        trabajoItem.remove();

        document.getElementById('btnAgregarTrabajo').style.display = 'inline-block';
    }
}


function validarTodosLosTrabajos() {
    const nombre = document.getElementById('nombreCliente').value.trim();
    

    if (nombre === '') {
        alert('Por favor, ingrese su nombre');
        return false;
    }
    
    if (nombre.length < 2) {
        alert('El nombre debe tener al menos 2 caracteres');
        return false;
    }
    

    const trabajos = document.querySelectorAll('.trabajo-item');
    if (trabajos.length === 0) {
        alert('Debe agregar al menos un trabajo');
        return false;
    }
    

    for (let i = 0; i < trabajos.length; i++) {
        const trabajo = trabajos[i];
        const numeroTrabajo = trabajo.getAttribute('data-trabajo');
        const trabajoSelect = trabajo.querySelector('.trabajo-select');
        const medidaSelect = trabajo.querySelector('.medida-select');
        
        const tipoTrabajo = trabajoSelect ? trabajoSelect.value : '';
        const medida = medidaSelect ? medidaSelect.value : '';
        
        if (tipoTrabajo === '' || tipoTrabajo === null) {
            alert(`Por favor, seleccione el tipo de trabajo para el Trabajo ${numeroTrabajo}`);
            return false;
        }
        
        if (tipoTrabajo !== 'Corte' && (medida === '' || medida === 'vacio')) {
            alert(`Por favor, seleccione el largo de cabello para el Trabajo ${numeroTrabajo}`);
            return false;
        }
    }
    

    if (!horarioSeleccionado) {
        alert('Por favor, seleccione una fecha y horario');
        return false;
    }
    
    return true;
}


function obtenerTodosLosTrabajos() {
    const trabajos = [];
    const trabajoItems = document.querySelectorAll('.trabajo-item');
    
    trabajoItems.forEach((item, index) => {
        const trabajoSelect = item.querySelector('.trabajo-select');
        const medidaSelect = item.querySelector('.medida-select');
        
        if (trabajoSelect && medidaSelect) {
            const trabajo = trabajoSelect.value;
            const medida = medidaSelect.value;
            const medidaTexto = (trabajo === 'Corte') ? 'No aplica' : medida;
            
            trabajos.push({
                trabajo: trabajo,
                trabajoTexto: trabajo,
                medida: medida,
                medidaTexto: medidaTexto
            });
        }
    });
    
    return trabajos;
}


function limpiarFormulario() {
    document.getElementById('nombreCliente').value = '';
    

    const trabajoItems = document.querySelectorAll('.trabajo-item');
    for (let i = 1; i < trabajoItems.length; i++) {
        trabajoItems[i].remove();
    }
    

    document.getElementById('seleccion_1').selectedIndex = 0;
    document.getElementById('medida').selectedIndex = 0;
    document.getElementById('medida').disabled = false;
    document.getElementById('verMedidaBtn').disabled = false;
    

    contadorTrabajos = 1;
    

    document.getElementById('btnAgregarTrabajo').style.display = 'inline-block';
    

    horarioSeleccionado = null;
}


function actualizarResumenTurnos() {
    const resumenDiv = document.getElementById('resumenTurnos');
    

    resumenDiv.innerHTML = '';
    
    if (turnosAcumulados.length === 0) return;
    

    const resumen = document.createElement('div');
    resumen.className = 'contenido resumen-turno';
    

    let htmlTurnos = '<div style="text-align: center; width: 100%;"><h2 style="margin-bottom: 20px;">Turnos registrados</h2></div>';
    
    turnosAcumulados.forEach((turno, index) => {

        let trabajosTexto = '';
        if (turno.trabajos && turno.trabajos.length > 0) {
            const turnosReservados = generarTurnosConsecutivos(turno.horario, turno.trabajos.length);
            trabajosTexto = turno.trabajos.map((trabajo, idx) => 
                `<div style="margin: 5px 0; padding: 5px; background: rgba(255,255,255,0.2); border-radius: 5px;">
                    <strong>Trabajo ${idx + 1}:</strong> ${trabajo.trabajoTexto} 
                    ${trabajo.medidaTexto !== 'No aplica' ? `(${trabajo.medidaTexto})` : ''}<br>
                    <small>🕐 Horario: ${turnosReservados[idx]}</small>
                </div>`
            ).join('');
        } else if (turno.servicios && turno.servicios.length > 0) {

            const turnosReservados = generarTurnosConsecutivos(turno.horario, turno.servicios.length);
            trabajosTexto = turno.servicios.map((servicio, idx) => 
                `<div style="margin: 5px 0; padding: 5px; background: rgba(255,255,255,0.2); border-radius: 5px;">
                    <strong>Trabajo ${idx + 1}:</strong> ${servicio.trabajoTexto} 
                    ${servicio.medidaTexto !== 'No aplica' ? `(${servicio.medidaTexto})` : ''}<br>
                    <small>🕐 Horario: ${turnosReservados[idx]}</small>
                </div>`
            ).join('');
        } else {

            trabajosTexto = `<strong>Trabajo:</strong> ${turno.trabajoTexto || 'N/A'}<br>
                             <strong>Medida:</strong> ${turno.medidaTexto || 'N/A'}`;
        }

        htmlTurnos += `
            <div class="turno-resumen-item" data-index="${index}">
                <div class="turno-info">
                    <strong>Turno ${index + 1}:</strong><br>
                    <strong>Nombre:</strong> ${turno.nombre}<br>
                    <div style="margin: 10px 0;">
                        <strong>Trabajos:</strong><br>
                        ${trabajosTexto}
                    </div>
                    <strong>Fecha:</strong> ${turno.fecha}<br>
                    <strong>Horario de inicio:</strong> ${turno.horario}<br>
                    <strong>Duración total:</strong> ${(turno.trabajos || turno.servicios || []).length * 30} minutos
                </div>
                <div class="turno-acciones">
                    <button class="agregar_style btn-eliminar" onclick="eliminarTurnoDelResumen(${index})">Eliminar</button>
                </div>
            </div>
        `;
    });
    
    resumen.innerHTML = htmlTurnos;
    

    const botonConfirmarTodos = document.createElement('div');
    botonConfirmarTodos.className = 'boton-agregar';
    botonConfirmarTodos.innerHTML = `<button class="agregar_style btn-confirmar-todos" id="btnConfirmarTodos">Confirmar todos los turnos (${turnosAcumulados.length})</button>`;
    
    resumenDiv.appendChild(resumen);
    resumenDiv.appendChild(botonConfirmarTodos);
    

    botonConfirmarTodos.querySelector('#btnConfirmarTodos').onclick = confirmarTodosLosTurnos;
}


function eliminarTurnoDelResumen(index) {
    if (confirm('¿Seguro que deseas eliminar este turno?')) {
        turnosAcumulados.splice(index, 1);
        actualizarResumenTurnos();
    }
}


async function confirmarTodosLosTurnos() {
    if (turnosAcumulados.length === 0) {
        alert('No hay turnos para enviar.');
        return;
    }

    try {
        await cargarTurnosOcupados(); // Actualiza datos más recientes
        

        let todosValidos = true;
        const erroresValidacion = [];
        
        for (let i = 0; i < turnosAcumulados.length; i++) {
            const turno = turnosAcumulados[i];
            const trabajos = turno.trabajos || turno.servicios || [];
            

            const turnosDisponibles = verificarTurnosConsecutivos(
                turno.horario, 
                trabajos.length, 
                horariosOcupados, 
                turno.fechaCompleta
            );
            
            if (!turnosDisponibles) {
                todosValidos = false;
                erroresValidacion.push(`Turno ${i + 1} (${turno.nombre}): Horario ya no disponible`);
            }
        }
        
        if (!todosValidos) {
            alert(`Error de validación:\n${erroresValidacion.join('\n')}\n\nPor favor, seleccione otros horarios.`);
            return;
        }
        

        const datosParaConfirmacion = {
            turnos: turnosAcumulados.map(turno => ({
                nombre: turno.nombre,
                fecha: turno.fecha,
                fechaCompleta: turno.fechaCompleta,
                horario: turno.horario,
                trabajos: turno.trabajos || turno.servicios || []
            }))
        };
        

        sessionStorage.setItem('datosReserva', JSON.stringify(datosParaConfirmacion));

        window.location.href = 'html/confirmacion.html';
        
    } catch (error) {
        alert('Error al validar los turnos. Por favor, intente nuevamente.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    let boton = document.getElementById('verMedidaBtn');
    let contenedor = document.getElementById('contenedorMedida');
    let imagen = document.querySelector('#contenedorMedida .medida');
    asignarEventosMedida(contenedor, boton, imagen);

    const trabajo = document.getElementById('seleccion_1');
    const medida = document.getElementById('medida');
    const verMedidaBtn = document.getElementById('verMedidaBtn');

    function actualizarMedida() {
        if (trabajo.value === 'Corte') { 
            medida.disabled = true;
            verMedidaBtn.disabled = true;
        } else {
            medida.disabled = false;
            verMedidaBtn.disabled = false;
        }
    }

    trabajo.addEventListener('change', actualizarMedida);
    actualizarMedida(); 

    const btnSeleccionarFechas = document.querySelector('.seleccionar-fechas-btn');
    if (btnSeleccionarFechas) {
        btnSeleccionarFechas.addEventListener('click', function() {
            document.getElementById('modalCalendario').style.display = 'flex';

            cargarTurnosOcupados().then(() => {
                mostrarCalendario();
            });
        });
    }

    const btnAgregarTrabajo = document.getElementById('btnAgregarTrabajo');
    if (btnAgregarTrabajo) {
        btnAgregarTrabajo.addEventListener('click', agregarOtroTrabajo);
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reserva') === 'exitosa') {
        mostrarMensajeExito();
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    cargarTurnosOcupados().then(() => {
    }).catch(error => {
    });
});





function cerrarCalendario() {
    document.getElementById('modalCalendario').style.display = 'none';
}


function mostrarCalendario() {
    const calendarioDiv = document.getElementById('calendario');
    const horariosDiv = document.getElementById('horarios');
    calendarioDiv.style.display = 'grid';
    horariosDiv.style.display = 'none';
    calendarioDiv.innerHTML = '';
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = hoy.getMonth();
    const primerDia = new Date(year, month, 1).getDay();
    const diasMes = new Date(year, month + 1, 0).getDate();


    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    diasSemana.forEach(d => {
        const dia = document.createElement('div');
        dia.textContent = d;
        dia.style.fontWeight = 'bold';
        calendarioDiv.appendChild(dia);
    });


    for (let i = 0; i < primerDia; i++) {
        calendarioDiv.appendChild(document.createElement('div'));
    }


    for (let d = 1; d <= diasMes; d++) {
        const fechaActual = new Date(year, month, d);
        const diaSemana = fechaActual.getDay(); // 0 = domingo, 1 = lunes

        const diaBtn = document.createElement('div');
        diaBtn.className = 'cal-dia';
        diaBtn.textContent = d;


        if (diaSemana === 0 || diaSemana === 1) {
            diaBtn.classList.add('no-disponible');
            diaBtn.style.pointerEvents = 'none';
            diaBtn.style.opacity = '0.5';
        } else {
            diaBtn.onclick = () => mostrarHorarios(year, month + 1, d);
        }

        calendarioDiv.appendChild(diaBtn);
    }
}


let horariosOcupados = {};

function cargarTurnosOcupados() {
    return fetch('http://localhost:5000/listar_turnos')
        .then(response => response.json())
        .then(turnos => {
            horariosOcupados = {};
            turnos.forEach(turno => {
                if (!horariosOcupados[turno.fecha]) {
                    horariosOcupados[turno.fecha] = [];
                }
                horariosOcupados[turno.fecha].push(turno.horario);
            });
            return horariosOcupados;
        })
        .catch(error => {
            horariosOcupados = {};
            return horariosOcupados;
        });
}


function mostrarMensajeExito() {
    alert('¡Reserva confirmada exitosamente!');
}

let horarioSeleccionado = null;


function verificarTurnosConsecutivos(horaInicio, cantidadTurnos, horariosOcupados, fecha) {
    const ocupados = horariosOcupados[fecha] || [];
    const ocupadosNormalizados = ocupados.map(h => h.trim());

    const [hora, minutos] = horaInicio.split(':').map(Number);
    let minutosInicio = hora * 60 + minutos;
    
    const turnosAVerificar = [];
    

    for (let i = 0; i < cantidadTurnos; i++) {
        const minutosActuales = minutosInicio + (i * 30);
        const horaActual = Math.floor(minutosActuales / 60);
        const minActual = minutosActuales % 60;
        const horarioString = `${String(horaActual).padStart(2, '0')}:${String(minActual).padStart(2, '0')}`;
        
        turnosAVerificar.push(horarioString);
        
        if (ocupadosNormalizados.includes(horarioString)) {
            return false;
        }

        if (minutosActuales < 9 * 60 || minutosActuales >= 17 * 60) {
            return false;
        }
    }

    return true;
}


function generarTurnosConsecutivos(horaInicio, cantidadTurnos) {
    const turnos = [];
    const [hora, minutos] = horaInicio.split(':').map(Number);
    let minutosInicio = hora * 60 + minutos;
    
    for (let i = 0; i < cantidadTurnos; i++) {
        const minutosActuales = minutosInicio + (i * 30);
        const horaActual = Math.floor(minutosActuales / 60);
        const minActual = minutosActuales % 60;
        const horarioString = `${String(horaActual).padStart(2, '0')}:${String(minActual).padStart(2, '0')}`;
        turnos.push(horarioString);
    }
    
    return turnos;
}

function mostrarHorarios(year, month, day) {
    const calendarioDiv = document.getElementById('calendario');
    const horariosDiv = document.getElementById('horarios');
    if (!horariosDiv || !calendarioDiv) return;

    calendarioDiv.style.display = 'none';
    horariosDiv.style.display = 'block';

    const cantidadTrabajos = document.querySelectorAll('.trabajo-item').length;
    const tiempoTotal = cantidadTrabajos * 30; // 30 minutos por trabajo
    

    let mensajeTurnos;
    if (cantidadTrabajos === 1) {
        mensajeTurnos = `Se reservará 1 turno de 30 minutos`;
    } else {
        mensajeTurnos = `Se reservarán ${cantidadTrabajos} turnos consecutivos de 30 min cada uno`;
    }
    
    horariosDiv.innerHTML = `
        <h4>Horarios disponibles para ${day}/${month}/${year}</h4>
        <p style="background: #e3e6f3; padding: 10px; border-radius: 8px; margin: 10px 0;">
            <strong>⏰ Duración total: ${tiempoTotal} minutos (${cantidadTrabajos} trabajo${cantidadTrabajos > 1 ? 's' : ''})</strong><br>
            <small>${mensajeTurnos}</small>
        </p>
    `;

    const todosHorarios = [];
    for (let h = 9; h < 17.5; h += 0.5) {
        let hora = Math.floor(h);
        let minutos = h % 1 === 0 ? '00' : '30';
        todosHorarios.push(`${String(hora).padStart(2, '0')}:${minutos}hs`);
    }

    const gridHorarios = document.createElement('div');
    gridHorarios.style.display = 'grid';
    gridHorarios.style.gridTemplateColumns = 'repeat(4, 1fr)';
    gridHorarios.style.gap = '8px';
    gridHorarios.style.marginTop = '12px';

    const fecha = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    todosHorarios.forEach(horario => {

        const horaComparar = horario.replace('hs', '');
        const horaNormalizada = horaComparar.trim();
        
        const btn = document.createElement('button');
        btn.className = 'cal-dia';
        

        const disponible = verificarTurnosConsecutivos(horaNormalizada, cantidadTrabajos, horariosOcupados, fecha);
        
        if (!disponible) {
            btn.classList.add('no-disponible');
            btn.disabled = true;
            btn.textContent = horario;
        } else {
            btn.textContent = horario;

            const turnos = generarTurnosConsecutivos(horaNormalizada, cantidadTrabajos);
            if (cantidadTrabajos > 1) {
                btn.title = `Se reservarán: ${turnos.join(', ')}`;
            }
            
            btn.onclick = function() {
                document.querySelectorAll('.cal-dia.seleccionado').forEach(b => b.classList.remove('seleccionado'));
                btn.classList.add('seleccionado');
                horarioSeleccionado = horaNormalizada;
                

                if (cantidadTrabajos > 1) {
                    const turnosInfo = document.getElementById('turnosInfo');
                    if (turnosInfo) turnosInfo.remove();
                    
                    const infoDiv = document.createElement('div');
                    infoDiv.id = 'turnosInfo';
                    infoDiv.style.cssText = 'background: #4CAF50; color: white; padding: 10px; border-radius: 8px; margin: 10px 0; text-align: center;';
                    infoDiv.innerHTML = `<strong>Turnos reservados:</strong> ${turnos.join(' → ')}`;
                    horariosDiv.appendChild(infoDiv);
                }
            };
        }
        gridHorarios.appendChild(btn);
    });

    horariosDiv.appendChild(gridHorarios);


    const btnAceptar = document.createElement('button');
    btnAceptar.textContent = 'Aceptar';
    btnAceptar.className = 'agregar_style';
    btnAceptar.style.marginTop = '16px';
    btnAceptar.onclick = function() {

        if (!validarTodosLosTrabajos()) {
            return;
        }
        

        const cantidadTrabajos = document.querySelectorAll('.trabajo-item').length;
        const fecha = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        if (!verificarTurnosConsecutivos(horarioSeleccionado, cantidadTrabajos, horariosOcupados, fecha)) {
            alert('Error: Los horarios seleccionados ya no están disponibles. Por favor, seleccione otro horario.');

            cargarTurnosOcupados();
            mostrarHorarios(year, month, day);
            return;
        }
        

        const nombreInput = document.getElementById('nombreCliente');
        const nombre = nombreInput ? nombreInput.value.trim() : '';
        

        const trabajos = obtenerTodosLosTrabajos();
        

        const nuevoTurno = {
            nombre: nombre,
            trabajos: trabajos,
            fecha: `${day}/${month}/${year}`,
            fechaCompleta: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
            horario: horarioSeleccionado
        };
        

        const turnoExistente = turnosAcumulados.find(turno => 
            turno.fechaCompleta === nuevoTurno.fechaCompleta && 
            turno.horario === nuevoTurno.horario
        );
        
        if (turnoExistente) {
            alert('Ya hay un turno registrado para esa fecha y horario. Por favor selecciona otro horario.');
            return;
        }
        

        turnosAcumulados.push(nuevoTurno);
        

        const turnosReservados = generarTurnosConsecutivos(horarioSeleccionado, trabajos.length);
        const trabajosConHorarios = trabajos.map((t, idx) => 
            `${t.trabajoTexto} (${t.medidaTexto}) - ${turnosReservados[idx]}`
        ).join('\n');
        

        alert(`Turno agregado:\nNombre: ${nombre}\n\nTrabajos y horarios:\n${trabajosConHorarios}\n\nFecha: ${day}/${month}/${year}\nDuración total: ${trabajos.length * 30} minutos\n\nTurnos acumulados: ${turnosAcumulados.length}`);
        

        actualizarResumenTurnos();
        

        limpiarFormulario();
        

        cerrarCalendario();
    };
    horariosDiv.appendChild(btnAceptar);
}

function asignarEventosMedida(contenedor, boton, imagen) {
    if (contenedor) contenedor.style.display = 'none';
    boton.addEventListener('click', function() {
        contenedor.style.display = contenedor.style.display === 'none' ? 'flex' : 'none';
    });
    if (imagen) {
        imagen.addEventListener('click', function() {
            contenedor.style.display = 'none';
        });
    }
}
