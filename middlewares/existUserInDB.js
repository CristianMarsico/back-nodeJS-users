"use strict";

const { conexion } = require('../database/bd2.js');
const { getUserBy_Name_And_User_And_Rol } = require('../model/userModel.js');


exports.existsUserInBD = (async (req, res, next) => {

    const name = req.body.nombre;
    const user = req.body.usuario;
    const tipo = req.body.tipo;

    if (tipo == undefined) {
        const newUser = await getUserBy_Name_And_User_And_Rol(name, user, "default", conexion, res);
        if (newUser)
            return res.status(404).json({ error: 'El usuario existe en la base de datos' });
        else
            return next();
    }
    else {
        const newUser = await getUserBy_Name_And_User_And_Rol(name, user, tipo, conexion, res);
        if (newUser)
            return res.status(404).json({ error: 'El usuario existe en la base de datos' });
        else
            return next();
    }

});