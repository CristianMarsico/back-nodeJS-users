"use strict";

const conexion = require('../database/bd.js');
const { getUserBy_Name_And_User_And_Rol } = require('../model/userModel.js');


exports.existsUserInBD = (async (req, res, next) => {


    const name = req.body.nombre
    const user = req.body.usuario
    const tipo = req.body.tipo

    if (tipo == undefined) {
        const newUser = await getUserBy_Name_And_User_And_Rol(name, user, "default", conexion, res);
        if (newUser)
            return res.status(404).json({ message: 'El usuario existe en la base de datos' });
        else
            return next();
    }
    else {
        const newUser = await getUserBy_Name_And_User_And_Rol(name, user, tipo, conexion, res);
        if (newUser)
            return res.status(404).json({ message: 'El usuario existe en la base de datos' });
        else
            return next();
    }
    // let sql = 'SELECT * FROM usuario WHERE nombre = ? AND usuario = ?'
    // conexion.query(sql, [name, user], (err, results) => {
    //     try {
    //         if (err)  // un error indica que hubo problemas con la consulta
    //             return res.status(500).json({ error: 'Server error' });
    //         if (results.length !== 0)  // Si el usuario no existe
    //             return res.status(200).json({ message: 'El usuario existe en la base de datos' });
    //         else
    //             //next
    //             return next();
    //     } catch (e) {
    //         console.log("error")
    //     }
    // });
});