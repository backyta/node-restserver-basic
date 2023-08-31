const { response } = require("express");
const User = require('../models/usuario')
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");


const login = async (req, res = response) =>{

    const { correo, password } = req.body;

    try {
        //verificar si el email existe
        const usuario = await User.findOne({ correo: correo })
        if ( !usuario ) {
            return res.status(400).json({
                msg:'Usuerio / Password no son correctos - correo'
            })
        }

        // Si el usuario esta activo en la BD
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg:'Usuerio / Password no son correctos - estado: false'
            })
        }

        // Verificar la password
        const validPassword = bcryptjs.compareSync( password, usuario.password ) // compara las password en la req con la de la BD
        if ( !validPassword ) {
            return res.status(400).json({
                msg:'Usuerio / Password no son correctos - password'
            })
        }

        // Gnerar el JWT
        const token = await generarJWT( usuario.id )

        res.json({
            msg: 'Login ok',
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:'Hable con el admin'
        })
    }



}


module.exports = {
    login
}