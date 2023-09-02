const { response } = require("express");
const { Producto } = require('../models');



const crearProducto = async ( req, res = response ) =>{

    const { estado, usuario, ...body } = req.body; // saco del body lo que no necesito regresar

    const productoDB = await Producto.findOne({ nombre: body.nombre })

    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya existe`
        })
    }

    // Generar la data a guardar 
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id// la data a guardar debe del usuario debe ser su id de mongo, es el id de quien lo creo
    }

    const producto = new Producto( data );

    // Guardar DB
    await producto.save();

    res.status(201).json(producto)

}

// Obtener Categories - Paginado - total de paginas - populate
const obtenerProductos = async ( req, res = response) => {

    const{ limit = 5, desde = 0 } = req.query;
    const query = { estado: true }

    //* coleccion de promesasm ejecuta ambas de manera simultanea

    const [ total, productos ] = await Promise.all([
        //colocar cuantos registros tenfo grabados en la bd
        Producto.countDocuments(query),
        Producto.find( query ) // busca los que tengan estado en true, retorna un array
        .populate( 'usuario', 'nombre')
        .limit( parseInt(limit) )
        .skip( parseInt(desde) )
    ]);


    res.json({
        total,
        productos
    });
}


// Obtener categoria - poplate
const obtenerProducto = async (req, res = response) =>{

    const { id } = req.params;
    const producto = await Producto.findById( id ).populate('usuario', 'nombre');
    
    res.json( producto );

}

// actualizarCategoria por el nombre
const actualizarProducto  = async (req , res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body; // extraigo lo que no quiero o no se pued editar

    if ( data.nombre ) {
        
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id; // del token lo extrae

    const producto = await Producto.findByIdAndUpdate( id, data, { new: true }) // primera parametro el ud , egundo la data

    res.json( producto );

}


// Borrar categoria , pero cambiar el estado a false
const borrarProducto = async ( req , res = response ) =>{

    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate( id, { estado: false }, { new: true } ) // busca por id, despues setea los cambios , el el ultimo parametro es el new true
    // Con new true se miran los cambios reflejados en la respuesta json

    res.status(200).json( productoBorrado )
}



module.exports = {
    borrarProducto,
    obtenerProducto,
    actualizarProducto,
    obtenerProductos,
    crearProducto
}