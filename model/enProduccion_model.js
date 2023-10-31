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