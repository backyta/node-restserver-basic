
const { model, Schema } = require('mongoose');

const CategoriaSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado:{
        type: Boolean,
        default:true,
        required: true
    },
    usuario:{// saber el usuario quien creo la categoria, es de tipo id
        type: Schema.Types.ObjectId,
        ref: 'Usuario', // apunta a la coleccion de Usuario. para mantener la referencia
        required: true // todas las categorias tiene  que tener un usuario por eso es required
    }
});

CategoriaSchema.methods.toJSON = function () {
    const { __v, estado, ...data} = this.toObject(); // toObject genera un objeto con todas las propiedades
    return data
}


module.exports = model('Categoria', CategoriaSchema)