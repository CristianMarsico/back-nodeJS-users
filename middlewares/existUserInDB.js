"use strict";
const { conexion } = require('../database/bd2.js');
const { getUserBy_Name_And_User_And_Rol } = require('../model/userModel.js');

/**
 * Middleware que verifica si un usuario con el nombre y usuario especificados existe en la base de datos.
 * @param {object} req - El objeto de solicitud HTTP que contiene los datos del usuario a verificar.
 * @param {object} res - El objeto de respuesta HTTP.
 * @param {function} next - Función para pasar el control al siguiente middleware o ruta.
 *
 * @throws {Error} Si hay un error en la consulta de la base de datos.
 *
 * Si el usuario con el nombre y usuario especificados existe en la base de datos, responde con un código de estado 404 y un mensaje de error.
 * Si el usuario no existe, llama a la función `next` para permitir que la solicitud continúe.
 */
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