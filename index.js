/**
 * KickLab - index.js
 * Lógica interactiva para la página principal (index.html):
 * - Renderizado dinámico de estadísticas y cuenta atrás desde Storage
 * - Renderizado y checklist interactivo de torneos
 * - Formulario para agregar nuevo torneo (Modal)
 * - Stepper interactivo y guardado de sesión post-entrenamiento
 * - Selección interactiva de chips (intensidad, sensación, técnicas)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar y cargar datos
    actualizarMetricasIndex();
    renderTorneos();
    inicializarFormularioSesion();
    inicializarModalTorneo();
    inicializarDiasSemana();
});

// Actualiza estadísticas del Hero y Cuenta Atrás
function actualizarMetricasIndex() {
    const perfil = KickLabStorage.getPerfil();
    const sesiones = KickLabStorage.getSesiones();
    const torneos = KickLabStorage.getTorneos();

    // Actualizar días para competir
    const countdownTitle = document.querySelector('.cuenta-atras-section .section-title');
    if (countdownTitle) {
        countdownTitle.textContent = `${perfil.diasParaCompetir || 24} días para competir`;
    }

    const countdownSub = document.querySelector('.cuenta-atras-section .section-subtitle');
    if (countdownSub) {
        countdownSub.textContent = `Tu plan de preparación está al ${perfil.progresoPlan || 68}%`;
    }

    // Actualizar valores en tarjeta cuenta atrás
    const countdownValues = document.querySelectorAll('.countdown-value');
    if (countdownValues.length >= 4) {
        countdownValues[0].textContent = perfil.pesoObjetivo || '-0,8 kg';
        countdownValues[1].textContent = perfil.sesionesRestantes || '9';
        countdownValues[2].textContent = perfil.sparringsProgramados || '4';
        countdownValues[3].textContent = perfil.documentosEstado || 'Listos';
    }

    // Actualizar sesiones en stats hero
    const statCards = document.querySelectorAll('.stats-grid .stat-card .stat-value');
    if (statCards.length >= 4) {
        statCards[0].textContent = sesiones.length.toString();
        statCards[3].textContent = (perfil.diasParaCompetir || 24).toString();
    }
}

// Renderiza los torneos con su lista de verificación interactiva
function renderTorneos() {
    const torneos = KickLabStorage.getTorneos();
    const container = document.querySelector('.retos-grid');
    if (!container) return;

    container.innerHTML = '';

    torneos.forEach((t) => {
        const completados = t.checklist.filter(c => c.completado).length;
        const total = t.checklist.length;

        const card = document.createElement('article');
        card.className = 'reto-card';
        card.innerHTML = `
            <div class="reto-main-info">
                <div class="reto-badge-fecha ${t.colorClase || ''}">
                    <span class="badge-dia">${t.dia}</span>
                    <span class="badge-mes">${t.mes}</span>
                </div>
                <div class="reto-detalles">
                    <h3 class="reto-nombre">${t.nombre}</h3>
                    <p class="reto-lugar">${t.lugar}</p>
                    <span class="reto-categoria">${t.categoria}</span>
                </div>
            </div>

            <div class="reto-checklist-header">
                <span>Preparación</span>
                <span class="checklist-count">${completados}/${total}</span>
            </div>

            <ul class="checklist">
                ${t.checklist.map((c, idx) => `
                    <li class="check-item ${c.completado ? 'check-done' : 'check-pending'}" data-torneo-id="${t.id}" data-check-index="${idx}">
                        <span class="check-icon">${c.completado ? '✓' : '◯'}</span>
                        <span class="check-text">${c.texto}</span>
                    </li>
                `).join('')}
            </ul>
        `;

        container.appendChild(card);
    });

    // Delegación de eventos para clicks en los check-items
    container.querySelectorAll('.check-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const torneoId = item.getAttribute('data-torneo-id');
            const checkIndex = parseInt(item.getAttribute('data-check-index'), 10);
            KickLabStorage.toggleTorneoCheck(torneoId, checkIndex);
            renderTorneos();
            mostrarNotificacion('Progreso del torneo actualizado');
        });
    });
}

// Modal para Añadir Nuevo Torneo
function inicializarModalTorneo() {
    const btnAdd = document.querySelector('.retos-header .btn-green-neon');
    const modal = document.getElementById('modal-torneo');
    const btnClose = modal ? modal.querySelector('.btn-close-modal') : null;
    const form = document.getElementById('form-nuevo-torneo');

    if (btnAdd && modal) {
        btnAdd.addEventListener('click', () => {
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
            const nombre = document.getElementById('torneo-nombre').value.trim();
            const lugar = document.getElementById('torneo-lugar').value.trim();
            const categoria = document.getElementById('torneo-categoria').value.trim() || 'Senior - 68 kg';
            const dia = document.getElementById('torneo-dia').value.trim() || '15';
            const mes = document.getElementById('torneo-mes').value.trim().toLowerCase() || 'dic';

            if (!nombre || !lugar) {
                mostrarNotificacion('Por favor completa el nombre y lugar', 'info');
                return;
            }

            const nuevoTorneo = {
                id: 'torneo-' + Date.now(),
                nombre,
                lugar,
                categoria,
                dia,
                mes,
                colorClase: 'badge-fecha-orange',
                checklist: [
                    { id: 'c1', texto: 'Control de peso', completado: false },
                    { id: 'c2', texto: 'Documentación', completado: false },
                    { id: 'c3', texto: 'Protectores', completado: false },
                    { id: 'c4', texto: 'Planificación', completado: false }
                ]
            };

            KickLabStorage.saveTorneo(nuevoTorneo);
            renderTorneos();
            form.reset();
            modal.classList.remove('modal-open');
            mostrarNotificacion('¡Torneo añadido con éxito!');
        });
    }
}

// Formulario de Finalizar Sesión (Chips interactivos, Stepper y Guardado)
function inicializarFormularioSesion() {
    const form = document.querySelector('.finalizar-card');
    if (!form) return;

    // 1. Manejo de Stepper
    const steps = document.querySelectorAll('.pasos-stepper .stepper-item');

    // 2. Selección de chips de Intensidad
    const chipsIntensidad = form.querySelectorAll('.form-col:nth-child(2) .btn-chip');
    chipsIntensidad.forEach(chip => {
        chip.addEventListener('click', () => {
            chipsIntensidad.forEach(c => c.classList.remove('chip-selected'));
            chip.classList.add('chip-selected');
            actualizarPaso(2);
        });
    });

    // 3. Selección de chips de Sensaciones
    const chipsSensacion = form.querySelectorAll('.chips-sensacion .btn-chip');
    chipsSensacion.forEach(chip => {
        chip.addEventListener('click', () => {
            chipsSensacion.forEach(c => c.classList.remove('chip-selected'));
            chip.classList.add('chip-selected');
            actualizarPaso(2);
        });
    });

    // 4. Agregar/Remover Técnicas (tags)
    const tagsContainer = form.querySelector('.tags-container');
    if (tagsContainer) {
        tagsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('tag-item')) {
                e.target.style.opacity = e.target.style.opacity === '0.4' ? '1' : '0.4';
            }
        });
    }

    // 5. Envío del Formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        actualizarPaso(3);

        const duracion = form.querySelector('.input-control').value || '80 minutos';
        const intensidadActiva = form.querySelector('.form-col:nth-child(2) .btn-chip.chip-selected');
        const intensidad = intensidadActiva ? intensidadActiva.textContent.trim() : 'Media';
        
        const sensacionActiva = form.querySelector('.chips-sensacion .btn-chip.chip-selected');
        const sensacion = sensacionActiva ? sensacionActiva.textContent.trim() : 'Equilibrado';

        const textarea = form.querySelector('.textarea-control');
        const observaciones = textarea ? textarea.value.trim() : '';

        // Crear nueva sesión
        const nuevaSesion = {
            id: 'ses-' + Date.now(),
            nombre: 'Sparring técnico',
            tipo: 'Sparring',
            fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) + ', ' + new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            duracion: duracion,
            intensidad: intensidad,
            tecnicas: ['Dollyo chagui', 'Neryo chagui', 'Cut technique'],
            sensacion: sensacion,
            observaciones: observaciones || 'Entrenamiento registrado desde el formulario.',
            estado: 'Completado',
            propietario: KickLabStorage.getPerfil().nombre || 'Andrea'
        };

        KickLabStorage.saveSesion(nuevaSesion);
        actualizarMetricasIndex();
        mostrarNotificacion('¡Sesión guardada con éxito en tu base de datos!');

        setTimeout(() => {
            actualizarPaso(1);
        }, 2000);
    });

    function actualizarPaso(pasoActivo) {
        steps.forEach((s, idx) => {
            if (idx + 1 <= pasoActivo) {
                s.classList.add('step-completed');
            } else {
                s.classList.remove('step-completed');
            }
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
            mostrarNotificacion(`Seleccionado: ${diaNom.toUpperCase()} ${diaNum} • ${diaTipo}`);
        });
    });
}
