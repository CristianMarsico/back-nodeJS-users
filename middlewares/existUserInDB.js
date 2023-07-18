"use strict";

const conexion = require('../database/bd.js');

exports.existsUserInBD = (req, res, next) => {

    const name = req.body.nombre
    const user = req.body.usuario

    let sql = 'SELECT * FROM usuario_1 WHERE nombre = ? AND usuario = ?'
    conexion.query(sql, [name, user], (err, results) => {
        try {
            if (err)  // un error indica que hubo problemas con la consulta
                return res.status(500).json({ error: 'Server error' });
            if (results.length !== 0)  // Si el usuario no existe
                return res.status(200).json({ message: 'El usuario existe en la base de datos' });
            else
                //next
                return next();
        } catch (e) {
            console.log("error")
        }
    });
}