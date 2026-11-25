/**
 * KickLab - entrenamientos.js
 * Lógica interactiva para la página de Entrenamientos (entrenamientos.html):
 * - Renderizado dinámico de la biblioteca de rutinas
 * - Modal y formulario para crear nuevas rutinas con persistencia
 * - Renderizado dinámico de eventos en la grilla del calendario semanal
 * - Modal y formulario para agendar una nueva sesión en el calendario
 * - Botón "Iniciar sesión" en cada tarjeta de rutina para cargarla en la sesión activa
 */

document.addEventListener('DOMContentLoaded', () => {
    renderBibliotecaRutinas();
    renderCalendario();
    inicializarModalRutina();
    inicializarModalSesionCalendario();
    inicializarDiasSemana();
});

// Renderiza las tarjetas de la biblioteca de rutinas
function renderBibliotecaRutinas() {
    const rutinas = KickLabStorage.getRutinas();
    const grid = document.querySelector('.biblioteca-grid');
    if (!grid) return;

    grid.innerHTML = '';

    rutinas.forEach((r) => {
        const card = document.createElement('article');
        card.className = 'rutina-card';
        card.innerHTML = `
            <div class="rutina-badge-pill ${r.pillClase || 'pill-cyan'}">${r.categoria}</div>
            <h3 class="rutina-title">${r.titulo}</h3>
            <p class="rutina-meta">${r.meta}</p>
            <ul class="rutina-checklist">
                ${r.fases.map(fase => `
                    <li><span class="rutina-check-bullet">✓</span> ${fase}</li>
                `).join('')}
            </ul>
            <button type="button" class="btn-rutina-action" data-rutina-id="${r.id}" data-rutina-titulo="${r.titulo}">Iniciar sesión</button>
        `;
        grid.appendChild(card);
    });

    // Eventos al hacer click en "Iniciar sesión"
    grid.querySelectorAll('.btn-rutina-action').forEach(btn => {
        btn.addEventListener('click', () => {
            const titulo = btn.getAttribute('data-rutina-titulo');
            mostrarNotificacion(`Iniciando rutina: "${titulo}"... Redirigiendo a registro`, 'success');
            setTimeout(() => {
                window.location.href = 'index.html#finalizar-sesion';
            }, 1200);
        });
    });
}

// Modal para Crear Rutina
function inicializarModalRutina() {
    const btnCrear = document.querySelector('.biblioteca-section .btn-green-neon');
    const modal = document.getElementById('modal-crear-rutina');
    const btnClose = modal ? modal.querySelector('.btn-close-modal') : null;
    const form = document.getElementById('form-nueva-rutina');

    if (btnCrear && modal) {
        btnCrear.addEventListener('click', () => {
            modal.classList.add('modal-open');
        });
    }

    if (btnClose && modal) {
        btnClose.addEventListener('click', () => {
            modal.classList.remove('modal-open');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('modal-open');
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const titulo = document.getElementById('rutina-titulo').value.trim();
            const categoria = document.getElementById('rutina-categoria').value;
            const duracion = document.getElementById('rutina-duracion').value.trim() || '45 min';
            const nivel = document.getElementById('rutina-nivel').value || 'Intermedio';
            const fase1 = document.getElementById('rutina-fase1').value.trim() || 'Calentamiento específico';
            const fase2 = document.getElementById('rutina-fase2').value.trim() || 'Bloque principal';
            const fase3 = document.getElementById('rutina-fase3').value.trim() || 'Vuelta a la calma';

            if (!titulo) {
                mostrarNotificacion('Por favor ingresa un título para la rutina', 'info');
                return;
            }

            // Mapear color de píldora según categoría
            let pillClase = 'pill-cyan';
            if (categoria === 'Sparring') pillClase = 'pill-orange';
            else if (categoria === 'Flexibilidad') pillClase = 'pill-purple-light';
            else if (categoria === 'Poomsae') pillClase = 'pill-yellow';
            else if (categoria === 'Fuerza') pillClase = 'pill-purple';

            const nuevaRutina = {
                id: 'rut-' + Date.now(),
                categoria,
                pillClase,
                titulo,
                meta: `${duracion} • ${nivel}`,
                fases: [fase1, fase2, fase3]
            };

            KickLabStorage.saveRutina(nuevaRutina);
            renderBibliotecaRutinas();
            form.reset();
            modal.classList.remove('modal-open');
            mostrarNotificacion('¡Rutina creada y guardada con éxito!');
        });
    }
}

// Renderiza los bloques en el calendario interactivo
function renderCalendario() {
    const eventos = KickLabStorage.getCalendario();
    const grid = document.querySelector('.calendar-grid');
    if (!grid) return;

    // Limpiar celdas de eventos previos (mantener encabezados y horas fijas)
    const celdas = grid.querySelectorAll('.cal-cell:not(.cal-header):not(.cal-time)');
    celdas.forEach(c => c.innerHTML = '');

    const diasColMap = {
        'lun': 1,
        'mar': 2,
        'mie': 3,
        'jue': 4,
        'vie': 5,
        'sab': 6,
        'dom': 7
    };

    const horasRowMap = {
        '10:00': 1,
        '12:00': 2,
        '14:00': 3,
        '16:00': 4,
        '17:00': 5,
        '18:00': 6,
        '20:00': 7
    };

    // Colocar eventos en sus celdas correspondientes
    eventos.forEach(ev => {
        const diaIndex = diasColMap[ev.dia.toLowerCase()];
        const horaRow = horasRowMap[ev.hora];

        if (diaIndex !== undefined && horaRow !== undefined) {
            // Cada fila tiene 8 celdas (1 time + 7 dias)
            // Índice de celda = (horaRow * 8) + diaIndex
            const celdaTarget = grid.children[(horaRow * 8) + diaIndex];
            if (celdaTarget) {
                const eventDiv = document.createElement('div');
                eventDiv.className = `cal-event ${ev.clase || 'event-green'}`;
                eventDiv.innerHTML = `
                    <strong>${ev.titulo}</strong>
                    <span>${ev.detalle}</span>
                `;
                celdaTarget.appendChild(eventDiv);
            }
        }
    });

    // Permitir hacer click en cualquier celda vacía para programar rápido
    celdas.forEach(celda => {
        celda.addEventListener('click', (e) => {
            if (e.target.closest('.cal-event')) return; // No abrir si se clickea un evento
            const modal = document.getElementById('modal-nueva-sesion-cal');
            if (modal) modal.classList.add('modal-open');
        });
    });
}

// Modal para Programar Sesión en Calendario
function inicializarModalSesionCalendario() {
    const btnNueva = document.querySelector('.calendario-section .btn-green-neon');
    const modal = document.getElementById('modal-nueva-sesion-cal');
    const btnClose = modal ? modal.querySelector('.btn-close-modal') : null;
    const form = document.getElementById('form-nueva-sesion-cal');

    if (btnNueva && modal) {
        btnNueva.addEventListener('click', () => {
            modal.classList.add('modal-open');
        });
    }

    if (btnClose && modal) {
        btnClose.addEventListener('click', () => {
            modal.classList.remove('modal-open');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('modal-open');
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const titulo = document.getElementById('cal-titulo').value.trim();
            const dia = document.getElementById('cal-dia').value;
            const hora = document.getElementById('cal-hora').value;
            const duracion = document.getElementById('cal-duracion').value.trim() || '60 min';
            const color = document.getElementById('cal-color').value || 'event-green';

            if (!titulo) {
                mostrarNotificacion('Por favor escribe el nombre de la sesión', 'info');
                return;
            }

            const nuevoEvento = {
                id: 'cal-' + Date.now(),
                dia,
                hora,
                titulo,
                detalle: `${hora} • ${duracion}`,
                clase: color
            };

            KickLabStorage.saveCalendarioEvento(nuevoEvento);
            renderCalendario();
            form.reset();
            modal.classList.remove('modal-open');
            mostrarNotificacion('¡Sesión agendada en tu calendario con éxito!');
        });
    }
}

// Interacción en slider de días
function inicializarDiasSemana() {
    const dias = document.querySelectorAll('.semana-slider .dia-card');
    dias.forEach(d => {
        d.addEventListener('click', () => {
            dias.forEach(item => item.classList.remove('dia-activo'));
            d.classList.add('dia-activo');
            const diaNum = d.querySelector('.dia-numero').textContent;
            const diaNom = d.querySelector('.dia-nombre').textContent;
            const diaTipo = d.querySelector('.dia-tipo').textContent;
            mostrarNotificacion(`Día seleccionado: ${diaNom.toUpperCase()} ${diaNum} • ${diaTipo}`);
        });
    });
}
