const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validate-fields');
const { esRoleValido, emailExiste, existeUserPorId } = require('../helpers/db-validators');
const { usersGet,
        usersPut,
        usersPost,
        usersDelete } = require('../controllers/users');

const router = Router();


router.get('/', usersGet ); // la req y res seran pasados en la solcicitud de la ruta '/' pasara ala funcion y retornara la respuesta 

router.put('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeUserPorId ),
    check('role').custom( (role) => esRoleValido(role) ), 
    validateFields


] ,usersPut)


router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( (correo) => emailExiste(correo) ),
    check('password', 'El password debe de ser mas de 6 caracteres').isLength({ min: 6 }),
    // check('role', 'No es un rol valido').isIn(['USER_ROLE','ADMIN_ROLE']),
    check('role').custom( (role) => esRoleValido(role) ), // se puede enviar la funcion como referencia no mas
    validateFields
] ,usersPost)

router.delete('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeUserPorId ),
    validateFields
],usersDelete)



module.exports = router;










//* El check es in moddleware de express en el cual se puede especificar que campo del body necesito
//* revisar, en este caso el correo.

//* lo que hace el check es que va preparando lo errores, esta creando en la request todos los errores
//* los va almacenando en los middlewares de tal manera que cuando llegue al controlador
//* los pueda confirmar y lanzar el error.

//? Al hacer todas las validaciones del check hechas y estan alamcenandas en la req, pasamos 
//? al validateFields, y si este ecuentra errores lanza el error, pero si no continua al controlador

