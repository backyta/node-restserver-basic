const { response } = require("express");
const { Categoria } = require('../models');



const crearCategoria = async ( req, res = response ) =>{

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre })

    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        })
    }

    // Generar la data a guardar 
    const data = {
        nombre,
        usuario: req.usuario._id// la data a guardar debe del usuario debe ser su id de mongo, es el id de quien lo creo
    }

    const categoria = new Categoria( data );

    // Guardar DB
    await categoria.save();

    res.status(201).json(categoria)

}

// Obtener Categories - Paginado - total de paginas - populate
const obtenerCategorias = async ( req, res = response) => {

    const{ limit = 5, desde = 0 } = req.query;
    const query = { estado: true }

    //* coleccion de promesasm ejecuta ambas de manera simultanea

    const [ total, categorias ] = await Promise.all([
        //colocar cuantos registros tenfo grabados en la bd
        Categoria.countDocuments(query),
        Categoria.find( query ) // busca los que tengan estado en true, retorna un array
        .populate( 'usuario', 'nombre')
        .limit( parseInt(limit) )
        .skip( parseInt(desde) )
    ]);


    res.json({
        total,
        categorias
    });
}


// Obtener categoria - poplate
const obtenerCategoria = async (req, res = response) =>{

    const { id } = req.params;
    const categoria = await Categoria.findById( id ).populate('usuario', 'nombre');

    res.json( categoria );

}

// actualizarCategoria por el nombre
const actualizarCategorias = async (req , res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id; // del token lo extrae

    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true })

    res.json( categoria );

}


// Borrar categoria , pero cambiar el estado a false
const borrarCategoria = async ( req , res = response ) =>{

    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate( id, { estado: false }, { new: true } ) // busca por id, despues setea los cambios , el el ultimo parametro es el new true
    // Con new true se miran los cambios reflejados en la respuesta json

    res.status(200).json( categoriaBorrada )
}



module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategorias,
    borrarCategoria
}