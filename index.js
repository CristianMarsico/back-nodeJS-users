"use strict";

const express = require('express');
const cookie = require('cookie-parser');
const dontev = require('dotenv');
const cors = require('cors');

const path = require('path');
//SETEAMOS VARIABLES DE ENTORNO
dontev.config({
    path: './env/.env'
})

const { createTablesAndTriggers } = require('./Scripts/createTablesAndTriggers.js');
const { createDatabaseIfNotExists, connectToDatabase, performDatabaseBackup } = require('./database/bd2.js');
const { existsRoleInDataBase } = require('./Scripts/roles.js');
const { crearUsuarioPorDefecto } = require('./Scripts/users.js');

(async () => {
    try {
        await createDatabaseIfNotExists();
        await connectToDatabase();
        await createTablesAndTriggers();
        await existsRoleInDataBase();
        await crearUsuarioPorDefecto();
        await performDatabaseBackup();
    } catch (error) {
        console.error('Error en la creación de tablas y triggers:', error);
    }
})();

const app = express();

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

//VAMOS A TRABAJAR CON JSON
app.use(express.json())

    //PARA PROCESAR DATOS ENVIADOS DESDE FORMS
    .use(express.urlencoded({
        extended: true
    }))

app.use('/uploads', express.static('uploads'));


/*
ROUTER
*/
app.use('/api', require('./routes/authRouter.js'));
app.use('/api', require('./routes/materiaPrimaRouter.js'));
app.use('/api', require('./routes/compraRouter.js'));
app.use('/api', require('./routes/ventaRouter.js'));
app.use('/api', require('./routes/hiladoRouter.js'));
app.use('/api', require('./routes/clienteRouter.js'));
app.use('/api', require('./routes/enProduccion.js'));


app.listen(3000, () => {
    console.log("👍👍👍 Escuchando en el puerto 3000");
})