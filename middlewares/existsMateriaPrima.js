"use strict";

const conexion = require('../database/bd.js');

exports.existsMateriaPrima = (req, res, next) => {

    const { id } = req.params;
    console.log(id)


    let sql = 'SELECT * FROM materia_prima WHERE id = ?'
    conexion.query(sql, [id], (err, results) => {
        try {

            if (err)  // un error indica que hubo problemas con la consulta
                return res.status(500).json({ error: 'Server error' });

            if (results.length == 0) // Si el usuario no existe
                return res.status(200).json({ message: 'La Materia Prima NO existe en la base de datos' });
            else
                //next
                return next();
        } catch (e) {
            console.log("error");
        }
    });

}