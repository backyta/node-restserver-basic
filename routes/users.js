const { Router } = require('express');

const { usersGet,
        usersPut,
        usersPost,
        usersDelete } = require('../controllers/users');

const router = Router();


router.get('/', usersGet ); // la req y res seran pasados en la solcicitud de la ruta '/' pasara ala funcion y retornara la respuesta 

router.put('/:id', usersPut)

router.post('/', usersPost)

router.delete('/', usersDelete)




module.exports = router;