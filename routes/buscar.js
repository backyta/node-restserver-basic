const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { buscar } = require('../controllers/buscar');

const router = Router();

router.get('/:coleccion/:termino',[

    // check('correo', 'El correo es obligatorio').isEmail(),
    // check('password', 'La password es obligatoria').not().isEmpty(),
    // validateFields


] ,buscar); 




module.exports = router;