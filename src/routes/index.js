import { Router } from 'express';
import Registro from '../models/Registro.js';
import QRCode from 'qrcode';

const router = Router();

router.post('/registro', async (req, res) => {
    try {
        const { nombre, matricula, carrera, evento } = req.body;
        const registroExistente = await Registro.findOne({ matricula });

        if (registroExistente) {
            return res.render('contacto', { errorMessage: 'Ya existe un registro con esta matrícula.', nombre, matricula, carrera, evento, errores: {} });
        }

        const errores = {};
        if (!nombre || nombre.length < 10 || nombre.length > 20 || !/^[a-zA-Z\s]+$/.test(nombre)) {
            errores.nombre = 'El nombre debe tener entre 10 y 20 caracteres y solo puede contener letras y espacios.';
        }
        if (!matricula || matricula.length !== 10) {
            errores.matricula = 'La matrícula debe tener exactamente 10 caracteres.';
        }
        if (!['Ingeniería informática', 'Ingeniería civil', 'Ingeniería química', 'Ingeniería en industrias alimentarias', 'Contador público', 'Ingeniería en energías renovables'].includes(carrera)) {
            errores.carrera = 'Debes seleccionar una carrera válida.';
        }
        if (!['Servicio social', 'Residencia profesional'].includes(evento)) {
            errores.evento = 'Debes seleccionar un evento válido.';
        }

        if (Object.keys(errores).length > 0) {
            return res.render('contacto', { errorMessage: '', nombre, matricula, carrera, evento, errores });
        }

        const nuevoRegistro = new Registro({ nombre, matricula, carrera, evento, asistio: false }); // Establece asistio a false inicialmente
        await nuevoRegistro.save();

        res.render('login', { successMessage: '¡El registro se ha guardado exitosamente!' });

    } catch (error) {
        console.error('Error al guardar el registro:', error);
        res.status(500).send('Ocurrió un error al procesar tu solicitud');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { nombre, matricula } = req.body;

        if (nombre === 'Administrador' && matricula === '1234567890') {
            req.session.usuario = { nombre, matricula, rol: 'admin' };
            return res.redirect('/admin');
        }

        const usuario = await Registro.findOne({ nombre, matricula });

        if (usuario) {
            req.session.usuario = usuario; // Establecer el objeto de usuario en la sesión
            if (usuario.evento === 'Residencia profesional') {
                return res.render('residencia', { mensaje: '¡Inicio de sesión exitoso! Bienvenido, ' + usuario.nombre });
            } else if (usuario.evento === 'Servicio social') {
                return res.render('servicio', { mensaje: '¡Inicio de sesión exitoso! Bienvenido, ' + usuario.nombre });
            } else {
                return res.render('error', { mensaje: 'No tienes acceso a esta área.' });
            }
        } else {
            return res.render('error', { mensaje: 'Credenciales incorrectas' });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Ocurrió un error al procesar tu solicitud');
    }
});

router.get('/admin', async (req, res) => {
    try {
        if (req.session.usuario && req.session.usuario.rol === 'admin') {
            const registros = await Registro.find();
            return res.render('adminHome', { mensaje: 'Bienvenido, Administrador', registros });
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error al recuperar los registros:', error);
        res.status(500).send('Ocurrió un error al procesar tu solicitud');
    }
});

router.get('/usuarioActual', (req, res) => {
    const usuario = req.session.usuario;
    console.log('Usuario actual:', usuario); // Agrega este console.log para verificar el usuario actual
    res.json(usuario);
});


router.post('/generarQR', async (req, res) => {
    try {
        const usuario = req.session.usuario;
        console.log('Usuario:', usuario);

        if (!usuario) {
            throw new Error('El usuario no está definido');
        }

        const accionQR = {
            tipo: 'enlace',
            valor: `http://192.168.137.1:3000/formulario?nombre=${encodeURIComponent(usuario.nombre)}&matricula=${encodeURIComponent(usuario.matricula)}&carrera=${encodeURIComponent(usuario.carrera)}&evento=${encodeURIComponent(usuario.evento)}&asistio=${encodeURIComponent(usuario.asistio)}`
        };
        
        console.log('Enlace generado:', accionQR.valor);

        const codigoQRData = { accion: accionQR };
        const textoQR = JSON.stringify(codigoQRData);
        const codigoQR = await QRCode.toDataURL(textoQR);

        console.log('Código QR generado para el usuario:', usuario.nombre);

        res.send({ codigoQR });
    } catch (error) {
        console.error('Error al generar el código QR:', error);
        res.status(500).send('Ocurrió un error al generar el código QR');
    }
});

// Endpoint para actualizar la asistencia
router.post('/actualizarAsistencia', async (req, res) => {
    try {
        const { matricula, asistio } = req.body;

        console.log('Datos recibidos para actualizar la asistencia:', { matricula, asistio });

        // Actualiza la asistencia en la base de datos utilizando el método findOneAndUpdate
        const updatedUser = await Registro.findOneAndUpdate({ matricula }, { asistio }, { new: true });

        if (!updatedUser) {
            console.log('Usuario no encontrado');
            throw new Error('Usuario no encontrado');
        }

        console.log('Asistencia actualizada en la base de datos para el usuario:', updatedUser.nombre);

        res.sendStatus(200); // Respondemos con un estado de éxito
    } catch (error) {
        console.error('Error al actualizar la asistencia:', error);
        res.status(500).send('Ocurrió un error al actualizar la asistencia');
    }
});



router.get('/formulario', (req, res) => {
    res.render('formulario');
});




router.post('/logout', (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        res.status(500).send('Ocurrió un error al procesar tu solicitud');
    }
});

router.get('/', (req, res) => {
    res.render('login');
});

router.get('/login', (req, res) => {
    res.render('index');
});

router.get('/servicio', (req, res) => {
    res.render('servicio');
});

router.get('/residencia', (req, res) => {
    res.render('residencia');
});

router.get('/home', (req, res) => {
    res.render('home');
});

router.get('/contacto', (req, res) => {
    res.render('contacto', { errorMessage: '', nombre: '', matricula: '', carrera: '', evento: '', errores: {} });
});

export default router;
