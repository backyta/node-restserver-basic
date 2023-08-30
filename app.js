require('dotenv').config()
const Server = require('./models/server');



//? Inicializar el server mediante la clase
const server = new Server();

server.listen()




























//* Declaracion de instancia de servidor segun expres
// const express = require('express')
// const app = express()

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(process.env.PORT, () => {
//   console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
// })
