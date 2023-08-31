const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSingIn } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.post('/login',[

    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La password es obligatoria').not().isEmpty(),
    validateFields


] ,login); 


router.post('/google',[

    check('id_token', 'id_token de google es necesario').not().isEmpty(),
    validateFields

] ,googleSingIn); 



module.exports = router;