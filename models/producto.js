const { model, Schema } = require('mongoose');


const ProductoSchema = Schema({
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
    },
    precio:{
        type: Number,
        default: 0,
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref:'Categoria',
        required: true
    },
    descripcion:{ type: String},
    disponible: { type: Boolean, default: true}
});

ProductoSchema.methods.toJSON = function () {
    const { __v, estado, ...data} = this.toObject(); // toObject genera un objeto con todas las propiedades
    return data
}


module.exports = model('Producto', ProductoSchema) // por defetcto mongo le agrega una S, para crear la colecction