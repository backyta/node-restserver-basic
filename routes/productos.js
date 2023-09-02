const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validate-fields');
const { validarJWT, esAdminRole } = require('../middlewares');
const { crearProducto,
        obtenerProductos, 
        obtenerProducto, 
        actualizarProducto, 
        borrarProducto} = require('../controllers/productos');

const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

const router = Router();

/* {{utl}}/api/categories */


//Obtener todas las categorias - publico
router.get('/', obtenerProductos );


//Obtener una categoria por id
router.get('/:id', [
    validarJWT,
    check('id','No es un id de Mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validateFields,
], obtenerProducto);


//Crear categoria, cualquier persona con un TOKEN valido, cualquier role
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validateFields

], crearProducto);


//Actualizar por id
router.put('/:id', [
    validarJWT,
    // check('categoria','No es un id de Mongo').isMongoId(), //me pide obligatorio en el body, pueda que no la quiera actulizar. 
    check('id').custom( existeProductoPorId ),
    validateFields
], actualizarProducto);


//Delete categorie por id - Role ADMIN , manrcaos activo en false 
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un id de Mnngo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validateFields

], borrarProducto);



module.exports = router;