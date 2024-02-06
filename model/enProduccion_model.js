"use strict";
const { conexion } = require('../database/bd2.js');

/**
 * Obtiene todos los registros en producción ordenados por fecha en orden descendente.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en una matriz de registros en producción o nulo si no se encontraron registros.
 */
exports.getAllEnProduccion = (res) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM enproduccion ORDER BY fecha DESC';
        conexion.query(sql, (err, resultados) => {
            if (err)
                return res.status(404).json({ error: 'Error al obtener los registros en produccion' });

            if (resultados.length > 0)
                return resolve(resultados);

            resolve(null);
        });
    });
};


/**
 * Elimina una materia prima en produccion por su ID.
 * @param {number} id - El ID de la materia prima a eliminar.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en el resultado de la eliminación de la materia prima.
 */
exports.deleteEnProduccion = ((id, res) => {
    return new Promise((resolve, reject) => {
        let sql = 'DELETE FROM enproduccion WHERE id = ?';
        conexion.query(sql, [id], (err, resultados) => {
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