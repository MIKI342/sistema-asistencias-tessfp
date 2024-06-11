import { config } from 'dotenv'

config()

console.log(process.env.MONGODB);


// config.js
const informacionPredeterminada = {
    fecha: null,
    lugar: null
};

export default informacionPredeterminada;

