const Role = require('../models/role')
const User = require('../models/usuario')

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






module.exports = {
    esRoleValido,
    emailExiste,
    existeUserPorId
}