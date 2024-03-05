"use strict";
const { conexion } = require('../database/bd2.js');

/**
 * Agrega un comentario a la base de datos.
 * @param {object} COMENTARIO - Los detalles del comentarios a agregar.
 * @param {object} res - El objeto de respuesta HTTP.
 *
 * Agrega un nuevo comentario a la base de datos.
 */
exports.addComentario = ((COMENTARIO, res) => {
    conexion.query('INSERT INTO comentario SET ?', COMENTARIO, (err, result) => {
        try {
            if (err)
                return res.status(404).json({ error: 'Error al agregar la comentario:' });
            return res.status(201).json(`Comentario generado exitosamente! - id: ${result.insertId}`);
        } catch (error) {
            return res.status(500).json({ error: "Error de conexion" });
        }
    });
});


/**
 * Obtiene todos los comentarios.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en una matriz de comentarios o nulo si no se encontraron comentarios.
 *
 * Recupera una lista de todos los comentarios en la base de datos.
 */
exports.getAllComentarios = (id, res) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM comentario co JOIN cliente c ON co.id_cliente = c.id_cliente WHERE co.id_cliente = ?`;
        conexion.query(sql, [id], (err, resultados) => {
            if (err) {
                return res.status(404).json({ error: 'Error al obtener los comentarios' });
            }
            if (resultados.length > 0) {
                return resolve(resultados);
            }
            resolve(null);
        });
    });
};



/**
 * Elimina comentario en produccion por su ID.
 * @param {number} id - El ID de la materia prima a eliminar.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en el resultado de la eliminación de la materia prima.
 */
exports.deleteComentario = ((ids, res) => {
   
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM comentario WHERE id_comentario IN (${ids.join(',')})`;
        conexion.query(sql, (err, resultados) => {
            try {
                if (err)
                    return res.status(404).json({ error: 'Error al eliminar' });
                if (resultados.affectedRows > 0)
                    return resolve(resultados);
                return resolve(null);
            } catch (error) {
                return res.status(500).json({ error: "Error de conexion" });
            }
        });
    });
});