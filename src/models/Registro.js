import mongoose from 'mongoose';

const registroSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 20,
        match: /^[a-zA-Z\s]+$/
    },
    matricula: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 10
    },
    carrera: {
        type: String,
        required: true,
        enum: [
            'Ingeniería informática',
            'Ingeniería civil',
            'Ingeniería química',
            'Ingeniería en industrias alimentarias',
            'Contador público',
            'Ingeniería en energías renovables'
        ]
    },
    evento: {
        type: String,
        required: true,
        enum: ['Servicio social', 'Residencia profesional']
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    },
    asistio: {
        type: Boolean,
        default: false
    }
});


const Registro = mongoose.model('Registro', registroSchema);

export default Registro;
