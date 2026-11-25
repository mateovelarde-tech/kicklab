/**
 * KickLab - avances.js
 * Lógica interactiva para la página de Control de Avances (avances.html):
 * - Renderizado en tiempo real del conteo de registros en las tarjetas de Base de Datos
 * - Renderizado dinámico de la tabla de colección de sesiones desde localStorage
 * - Filtro o búsqueda rápida en la tabla
 * - Sincronización visual con efecto de actualización
 */

document.addEventListener('DOMContentLoaded', () => {
    actualizarConteoModelos();
    renderTablaSesiones();
    inicializarBotonSincronizado();
    inicializarDiasSemana();
});

// Actualiza los números en las tarjetas de la base de datos
function actualizarConteoModelos() {
    const sesiones = KickLabStorage.getSesiones();
    const rutinas = KickLabStorage.getRutinas();
    const torneos = KickLabStorage.getTorneos();

    const dbCards = document.querySelectorAll('.db-tables-grid .db-card .db-count');
    if (dbCards.length >= 4) {
        dbCards[0].textContent = '1 registros'; // Usuario
        dbCards[1].textContent = `${sesiones.length} registros`; // Sesiones
        dbCards[2].textContent = `${rutinas.length} registros`; // Rutinas
        dbCards[3].textContent = `${torneos.length} registros`; // Torneos
    }

    // Actualizar métricas del hero
    const statCards = document.querySelectorAll('.stats-grid .stat-card .stat-value');
    if (statCards.length >= 4) {
        statCards[0].textContent = sesiones.length.toString();
        const perfil = KickLabStorage.getPerfil();
        statCards[3].textContent = (perfil.diasParaCompetir || 24).toString();
    }
}

// Renderiza la tabla completa de sesiones registradas
function renderTablaSesiones() {
    const sesiones = KickLabStorage.getSesiones();
    const tbody = document.querySelector('.data-table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    sesiones.forEach(s => {
        const tr = document.createElement('tr');
        const statusClass = s.estado === 'Completado' ? 'status-completado' : 'status-planificado';

        tr.innerHTML = `
            <td class="td-nombre">${s.nombre}</td>
            <td>${s.tipo}</td>
            <td>${s.fecha}</td>
            <td>${s.duracion}</td>
            <td><span class="status-pill ${statusClass}">${s.estado}</span></td>
            <td class="td-propietario">${s.propietario || 'Andrea'}</td>
        `;

        // Click en fila para ver detalle de la sesión
        tr.style.cursor = 'pointer';
        tr.title = 'Haz clic para ver detalles de la sesión';
        tr.addEventListener('click', () => {
            mostrarDetalleSesionModal(s);
        });

        tbody.appendChild(tr);
    });
}

// Muestra modal con detalles completos de la sesión al hacer click en la fila
function mostrarDetalleSesionModal(sesion) {
    let modal = document.getElementById('modal-detalle-sesion');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-detalle-sesion';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title" id="modal-detalle-titulo">Detalles de la sesión</h3>
                    <button type="button" class="btn-close-modal">&times;</button>
                </div>
                <div class="modal-body" id="modal-detalle-body"></div>
                <div class="modal-footer">
                    <button type="button" class="btn-green-neon" id="modal-detalle-cerrar">Entendido</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.btn-close-modal').addEventListener('click', () => modal.classList.remove('modal-open'));
        modal.querySelector('#modal-detalle-cerrar').addEventListener('click', () => modal.classList.remove('modal-open'));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('modal-open');
        });
    }

    const body = modal.querySelector('#modal-detalle-body');
    body.innerHTML = `
        <div style="margin-bottom: 14px;">
            <span class="section-tag">${sesion.tipo.toUpperCase()}</span>
            <h2 style="font-size: 20px; color: #FFF; margin: 4px 0;">${sesion.nombre}</h2>
            <p style="font-size: 12px; color: #828A9E;">${sesion.fecha} • Duración: ${sesion.duracion}</p>
        </div>
        <div style="background-color: #070F1E; border-radius: 8px; padding: 16px; margin-bottom: 16px; font-size: 13px;">
            <p style="margin-bottom: 8px;"><strong>Intensidad:</strong> <span style="color: #3EE58F;">${sesion.intensidad || 'Media'}</span></p>
            <p style="margin-bottom: 8px;"><strong>Sensación:</strong> <span style="color: #9385FF;">${sesion.sensacion || 'Equilibrado'}</span></p>
            <p style="margin-bottom: 8px;"><strong>Técnicas:</strong> ${Array.isArray(sesion.tecnicas) ? sesion.tecnicas.join(', ') : 'Dollyo chagui, Neryo chagui'}</p>
            <p><strong>Observaciones:</strong> <span style="color: #E0E2EC;">${sesion.observaciones || 'Sin notas adicionales.'}</span></p>
        </div>
    `;

    modal.classList.add('modal-open');
}

// Botón de sincronización con efecto visual
function inicializarBotonSincronizado() {
    const badge = document.querySelector('.badge-sincronizado');
    if (badge) {
        badge.style.cursor = 'pointer';
        badge.title = 'Haz clic para forzar sincronización de registros';
        badge.addEventListener('click', () => {
            badge.textContent = 'SINCRONIZANDO...';
            badge.style.opacity = '0.6';
            setTimeout(() => {
                actualizarConteoModelos();
                renderTablaSesiones();
                badge.textContent = 'SINCRONIZADO';
                badge.style.opacity = '1';
                mostrarNotificacion('✓ Base de datos sincronizada y al día.');
            }, 600);
        });
    }
}

// Slider de días
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
