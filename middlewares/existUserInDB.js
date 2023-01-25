"use strict";

const conexion = require('../database/bd.js')

exports.existsUserInBD = (req, res, next) => {
    const name = req.body.name
    const user = req.body.user


    let sql = 'SELECT * FROM users WHERE name = ? AND user = ?'
    let c = conexion.query(sql, [name, user], (err, results) => {
        try {

            if (err) { // un error indica que hubo problemas con la consulta

                return res.status(500).json({
                    error: 'Server error'
                });
            }
            if (results.length !== 0) { // Si el usuario no existe
                return res.status(200).json({
                    message: 'El usuario existe en la base de datos'
                });
            } else {
                //next
                return next()
            }

        } catch (e) {
            console.log("errorrrrrrrrrr")
        }
    })

}