const { response, request } = require('express')

const usersGet = (req = request, res = response) => {

    const { q, nombre='no name', apikey, page = 1, limit } = req.query
    // console.log(query); // serializa a un objeto los params del query y en la res lo pasamos a json

    res.json({
        ok: true,
        msg:'get API - controller',
        q, 
        nombre, 
        apikey,
        page,
        limit
    });
}

const usersPost = (req, res = response) => {

    const { nombre, edad } = req.body;

    res.json({
        ok: true,
        msg:'post API - controller',
        nombre,
        edad
    });
}

const usersPut = (req, res = response) => {

    const id = req.params.id;

    res.json({
        ok: true,
        msg:'put API - controller',
        id
    });
}

const usersDelete = (req, res = response) => {

    res.json({
        ok: true,
        msg:'delete API - controller'
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