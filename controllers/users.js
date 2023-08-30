const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/usuario');
const usuario = require('../models/usuario');


const usersGet = async (req = request, res = response) => {

    
    // const { q, nombre='no name', apikey, page = 1, limit } = req.query
    // console.log(query); // serializa a un objeto los params del query y en la res lo pasamos a json
    
    const{ limit = 5, desde = 0 } = req.query;
    const query = { estado: true }

    //* coleccion de promesasm ejecuta ambas de manera simultanea
    const [ total, users ] = await Promise.all([
        //colocar cuantos registros tenfo grabados en la bd
        User.countDocuments(query),
        User.find( query ) // busca los que tengan estado en true, retorna un array
        .limit( parseInt(limit) )
        .skip( parseInt(desde) )
    ]);


    res.json({
        total,
        users
    });
}

const usersPost = async (req, res = response) => {

    const { nombre, correo, password, role } = req.body;
    const user = new User({nombre, correo, password, role});

    // verificar el correo exists
    // const existeEmail = await User.findOne({ correo: correo })// busca uno que coincida en el modelo en la BD con el correo que se pasa en el body
    // if( existeEmail ){
    //     return res.status(400).json({
    //         msg: 'El correo ya esta registrado'
    //     })
    // }

    //encriptar o hash de password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt )


    //save on DB
    await user.save();

    res.json({ // aqui se ejecuta el metodo toJSON de sobreescritura que retorna tod menos el __v y el password
     /*    ok: true,
        msg:'post API - controller', */
        user
    });
}

const usersPut = async (req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body

    // const user = await User.findOne({ password: password })

    //Validar contra BD
    if ( password ) {
        //encriptar o hash de password
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt )
    }

    const user = await User.findByIdAndUpdate( id, resto ) // regresa el objeto que he actualizado
    console.log(user);

    res.json(user);
}

const usersDelete = async (req, res = response) => {

    const { id } = req.params;

    //* Fisicamente borrar, no se recomienda
    // const user = await User.findByIdAndDelete( id ); // no se recomienda

    const user = await User.findByIdAndUpdate( id, { estado: false })

    //* Se recomienda usar este tipo de eliminaciones porque cualquier otra persona que use mi backedn
    //* o servicios rest ese registro fue eliminado pero para mi base de datos o entidad referencial 
    //* siempre va existir

    res.json({
        user
    });
}


module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersDelete,

}

//* lo que viene ne la req que no es body (hasta ahora), se convierte o serializan en bojetos de manera
//* automatica para poder manejarlos al momento de dar la respuesta.