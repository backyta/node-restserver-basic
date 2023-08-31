const { response, json } = require("express");
const User = require('../models/usuario')
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


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


const googleSingIn = async (req, res = response) =>{

    const { id_token } = req.body;
    console.log(id_token);
    try {
        const { nombre, img, correo } = await googleVerify( id_token );

        // console.log( googleUser );
        console.log( {nombre, img, correo });

        let usuario = await User.findOne({ correo:correo });
 
        if ( !usuario ) { // si no existe
            // tengo que crearlo 
            const data = {
                nombre,
                correo,
                password: 'eee',
                img,
                role:'USER_ROLE',
                google: true
            }

            usuario = new User( data );
            await usuario.save();
        }

        // console.log('usuario');
        // Si el usuario en DB tiene el estado en false, niega la auth en la app
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg:'Hable con el administrador, usuario bloqueado'
            })
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id )


        res.json({
            msg: 'Todo bien! google Sig In',
            token,
            usuario
            
        })
        
    } catch (error) {
       return res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }



}



module.exports = {
    login,
    googleSingIn
}