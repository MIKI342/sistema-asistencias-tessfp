import express from 'express';
import Registro from '../models/Registro.js';
import QRCode from 'qrcode';

const router = express.Router();
// index.js
import Platica from '../models/Platica.js';

router.post('/admin/update', async (req, res) => {
    try {
        const { tipoPlatica, fecha, lugar } = req.body;

        // Actualiza la información de la plática existente o crea una nueva
        const updatedPlatica = await Platica.findOneAndUpdate(
            { tipo: tipoPlatica },
            { fecha, lugar },
            { new: true, upsert: true } // 'upsert: true' crea una nueva entrada si no existe
        );

        res.redirect('/admin'); // Redirige a la página de administrador después de la actualización
    } catch (error) {
        console.error('Error al actualizar la plática:', error);
        res.status(500).send('Ocurrió un error al procesar tu solicitud');
    }
});
router.post('/procesar-formulario-residencia', async (req, res) => {
    try {
        const {
            nombre,
            matricula,
            carrera,
            evento = "Residencia profesional",
            am,
            ap,
            g,
            razon_social,
            rfc_cct,
            direccion,
            codigo_postal,
            colonia,
            municipio,
            estado,
            tipo_dependencia,
            grado_academico,
            nombre_persona,
            cargo_puesto,
            nombre_responsable,
            cargo_responsable,
            contacto_responsable,
            email_responsable,
            semestre,
            grupo,
            total_creditos,
            promedio,
            telefono_estudiante,
            email_estudiante,
            direccion_referencia,
            colonia_estudiante,
            municipio_estudiante,
            estado_estudiante,
            fecha_nacimiento,
            nss_imss
        } = req.body;

        const platica = await Platica.findOne({ tipo: 'Residencia profesional' });

        if (!platica) {
            return res.status(500).send('No se ha encontrado información de la plática.');
        }

        const { fecha, lugar } = platica;

        const registroExistente = await Registro.findOne({ matricula });

        if (registroExistente) {
            return res.render('contacto', { errorMessage: 'Ya existe un registro con esta matrícula.', nombre, matricula, carrera, evento, am, ap, g, errores: {} });
        }

        const errores = {};
        // Añade validaciones si es necesario

        if (Object.keys(errores).length > 0) {
            return res.render('contacto', { errorMessage: '', nombre, matricula, carrera, evento, am, ap, g, errores });
        }

        const nuevoRegistro = new Registro({
            nombre,
            matricula,
            carrera,
            evento,
            am,
            ap,
            g,
            asistio: false,
            eventoData: {
                residencia: {
                    razon_social,
                    rfc_cct,
                    direccion,
                    codigo_postal,
                    colonia,
                    municipio,
                    estado,
                    tipo_dependencia,
                    grado_academico,
                    nombre_persona,
                    cargo_puesto,
                    nombre_responsable,
                    cargo_responsable,
                    contacto_responsable,
                    email_responsable,
                    semestre,
                    grupo,
                    total_creditos,
                    promedio,
                    telefono_estudiante,
                    email_estudiante,
                    direccion_referencia,
                    colonia_estudiante,
                    municipio_estudiante,
                    estado_estudiante,
                    fecha_nacimiento,
                    nss_imss,
                    fecha,
                    lugar
                }
            }
        });

        await nuevoRegistro.save();

        const qrCode = await generarQR(nuevoRegistro);

        return res.render('mostrarQR', {
            successMessage: '¡El registro se ha guardado exitosamente!',
            qrCode,
            fecha: nuevoRegistro.eventoData.residencia.fecha,
            lugar: nuevoRegistro.eventoData.residencia.lugar,
            tipo_platica: 'Residencia profesional'
        });
    } catch (error) {
        console.error('Error al guardar el registro:', error);
        res.status(500).send('Ocurrió un error al procesar tu solicitud');
    }
});


// Función auxiliar para generar el QR
// Función auxiliar para generar el QR
async function generarQR(usuario) {
    try {
        const accionQR = {
            tipo: 'enlace',
            valor: `http://192.168.137.1:3000/formulario?nombre=${encodeURIComponent(usuario.nombre)}&matricula=${encodeURIComponent(usuario.matricula)}&carrera=${encodeURIComponent(usuario.carrera)}&evento=${encodeURIComponent(usuario.evento)}&am=${encodeURIComponent(usuario.am)}&ap=${encodeURIComponent(usuario.ap)}&grupo=${encodeURIComponent(usuario.g)}&asistio=${encodeURIComponent(usuario.asistio)}`
        };

        const codigoQRData = { accion: accionQR };
        const textoQR = JSON.stringify(codigoQRData);
        const codigoQR = await QRCode.toDataURL(textoQR);

        return codigoQR;
    } catch (error) {
        console.error('Error al generar el código QR:', error);
        throw new Error('Ocurrió un error al generar el código QR');
    }
}



router.post('/procesar-formulario-servicio', async (req, res) => {
    try {
        const {
            nombre,
            matricula,
            carrera,
            evento = "Servicio social",
            am,
            ap,
            g,
            promedio,
            creditos,
            entidad_receptora,
            tip,
            rfc,
            cp,
            municipio,
            localidad,
            titular,
            nombre_responsable,
            telefono,
            correo,
            fechai,
            fechat,
            nombre_programa,
            actividades,
            dependencia,
            area,
            grado_academico,
            cargo,
            tipo_programa,
            aceptado,
            observaciones


        } = req.body;

        const platica = await Platica.findOne({ tipo: 'Servicio social' });
        console.log('Plática encontrada:', platica);

        if (!platica) {
            return res.status(500).send('No se ha encontrado información de la plática.');
        }

        const { fecha, lugar } = platica;
        console.log(`Fecha de la plática: ${fecha}, Lugar de la plática: ${lugar}`);

        const registroExistente = await Registro.findOne({ matricula });
        if (registroExistente) {
            return res.render('contacto', { errorMessage: 'Ya existe un registro con esta matrícula.', nombre, matricula, carrera, evento, am, ap, g, errores: {} });
        }

        const nuevoRegistro = new Registro({
            nombre,
            matricula,
            carrera,
            evento,
            am,
            ap,
            g,
            asistio: false,
            eventoData: {
                servicio: {
                    promedio,
                    creditos,
                    entidad_receptora,
                    tip,
                    rfc,
                    cp,
                    municipio,
                    localidad,
                    titular,
                    nombre_responsable,
                    telefono,
                    correo,
                    fechai,
                    fechat,
                    nombre_programa,
                    actividades,
                    dependencia,
                    area,
                    grado_academico,
                    cargo,
                    tipo_programa,
                    aceptado,
                    observaciones,
        
                    fecha: platica.fecha,
                    lugar: platica.lugar  // Asignar el lugar de la plática
                }
            }
        });
        

        console.log('Nuevo registro a guardar:', nuevoRegistro);

        await nuevoRegistro.save();

        const qrCode = await generarQR(nuevoRegistro);

        return res.render('mostrarQR', {
            successMessage: '¡El registro se ha guardado exitosamente!',
            qrCode,
            fecha: nuevoRegistro.eventoData.servicio.fecha,
            lugar: nuevoRegistro.eventoData.servicio.lugar,
            tipo_platica: 'Servicio social'
        });
    } catch (error) {
        console.error('Error al guardar el registro:', error);
        res.status(500).send('Ocurrió un error al procesar tu solicitud');
    }
});




// Función auxiliar para generar el QR
// Función auxiliar para generar el QR



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
            valor: `http://192.168.137.1:3000/formulario?nombre=${encodeURIComponent(usuario.nombre)}&matricula=${encodeURIComponent(usuario.matricula)}&carrera=${encodeURIComponent(usuario.carrera)}&evento=${encodeURIComponent(usuario.evento)}&am=${encodeURIComponent(usuario.am)}&ap=${encodeURIComponent(usuario.ap)}&grupo=${encodeURIComponent(usuario.grupo)}&asistio=${encodeURIComponent(usuario.asistio)}`
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

router.post('/actualizarAsistencia', async (req, res) => {
    try {
        const { matricula, asistio } = req.body;

        console.log('Datos recibidos para actualizar la asistencia:', { matricula, asistio });

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


router.get('/formulario-servicio', (req, res) => {
    res.render('formulario-servicio');
});

router.get('/formulario-residencia', (req, res) => {
    res.render('formulario-residencia');
});


router.get('/ver_alumnos_residencia', async (req, res) => {
    try {
        // Realiza la consulta a la base de datos para obtener todos los registros de residencia profesional
        const alumnosResidencia = await Registro.find({ 'eventoData.residencia': { $exists: true } });

        // Retorna los resultados
        res.render('ver_alumnos_residencia', { alumnosResidencia }); // Renderiza la vista de alumnos de residencia y pasa los datos recuperados
    } catch (error) {
        console.error('Error al obtener los alumnos de residencia:', error);
        res.status(500).send('Ocurrió un error al procesar tu solicitud');
    }
});

router.get('/ver_alumnos_servicio', async (req, res) => {
    try {
        // Realiza la consulta a la base de datos para obtener todos los registros de residencia profesional
        const alumnosServicio = await Registro.find({ 'eventoData.servicio': { $exists: true } });

        // Retorna los resultados
        res.render('ver_alumnos_servicio', { alumnosServicio }); // Renderiza la vista de alumnos de residencia y pasa los datos recuperados
    } catch (error) {
        console.error('Error al obtener los alumnos de residencia:', error);
        res.status(500).send('Ocurrió un error al procesar tu solicitud');
    }
});


router.get('/contacto', (req, res) => {
    res.render('contacto', { errorMessage: '', nombre: '', matricula: '', carrera: '', evento: '', am: '', ap: '', g: '',errores: {} });
});

export default router;
