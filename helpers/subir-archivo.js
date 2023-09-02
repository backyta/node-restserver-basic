
const path = require('path');
const { nanoid } = require('nanoid');


const subirArchivo = ( files, extensionesValidas = ['jpg','jpeg','png','gif'], carpeta = '' ) => {

    return new Promise((resolve, reject) =>{

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length - 1 ];
        // console.log(nombreCortado);
        
        //Validar la extension
    
        if ( !extensionesValidas.includes(extension) ) {
            return reject( `La extension ${ extension } no es permitida - ${ extensionesValidas }`);
        }
    
        const nombreTemp = nanoid() + '.' + extension; //=> example: "V1StGXR8_Z5jdHi6B-myT" / se pude colocar nombreFInal o cualquiera, queda grabado en el disco del server
    
        //Construccion del archivo
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp)// diname llega hasta el controler, archivo actual, aregamos el .. /uploads para salir y concatenamos el nombre de archivo
      
        archivo.mv(uploadPath, (err) => {
          if (err) {
            reject(err)
          }
      
         resolve (nombreTemp); // no sirve al usuario al ruta completa porque no puede acceder en su luar mandamos el nombre y su estension
        });
    }) 

}


module.exports = {
    subirArchivo
}