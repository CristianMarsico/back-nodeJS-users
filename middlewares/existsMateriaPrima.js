"use strict";
const { conexion } = require('../database/bd2.js');

/**
 * Middleware que verifica si una materia prima con el ID especificado existe en la base de datos.
 * @param {object} req - El objeto de solicitud HTTP que contiene los parámetros de la ruta.
 * @param {object} res - El objeto de respuesta HTTP.
 * @param {function} next - Función para pasar el control al siguiente middleware o ruta.
 *
 * @throws {Error} Si hay un error en la consulta de la base de datos.
 *
 * Si la materia prima con el ID especificado existe en la base de datos, llama a la función `next` para permitir que la solicitud continúe.
 * Si la materia prima no existe, responde con un código de estado 404 y un mensaje de error.
 */
exports.existsMateriaPrima = (req, res, next) => {

    const { id } = req.params;
    console.log(id)
    let sql = 'SELECT * FROM materia_prima WHERE id = ?'
    conexion.query(sql, [id], (err, results) => {
        try {

            if (err)  // un error indica que hubo problemas con la consulta
                return res.status(500).json({ error: 'Server error' });

            if (results.length == 0) // Si el usuario no existe
                return res.status(404).json({ error: 'La Materia Prima NO existe en la base de datos' });
            else
                //next
                return next();
        } catch (e) {
            console.log("error");
        }
    });
}