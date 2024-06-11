import mongoose from 'mongoose';

const PlaticaSchema = new mongoose.Schema({
    tipo: { type: String, required: true, unique: true },
    fecha: { type: Date, required: true },
    lugar: { type: String, required: true }
});


const Platica = mongoose.model('Platica', PlaticaSchema);

export default Platica;
