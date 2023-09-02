const { crearCategoria } = require('../controllers/categories')
const { Categoria, User, Producto } = require('../models')
const Role = require('../models/role')


//Validadores perzonalizados

const esRoleValido = async (role = '' ) => {
    const existRole = await Role.findOne({ role: role })// si esciste quire decir que esta grabado en la BD
    if ( !existRole ) {
        throw new Error(`El rol ${ role } no esta registrado en la BD`)
    }
}

//verificar el correo exists
const emailExiste = async ( correo = '') =>{
    const existeEmail = await User.findOne({ correo: correo })// busca uno que coincida en el modelo en la BD con el correo que se pasa en el body
    if( existeEmail ){
         throw new Error(`El correo ${correo} ya existe`)
    }
}


const existeUserPorId = async ( id = '') =>{
    const existeUser = await User.findById(id)// busca uno que coincida en el modelo en la BD con el correo que se pasa en el body
    if( !existeUser ){
         throw new Error(`El id ${ id } no existe`)
    }
}


const existeCategoriaPorId = async ( id = '' ) =>{

    const existeCategoria = await Categoria.findById(id);
    if ( !existeCategoria ) {
        throw new Error(`El id no existe ${ id }`)
    }
}

const existeProductoPorId = async ( id = '' ) =>{
    console.log( id );
    const existeProducto = await Producto.findById(id);
    console.log(existeProducto);

    if ( !existeProducto ) {
        throw new Error(`El id no existe ${ id }`)
    }
}

// Validar colecciones Permitidas
const coleccionesPermitidas = async ( coleccion = '', colecciones = [] ) => {

    const incluida = colecciones.includes( coleccion );
    if ( !incluida ) {
        throw new Error(`La coleccion ${ coleccion } no es permitida, ${ colecciones }`)
    }

    return true; // en realidad se manda un true implicito y deberiamos colocarlo en todas las helpers
}



module.exports = {
    esRoleValido,
    emailExiste,
    existeUserPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}