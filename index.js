"use strict";

const express = require('express')
const cookie = require('cookie-parser')
const dontev = require('dotenv')
const cors = require('cors');

//SETEAMOS VARIABLES DE ENTORNO
dontev.config({
    path: './env/.env'
})

const app = express()

//HACEMOS USO DE LAS COOKIES
app.use(cookie())

//HACEMOS USO DE LAS RUTAS PERMITIDAS DE LAS PROPIEDADES 
const whiteList = [process.env.ORIGIN1, process.env.ORIGIN2, process.env.ORIGIN3]

//HACEMOS USO DE LOS CORS
app.use(cors(
    {
        origin: function (origin, callback) {
            // console.log("🤞🤞🤞 => ", origin);
            if (!origin || whiteList.includes(origin)) {
                return callback(null, origin);
            }
            return callback("Error de CORS origin: " + origin + " No autorizado")
        }, credentials: true
    }
)
)






//SETEAMOS CARPETA DE ARCHIVOS ESTATICOS
//app.use(express.static('public'))

//SETEAMOS EL MOTOR DE PLANTILLAS
//app.set('view engine', 'ejs')


//VAMOS A TRABAJAR CON JSON
app.use(express.json())



    //PARA PROCESAR DATOS ENVIADOS DESDE FORMS
    .use(express.urlencoded({
        extended: true
    }))



/*
ROUTER
*/
app.use('/api', require('./routes/router.js'))


app.listen(3000, () => {
    console.log("Escuchando en el puerto 3000")
})


