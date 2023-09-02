const { response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ) //TRUE

    if ( esMongoID ) {
        const usuario = await Usuario.findById(termino)
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        })
    }

    const regex = new RegExp( termino , 'i')

    const usuarios = await Usuario.find({ // se puede usar por count
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    return res.json({
        results: usuarios
    })
}

const buscarCategorias = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ) //TRUE

    if ( esMongoID ) {
        const categoria = await Categoria.findById(termino)
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        })
    }

    const regex = new RegExp( termino , 'i') // fin busca que contenga el termino en su propiedad nombre y lo retorna.

    const categoria = await Categoria.find({ // se puede usar por count
        nombre: regex, estado: true
    });

    return res.json({
        results: categoria
    })

}

const buscarProductos = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ) //TRUE

    if ( esMongoID ) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre')
        return res.json({
            results: ( producto ) ? [ producto ] : []
        })
    }

    const regex = new RegExp( termino , 'i') // fin busca que contenga el termino en su propiedad nombre y lo retorna.

    const producto = await Producto.find({ // se puede usar por count
        $or: [{ nombre: regex }, { descripcion: regex }],
        $and: [{ estado: true }]
    }).populate('categoria', 'nombre')

    return res.json({
        results: producto
    })

}


const buscar = (req, res = response) =>{

    const { coleccion, termino } = req.params;
    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg:`Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

    switch ( coleccion ) {
        case 'usuarios':
            buscarUsuarios(termino, res )
        break;
        case 'categorias':
            buscarCategorias(termino, res )
        break;
        case 'productos':
            buscarProductos(termino, res )
        break;

        default:
            res.status(500).json({
                msg:'Se me olvido hacer esta busqueda'
            })
    }

}

module.exports = { buscar }