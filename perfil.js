/**
 * KickLab - perfil.js
 * Lógica interactiva para la página de Perfil (perfil.html):
 * - Carga de datos deportivos desde localStorage en los campos
 * - Formulario para editar y guardar datos deportivos
 * - Sincronización automática de días para competir y progreso de preparación
 * - Modales interactivos para preferencias (Recordatorios, Visibilidad, Seguridad)
 */

document.addEventListener('DOMContentLoaded', () => {
    cargarDatosPerfil();
    inicializarFormularioPerfil();
    inicializarModalesPreferencias();
    inicializarDiasSemana();
});

// Carga los datos guardados en los inputs y en la tarjeta de próximo reto
function cargarDatosPerfil() {
    const perfil = KickLabStorage.getPerfil();
    const torneos = KickLabStorage.getTorneos();

    // Inputs del formulario
    const inputNombre = document.querySelector('input[value="Andrea"]') || document.querySelector('.datos-deportivos-card input:nth-of-type(1)');
    const inputClub = document.querySelector('.datos-deportivos-card input[placeholder*="club"]');
    const selectGrado = document.querySelector('.datos-deportivos-card select');
    const inputCategoria = document.querySelector('.datos-deportivos-card input[value*="Senior"]');

    if (inputNombre) inputNombre.value = perfil.nombre || 'Andrea';
    if (inputClub) inputClub.value = perfil.club || '';
    if (selectGrado) selectGrado.value = perfil.grado || '1dan';
    if (inputCategoria) inputCategoria.value = perfil.categoria || 'Senior -68 kg';

    // Próximo reto
    const primerTorneo = torneos[0];
    if (primerTorneo) {
        const tituloReto = document.querySelector('.reto-nombre-destacado');
        const fechaReto = document.querySelector('.reto-fecha-lugar');
        if (tituloReto) tituloReto.textContent = primerTorneo.nombre;
        if (fechaReto) fechaReto.textContent = `${primerTorneo.dia} ${primerTorneo.mes} • ${primerTorneo.lugar}`;
    }

    const countdownText = document.querySelector('.countdown-highlight');
    if (countdownText) {
        countdownText.textContent = `${perfil.diasParaCompetir || 24} días para competir`;
    }

    const progressPercent = document.querySelector('.progress-percent');
    const progressBarFill = document.querySelector('.progress-bar-fill');
    if (progressPercent) progressPercent.textContent = `${perfil.progresoPlan || 68}%`;
    if (progressBarFill) progressBarFill.style.width = `${perfil.progresoPlan || 68}%`;
}

// Guardar datos deportivos en localStorage
function inicializarFormularioPerfil() {
    const form = document.querySelector('.datos-deportivos-card');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputs = form.querySelectorAll('.input-control');
        const nombre = inputs[0] ? inputs[0].value.trim() : 'Andrea';
        const club = inputs[1] ? inputs[1].value.trim() : '';
        const select = form.querySelector('select');
        const grado = select ? select.value : '1dan';
        const gradoTexto = select && select.options[select.selectedIndex] ? select.options[select.selectedIndex].text : '';
        const categoria = inputs[3] ? inputs[3].value.trim() : 'Senior -68 kg';

        const updated = KickLabStorage.savePerfil({
            nombre,
            club,
            grado,
            gradoTexto,
            categoria
        });

        mostrarNotificacion('¡Datos deportivos actualizados correctamente!');
    });
}

// Modales interactivos para preferencias
function inicializarModalesPreferencias() {
    const botonesAccion = document.querySelectorAll('.preferencia-item .btn-outline-blue');
    
    // 1. Recordatorios
    if (botonesAccion[0]) {
        botonesAccion[0].addEventListener('click', () => {
            const modal = document.getElementById('modal-recordatorios');
            if (modal) modal.classList.add('modal-open');
        });
    }

    // 2. Visibilidad
    if (botonesAccion[1]) {
        botonesAccion[1].addEventListener('click', () => {
            const modal = document.getElementById('modal-visibilidad');
            if (modal) modal.classList.add('modal-open');
        });
    }

    // 3. Seguridad
    if (botonesAccion[2]) {
        botonesAccion[2].addEventListener('click', () => {
            const modal = document.getElementById('modal-seguridad');
            if (modal) modal.classList.add('modal-open');
        });
    }

    // Cerrar cualquier modal
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        const btnClose = modal.querySelector('.btn-close-modal');
        if (btnClose) {
            btnClose.addEventListener('click', () => modal.classList.remove('modal-open'));
        }
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('modal-open');
        });

        const form = modal.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                modal.classList.remove('modal-open');
                mostrarNotificacion('¡Preferencias guardadas con éxito!');
            });
        }
    });
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
