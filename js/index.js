document.addEventListener('DOMContentLoaded', function() {
    let boton = document.getElementById('verMedidaBtn');
    let contenedor = document.getElementById('contenedorMedida');
    let imagen = document.querySelector('#contenedorMedida .medida');
    asignarEventosMedida(contenedor, boton, imagen);

    const trabajo = document.getElementById('seleccion_1');
    const medida = document.getElementById('medida');
    const verMedidaBtn = document.getElementById('verMedidaBtn');

    function actualizarMedida() {
        if (trabajo.value === 'opcion1') { 
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
            mostrarCalendario();
        });
    }
});

document.addEventListener('change', function(e) {
    // Solo si el cambio es en un select de tipo de trabajo
    if (e.target.matches('select[id^="seleccion_"]')) {
        const turnoRow = e.target.closest('.turno-row');
        const medidaSelect = turnoRow.querySelector('select[id="medida"]');
        const verMedidaBtn = turnoRow.querySelector('#verMedidaBtn');
        if (e.target.value === 'opcion1') { // Corte
            medidaSelect.disabled = true;
            verMedidaBtn.disabled = true;
        } else {
            medidaSelect.disabled = false;
            verMedidaBtn.disabled = false;
        }
    }
});

function agregar() {
    const contenido = document.getElementById('contenidoSeleccion');
    const turnoOriginal = document.getElementById('turnoSeleccion');
    const nuevoTurno = turnoOriginal.cloneNode(true);
    nuevoTurno.id = ""; // Evita duplicados de id

    // Limpia los campos si lo deseas
    nuevoTurno.querySelectorAll('input, select').forEach(el => {
        if (el.tagName === 'INPUT') el.value = '';
        if (el.tagName === 'SELECT') el.selectedIndex = 0;
    });

    // Agrega el botón eliminar solo en los turnos clonados
    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'medida';
    btnEliminar.textContent = 'eliminar';
    btnEliminar.onclick = function() { eliminar(this); };

    // Inserta el botón eliminar después del botón verMedidaBtn
    const btnVerMedida = nuevoTurno.querySelector('#verMedidaBtn');
    btnVerMedida.parentNode.insertBefore(btnEliminar, btnVerMedida.nextSibling);

    // Inserta antes del botón agregar
    const botonAgregar = document.querySelector('.boton-agregar');
    contenido.insertBefore(nuevoTurno, botonAgregar);

    // Asigna el evento al botón "Ver medida de cabello" del nuevo turno
    const nuevoBtnVerMedida = nuevoTurno.querySelector('#verMedidaBtn');
    const nuevoContenedorMedida = nuevoTurno.querySelector('#contenedorMedida');
    const nuevaImagen = nuevoContenedorMedida.querySelector('.medida');
    asignarEventosMedida(nuevoContenedorMedida, nuevoBtnVerMedida, nuevaImagen);
}

function eliminar(btn) {
    // Busca el contenedor .turno más cercano y lo elimina
    const turno = btn.closest('.turno');
    if (turno) {
        turno.remove();
    }
}

// Ejemplo simple de redirección tras login exitoso
function loginExitoso() {
    window.location.href = "panel.html";
}



function cerrarCalendario() {
    document.getElementById('modalCalendario').style.display = 'none';
}

// Genera un calendario simple del mes actual
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

    // Días de la semana
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    diasSemana.forEach(d => {
        const dia = document.createElement('div');
        dia.textContent = d;
        dia.style.fontWeight = 'bold';
        calendarioDiv.appendChild(dia);
    });

    // Espacios vacíos antes del primer día
    for (let i = 0; i < primerDia; i++) {
        calendarioDiv.appendChild(document.createElement('div'));
    }

    // Días del mes
    for (let d = 1; d <= diasMes; d++) {
        const fechaActual = new Date(year, month, d);
        const diaSemana = fechaActual.getDay(); // 0 = domingo, 1 = lunes

        const diaBtn = document.createElement('div');
        diaBtn.className = 'cal-dia';
        diaBtn.textContent = d;

        // Si es domingo (0) o lunes (1), deshabilita el día
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

// Simulación de horarios ocupados
let horariosOcupados = {};

function cargarTurnosOcupados() {
    fetch('http://localhost:5000/listar_turnos')
        .then(response => response.json())
        .then(turnos => {
            horariosOcupados = {};
            turnos.forEach(turno => {
                if (!horariosOcupados[turno.fecha]) {
                    horariosOcupados[turno.fecha] = [];
                }
                horariosOcupados[turno.fecha].push(turno.horario);
            });
        });
}

// Llama a esta función al cargar la página
document.addEventListener('DOMContentLoaded', cargarTurnosOcupados);

let horarioSeleccionado = null;

function mostrarHorarios(year, month, day) {
    const calendarioDiv = document.getElementById('calendario');
    const horariosDiv = document.getElementById('horarios');
    if (!horariosDiv || !calendarioDiv) return;

    calendarioDiv.style.display = 'none';
    horariosDiv.style.display = 'block';

    horariosDiv.innerHTML = `<h4>Horarios disponibles para ${day}/${month}/${year}</h4>`;

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
    const ocupados = horariosOcupados[fecha] || [];

    const ocupadosNormalizados = ocupados.map(h => h.trim());
    todosHorarios.forEach(horario => {
        // Quita 'hs' para comparar con la base
        const horaComparar = horario.replace('hs', '');
        // Normaliza espacios
        const horaNormalizada = horaComparar.trim();
        // Normaliza los ocupados también
        const ocupadosNormalizados = ocupados.map(h => h.trim());
        const btn = document.createElement('button');
        btn.textContent = horario;
        btn.className = 'cal-dia';
        if (ocupadosNormalizados.includes(horaNormalizada)) {
            btn.classList.add('no-disponible');
            btn.disabled = true;
        } else {
            btn.onclick = function() {
                document.querySelectorAll('.cal-dia.seleccionado').forEach(b => b.classList.remove('seleccionado'));
                btn.classList.add('seleccionado');
                horarioSeleccionado = horaNormalizada;
            };
        }
        gridHorarios.appendChild(btn);
    });

    horariosDiv.appendChild(gridHorarios);

    // Botón aceptar/aplicar
    const btnAceptar = document.createElement('button');
    btnAceptar.textContent = 'Aceptar';
    btnAceptar.className = 'agregar_style';
    btnAceptar.style.marginTop = '16px';
    btnAceptar.onclick = function() {
        if (!horarioSeleccionado) {
            alert('Selecciona un horario');
            return;
        }
        // Busca el input de nombre
        const nombreInput = document.getElementById('nombreCliente');
        const nombre = nombreInput ? nombreInput.value : '';
        const trabajoSelect = document.getElementById('seleccion_1');
        const trabajo = trabajoSelect ? trabajoSelect.options[trabajoSelect.selectedIndex].value : '';
        const medidaSelect = document.getElementById('medida');
        const medida = medidaSelect ? medidaSelect.options[medidaSelect.selectedIndex].value : '';
        const seleccion = `Nombre: ${nombre}\nTrabajo: ${trabajo}\nMedida: ${medida}\nFecha: ${day}/${month}/${year}\nHorario: ${horarioSeleccionado}`;
        alert('Turno guardado:\n' + seleccion);

        // Agrega el resumen debajo del contenedor de fechas
        const resumenDiv = document.getElementById('resumenTurnos');

        // Crea el contenedor con clase 'contenido'
        const resumen = document.createElement('div');
        resumen.className = 'contenido resumen-turno';

        // Contenido del resumen
        resumen.innerHTML = `
            <strong>Turno registrado:</strong><br>
            Nombre: ${nombre}<br>
            Trabajo: ${trabajo}<br>
            Medida: ${medida}<br>
            Fecha: ${day}/${month}/${year}<br>
            Horario: ${horarioSeleccionado}<br>
            <button class="agregar_style" id="btnConfirmarTurno" style="margin-top:12px;">Confirmar</button>
        `;

        resumenDiv.appendChild(resumen);

        // Evento para el botón "Confirmar"
        resumen.querySelector('#btnConfirmarTurno').onclick = function() {
            fetch('http://localhost:5000/guardar_turno', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    nombre: nombre,
                    trabajo: trabajo,
                    medida: medida,
                    fecha: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                    horario: horarioSeleccionado
                })
            })
            .then(response => response.json())
            .then(data => {
                alert('¡Turno enviado correctamente!');
                resumen.remove();
                cargarTurnosOcupados(); // <-- Actualiza los horarios ocupados
                location.reload();      // <-- Recarga la página
            });
        };

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
