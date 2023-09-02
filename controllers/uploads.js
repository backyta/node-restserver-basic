const fs = require('node:fs');
const path = require('path')

const { response, request } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario, Producto } = require('../models');


const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL )



const cargarArchivos = async ( req, res = response ) =>{

    try {
        // Imagenes, txt, md, etc
        const pathCompleto = await subirArchivo( req.files,['txt','md'], 'textos' ); // o nombre del archivo y extension
        // mandar undefined si quiero omitir el segundo argumento enviarlo
        res.json({
            nombre: pathCompleto
        })
        
    } catch (error) { // atrap el reject de la promesa
        res.status(400).json({ msg:error })
    }
}

// Subir y actualizar en local
const actualizarImagen = async ( req, res = response ) =>{

    const {id, coleccion} = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg:`No existe un usuario con el id ${ id }`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg:`No existe un producto con el id ${ id }`
                })
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido esto'})
    }
    
    // Limpiar imagenes previas
    if ( modelo.img ) {
        // borrar imagen del servidos
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if ( fs.existsSync( pathImagen ) ) {
            fs.unlinkSync( pathImagen ); // para borrar 
        }
    }


    const nombre = await subirArchivo( req.files, undefined , coleccion );
    modelo.img = nombre;

    await modelo.save();

    res.json( modelo );

}


//Subir y guardar en CloudDinary
const actualizarImagenCloudinary = async ( req = request, res = response ) =>{

    const {id, coleccion} = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg:`No existe un usuario con el id ${ id }`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg:`No existe un producto con el id ${ id }`
                })
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido esto'})
    }
    
    // Limpiar imagenes previas
    if ( modelo.img ) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[ nombreArr.length - 1]
        const [ public_id ] = nombre.split('.')

        await cloudinary.uploader.destroy(public_id); // no es necesario el await porque no esperamos a que se borre en el momentoes algo aparte
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath ) // mnadar el archivo temp del objeto de mi req.files.archivo

    modelo.img = secure_url;

    await modelo.save();

    res.json( modelo );

}


const mostrarImagen = async ( req, res = response ) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg:`No existe un usuario con el id ${ id }` // si no existe podria regresar una imagen en blanco o por defecto
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg:`No existe un producto con el id ${ id }`
                })
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido esto'})
    }
    
    // Limpiar imagenes previas
    if ( modelo.img ) {
        // borrar imagen del servidos
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if ( fs.existsSync( pathImagen ) ) {
            return res.sendFile( pathImagen ) // se puede colocar img en a ruta/ en vez de uploads
        }
    }
    
    const pathImagen = path.join( __dirname, '../assets/no-image.jpg' );
    res.sendFile( pathImagen)

}




module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}