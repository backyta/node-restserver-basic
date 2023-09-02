
const validarArchivoSubir = ( req, res , next ) =>{

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) { // transforma a array las keys de los objetos que dio la res del req.files.
        return res.status(400).json(
            { msg: 'No hay archivos que subir - validarArchivo subir ' 
        }); // si no existe files, o viene sin ninguna llave, lanza error
    }

    next();
}



module.exports = {
    validarArchivoSubir
}