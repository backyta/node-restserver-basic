const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validate-fields');
const { validarJWT, esAdminRole } = require('../middlewares');
const { crearCategoria,
        obtenerCategorias, 
        obtenerCategoria, 
        actualizarCategorias, 
        borrarCategoria} = require('../controllers/categories');

const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

/* {{utl}}/api/categories */


//Obtener todas las categorias - publico
router.get('/', obtenerCategorias );


//Obtener una categoria por id
router.get('/:id', [
    check('id','No es un id de Mongo valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validateFields,
], obtenerCategoria);


//Crear categoria, cualquier persona con un TOKEN valido, cualquier role
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validateFields

], crearCategoria);


//Actualizar por id
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoriaPorId ),
    validateFields
],actualizarCategorias);


//Delete categorie por id - Role ADMIN , manrcaos activo en false 
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un id de Mnngo valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validateFields

], borrarCategoria);



module.exports = router;