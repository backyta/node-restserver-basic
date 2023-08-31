const validaCampos = require('../middlewares/validate-fields');
const validaJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');


module.exports = {
    ...validaCampos,
    ...validaJWT,
    ...validaRoles
}