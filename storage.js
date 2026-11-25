/**
 * KickLab - storage.js
 * Módulo centralizado para el almacenamiento y sincronización de datos con localStorage.
 */

const STORAGE_KEYS = {
    PERFIL: 'kicklab_perfil',
    SESIONES: 'kicklab_sesiones',
    TORNEOS: 'kicklab_torneos',
    RUTINAS: 'kicklab_rutinas',
    CALENDARIO: 'kicklab_calendario'
};

// Datos iniciales por defecto (idénticos a los diseños de Figma)
const DEFAULT_DATA = {
    perfil: {
        nombre: 'Andrea',
        club: 'Club Dragones Taekwondo',
        grado: '1dan',
        gradoTexto: '1° Dan (Cinturón Negro)',
        categoria: 'Senior -68 kg',
        diasParaCompetir: 24,
        progresoPlan: 68,
        pesoObjetivo: '-0,8 kg',
        sesionesRestantes: 9,
        sparringsProgramados: 4,
        documentosEstado: 'Listos'
    },
    torneos: [
        {
            id: 'torneo-1',
            nombre: 'Open Nacional de Taekwondo',
            lugar: 'Pabellón de Gimnasia • Cbba, Bol',
            categoria: 'Senior - 68 kg',
            dia: '28',
            mes: 'nov',
            colorClase: '',
            checklist: [
                { id: 'c1', texto: 'Control de peso', completado: true },
                { id: 'c2', texto: 'Documentación', completado: true },
                { id: 'c3', texto: 'Protectores', completado: false },
                { id: 'c4', texto: 'Planificación', completado: false }
            ]
        },
        {
            id: 'torneo-2',
            nombre: 'Copa Regional Centro',
            lugar: 'Pabellón Municipal • Toluca',
            categoria: 'Senior - 68 kg',
            dia: '28',
            mes: 'dic',
            colorClase: 'badge-fecha-orange',
            checklist: [
                { id: 'c1', texto: 'Control de peso', completado: true },
                { id: 'c2', texto: 'Documentación', completado: false },
                { id: 'c3', texto: 'Protectores', completado: false },
                { id: 'c4', texto: 'Planificación', completado: false }
            ]
        }
    ],
    sesiones: [
        {
            id: 'ses-1',
            nombre: 'Sparring técnico',
            tipo: 'Sparring',
            fecha: '16 abr, 18:00',
            duracion: '80 min',
            intensidad: 'Alta',
            tecnicas: ['Dollyo chagui', 'Neryo chagui', 'Cut technique'],
            sensacion: 'Con energía',
            observaciones: 'Buen desempeño, mayor distancia con pie delantero.',
            estado: 'Completado',
            propietario: 'Andrea'
        },
        {
            id: 'ses-2',
            nombre: 'Técnica de piernas',
            tipo: 'Técnica',
            fecha: '14 abr, 18:00',
            duracion: '60 min',
            intensidad: 'Medio',
            tecnicas: ['Miro chagui', 'Dollyo chagui'],
            sensacion: 'Equilibrado',
            observaciones: 'Excelente velocidad de pateo.',
            estado: 'Completado',
            propietario: 'Andrea'
        },
        {
            id: 'ses-3',
            nombre: 'Fuerza explosiva',
            tipo: 'Fuerza',
            fecha: '15 abr, 17:30',
            duracion: '45 min',
            intensidad: 'Alta',
            tecnicas: ['Pliometría', 'Sentadillas con salto'],
            sensacion: 'Muy cansado',
            observaciones: 'Carga muscular óptima.',
            estado: 'Completado',
            propietario: 'Andrea'
        },
        {
            id: 'ses-4',
            nombre: 'Poomsae • Koryo',
            tipo: 'Poomsae',
            fecha: '17 abr, 18:30',
            duracion: '50 min',
            intensidad: 'Medio',
            tecnicas: ['Koryo', 'Ap chagui balance'],
            sensacion: 'Equilibrado',
            observaciones: 'Firmeza en las posiciones ap koobi.',
            estado: 'Planificado',
            propietario: 'Andrea'
        },
        {
            id: 'ses-5',
            nombre: 'Resistencia específica',
            tipo: 'Resistencia',
            fecha: '18 abr, 17:00',
            duracion: '40 min',
            intensidad: 'Alta',
            tecnicas: ['Sparring intermitente', 'Sombra continua'],
            sensacion: 'Con energía',
            observaciones: 'Series de 2 minutos completadas.',
            estado: 'Planificado',
            propietario: 'Andrea'
        }
    ],
    calendario: [
        { id: 'cal-1', dia: 'mar', hora: '17:00', titulo: 'Fuerza explosiva', detalle: '17:00 • 45 min', clase: 'event-purple' },
        { id: 'cal-2', dia: 'vie', hora: '17:00', titulo: 'Resistencia', detalle: '17:00 • 40 min', clase: 'event-cyan' },
        { id: 'cal-3', dia: 'lun', hora: '18:00', titulo: 'Técnica de piernas', detalle: '18:00 • 60 min', clase: 'event-green' },
        { id: 'cal-4', dia: 'mie', hora: '18:00', titulo: 'Sparring táctico', detalle: '18:00 • 90 min', clase: 'event-orange' },
        { id: 'cal-5', dia: 'jue', hora: '18:00', titulo: 'Poomsae • Koryo', detalle: '18:00 • 50 min', clase: 'event-amber' },
        { id: 'cal-6', dia: 'sab', hora: '12:00', titulo: 'Sparring libre', detalle: '12:00 • 75 min', clase: 'event-rose' }
    ],
    rutinas: [
        { id: 'rut-1', categoria: 'Técnica', pillClase: 'pill-cyan', titulo: 'Piernas explosivas', meta: '45 min • Intermedio', fases: ['Calentamiento específico', 'Bloque técnico principal', 'Vuelta a la calma'] },
        { id: 'rut-2', categoria: 'Sparring', pillClase: 'pill-orange', titulo: 'Sparring: distancia', meta: '60 min • Intermedio', fases: ['Calentamiento específico', 'Bloque táctico principal', 'Vuelta a la calma'] },
        { id: 'rut-3', categoria: 'Flexibilidad', pillClase: 'pill-purple-light', titulo: 'Movilidad de cadera', meta: '25 min • Avanzado', fases: ['Calentamiento dinámico', 'Bloque técnico principal', 'Vuelta a la calma'] },
        { id: 'rut-4', categoria: 'Poomsae', pillClase: 'pill-yellow', titulo: 'Koryo técnico', meta: '50 min • Intermedio', fases: ['Calentamiento específico', 'Bloque técnico principal', 'Vuelta a la calma'] },
        { id: 'rut-5', categoria: 'Fuerza', pillClase: 'pill-purple', titulo: 'Fuerza específica', meta: '40 min • Intermedio', fases: ['Calentamiento específico', 'Bloque de fuerza explosiva', 'Vuelta a la calma'] },
        { id: 'rut-6', categoria: 'Resistencia', pillClase: 'pill-cyan', titulo: 'Cardio de combate', meta: '35 min • Avanzado', fases: ['Calentamiento progresivo', 'Bloque HIIT de combate', 'Vuelta a la calma'] }
    ]
};

// API del Storage
const KickLabStorage = {
    init() {
        if (!localStorage.getItem(STORAGE_KEYS.PERFIL)) {
            localStorage.setItem(STORAGE_KEYS.PERFIL, JSON.stringify(DEFAULT_DATA.perfil));
        }
        if (!localStorage.getItem(STORAGE_KEYS.TORNEOS)) {
            localStorage.setItem(STORAGE_KEYS.TORNEOS, JSON.stringify(DEFAULT_DATA.torneos));
        }
        if (!localStorage.getItem(STORAGE_KEYS.SESIONES)) {
            localStorage.setItem(STORAGE_KEYS.SESIONES, JSON.stringify(DEFAULT_DATA.sesiones));
        }
        if (!localStorage.getItem(STORAGE_KEYS.CALENDARIO)) {
            localStorage.setItem(STORAGE_KEYS.CALENDARIO, JSON.stringify(DEFAULT_DATA.calendario));
        }
        if (!localStorage.getItem(STORAGE_KEYS.RUTINAS)) {
            localStorage.setItem(STORAGE_KEYS.RUTINAS, JSON.stringify(DEFAULT_DATA.rutinas));
        }
    },

    getPerfil() {
        this.init();
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.PERFIL));
    },

    savePerfil(perfilData) {
        const actual = this.getPerfil();
        const updated = { ...actual, ...perfilData };
        localStorage.setItem(STORAGE_KEYS.PERFIL, JSON.stringify(updated));
        return updated;
    },

    getTorneos() {
        this.init();
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.TORNEOS));
    },

    saveTorneo(torneo) {
        const torneos = this.getTorneos();
        torneos.push(torneo);
        localStorage.setItem(STORAGE_KEYS.TORNEOS, JSON.stringify(torneos));
        return torneos;
    },

    toggleTorneoCheck(torneoId, checkIndex) {
        const torneos = this.getTorneos();
        const t = torneos.find(item => item.id === torneoId);
        if (t && t.checklist && t.checklist[checkIndex] !== undefined) {
            t.checklist[checkIndex].completado = !t.checklist[checkIndex].completado;
            localStorage.setItem(STORAGE_KEYS.TORNEOS, JSON.stringify(torneos));
        }
        return torneos;
    },

    getSesiones() {
        this.init();
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.SESIONES));
    },

    saveSesion(sesion) {
        const sesiones = this.getSesiones();
        sesiones.unshift(sesion); // Añadir al inicio
        localStorage.setItem(STORAGE_KEYS.SESIONES, JSON.stringify(sesiones));
        return sesiones;
    },

    getCalendario() {
        this.init();
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CALENDARIO));
    },

    saveCalendarioEvento(evento) {
        const cal = this.getCalendario();
        cal.push(evento);
        localStorage.setItem(STORAGE_KEYS.CALENDARIO, JSON.stringify(cal));
        return cal;
    },

    getRutinas() {
        this.init();
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.RUTINAS));
    },

    saveRutina(rutina) {
        const rutinas = this.getRutinas();
        rutinas.unshift(rutina);
        localStorage.setItem(STORAGE_KEYS.RUTINAS, JSON.stringify(rutinas));
        return rutinas;
    }
};

// Notificación Flotante (Toast)
function mostrarNotificacion(mensaje, tipo = 'success') {
    let container = document.getElementById('kicklab-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'kicklab-toast-container';
        container.className = 'kicklab-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `kicklab-toast kicklab-toast-${tipo}`;
    toast.innerHTML = `
        <span class="toast-icon">${tipo === 'success' ? '✓' : 'ℹ'}</span>
        <span class="toast-text">${mensaje}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
