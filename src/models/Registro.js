import mongoose from 'mongoose';

// Define un subesquema para los campos específicos de cada tipo de evento
const residenciaSchema = new mongoose.Schema({
    razon_social: { type: String, required: true },
    rfc_cct: { type: String, required: true },
    direccion: { type: String, required: true },
    codigo_postal: { type: String, required: true },
    colonia: { type: String, required: true },
    municipio: { type: String, required: true },
    estado: { type: String, required: true },
    tipo_dependencia: { type: String, required: true, enum: ['Pública', 'Privada', 'Mismo Tecnológico'] },
    grado_academico: { type: String, required: true },
    nombre_persona: { type: String, required: true },
    cargo_puesto: { type: String, required: true },
    nombre_responsable: { type: String, required: true },
    cargo_responsable: { type: String, required: true },
    contacto_responsable: { type: String, required: true },
    email_responsable: { type: String, required: true },
    semestre: { type: String, required: true },
    total_creditos: { type: String, required: true },
    promedio: { type: String, required: true },
    telefono_estudiante: { type: String, required: true },
    email_estudiante: { type: String, required: true },
    direccion_referencia: { type: String, required: true },
    colonia_estudiante: { type: String, required: true },
    municipio_estudiante: { type: String, required: true },
    estado_estudiante: { type: String, required: true },
    fecha_nacimiento: { type: String, required: true },
    nss_imss: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
    lugar: { type: String, default: 'No especificado' },
    tipo_platica: { type: String, default: 'General' }
});

const servicioSchema = new mongoose.Schema({
    promedio: { type: String, required: true },
    creditos: { type: String, required: true },
    entidad_receptora: { type: String, required: true },
    tip: { type: String, required: true, enum: ['Federal', 'Estatal', 'Municipal','O.N.G', 'I.E', 'I.P'] },
    rfc: { type: String, required: true },
    cp: { type: String, required: true },
    municipio: { type: String, required: true },
    localidad: { type: String, required: true },
    titular: { type: String, required: true },
    nombre_responsable: { type: String, required: true },
    telefono: { type: String, required: true },
    correo: { type: String, required: true },
    fechai: { type: String, required: true },
    fechat: { type: String, required: true },
    nombre_programa: { type: String, required: true },
    actividades: { type: String, required: true },
    dependencia: { type: String, required: true },
    area: { type: String, required: true },
    grado_academico: { type: String, required: true },
    cargo: { type: String, required: true },
    tipo_programa: { type: String, required: true },
    aceptado: { type: String, required: true, enum: ['Si', 'No'] },
    observaciones: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
    lugar: { type: String, default: 'No especificado' },
    tipo_platica: { type: String, default: 'General' }
});

const registroSchema = new mongoose.Schema({
    nombre: { type: String, required: true, minlength: 3, maxlength: 20, match: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/ },
    am: { type: String, required: true, minlength: 3, maxlength: 20, match: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/ },
    ap: { type: String, required: true, minlength: 3, maxlength: 20, match: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/ },
    matricula: { type: String, required: true, unique: true, minlength: 10, maxlength: 10, match: /^[0-9]+$/ },
    g: { type: String, required: true, minlength: 3, maxlength: 3, match: /^[0-9]+$/ },
    carrera: { type: String, required: true, enum: ['Ingeniería informática', 'Ingeniería civil', 'Ingeniería química', 'Ingeniería en industrias alimentarias', 'Contador público', 'Ingeniería en energías renovables'] },
    evento: { type: String, required: true, enum: ['Servicio social', 'Residencia profesional'] },
    fechaRegistro: { type: Date, default: Date.now },
    asistio: { type: Boolean, default: false },
    eventoData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
});

const Registro = mongoose.model('Registro', registroSchema);

export default Registro;
