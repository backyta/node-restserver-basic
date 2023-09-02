const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { cargarArchivos, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers/db-validators');
const { validarArchivoSubir } = require('../middlewares');

const router = Router();


router.post('/', validarArchivoSubir, cargarArchivos );


router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe ser un MongoId').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'] ) ),
    validateFields
// ], actualizarImagen );
], actualizarImagenCloudinary );


router.get('/:coleccion/:id', [
    check('id', 'El id debe ser un MongoId').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'] ) ),
    validateFields
], mostrarImagen );




module.exports = router;