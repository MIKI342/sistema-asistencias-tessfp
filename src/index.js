import './config.js'

import express from 'express'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import indexRoutes from './routes/index.js'
import mongoose from 'mongoose';

import bodyParser from 'body-parser';


import session from 'express-session';


import { MONGODB_URI } from './config.js'




mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conexión a la base de datos establecida'))
.catch(err => console.error('Error al conectar a la base de datos:', err));

const app = express()

app.use(bodyParser.json());

app.use(session({
    secret: 'tu_secreto_aqui', // Cambia esto por una cadena secreta única
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));

const __dirname = dirname(fileURLToPath(import.meta.url))

app.set('views', join(__dirname, 'views' ))
app.set('view engine', 'ejs')

app.use(indexRoutes)



app.use(express.static(join(__dirname, 'public')))

app.listen(3000, () => {
    console.log('Escuchando en el puerto 3000');
});
