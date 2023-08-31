const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/usuario');


const validarJWT = async (req = request, res = response , next) =>{

    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            msg:'No hay token en la peticion'
        })
    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRET_KEY ) // verifica el jwt, se puede extrar el uid que grabamos en el token

        //leer el usuario que corresponde al uid
        const user = await User.findById( uid ); // se envia en la req y pasa al siguiente middleware o al controlador

        if ( !user ) {
            return res.status(400).json({
                msg: 'Token no valido - usuario no existe en BD'
            })
        }

        // Verificar si el uid tiene estado en true
        if ( !user.estado ) {
            return res.status(400).json({
                msg: 'Token no valido - usuario con estado: false'
            })
        }
        
        
        req.usuario = user;

        // console.log(payload);
        next()

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:'token no valido'
        })
    }

}


module.exports = {
    validarJWT
}