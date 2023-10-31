"use strict";
const { conexion } = require('../database/bd2.js');

/**
 * Agrega una compra a la base de datos.
 * @param {object} COMPRA - Los detalles de la compra a agregar.
 * @param {object} res - El objeto de respuesta HTTP.
 *
 * Agrega una nueva compra a la base de datos. Debe proporcionarse un objeto con los detalles de la compra. La función responde con un mensaje de éxito y el ID de la compra recién agregada si la operación se realiza con éxito.
 */
exports.addCompra = ((COMPRA, res) => {
    // Inserta la compra en la base de datos
    conexion.query('INSERT INTO compra SET ?', COMPRA, (err, result) => {
        try {
            if (err)
                return res.status(404).json({ error: 'Error al agregar la compra:' });
            return res.status(201).json(`Compra agregada exitosamente! - id: ${result.insertId}`);
        } catch (error) {
            return res.status(500).json({ error: "Error de conexion" });
        }
    });
});


/**
 * Obtiene las compras realizadas en un rango de fechas.
 * @param {string} min - Fecha mínima del rango.
 * @param {string} max - Fecha máxima del rango.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en una matriz de resultados de compras o nulo si no se encontraron compras.
 *
 * Recupera una lista de compras realizadas dentro de un rango de fechas especificado. Los resultados se agrupan por producto y fecha, y se devuelven como una matriz de objetos de compra. Si no se encuentran compras, la promesa se resuelve como nula.
 */
exports.getCompraFecha = ((min, max, res) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(producto) as total, producto, precio_unitario, fecha, SUM(cantidad) as total_cantidad, SUM(total) as total_compra FROM compra WHERE fecha BETWEEN ? AND ? GROUP BY producto, fecha, precio_unitario ORDER BY fecha';
        conexion.query(sql, [min, max], (err, resultados) => {
            try {
                if (err)
                    return res.status(404).json({ error: 'Error al obtener las compras' });
                if (resultados.length > 0)
                    return resolve(resultados);
                resolve(null);
            } catch (error) {
                res.status(500).json({ error: "Error de conexion" });
            }
        });
    });
});

/**
 * Obtiene todas las compras ordenadas por ID en orden descendente.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en una matriz de compras o nulo si no se encontraron compras.
 *
 * Recupera una lista de todas las compras en la base de datos y las ordena por ID en orden descendente. Los resultados se devuelven como una matriz de objetos de compra si se encuentran compras, o como nulo si no se encontraron compras.
 */
exports.getAllCompras = (res) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM compra ORDER BY id DESC';
        conexion.query(sql, (err, resultados) => {
            if (err) {
                return res.status(404).json({ error: 'Error al obtener compras' });
            }
            if (resultados.length > 0) {
                return resolve(resultados);
            }
            resolve(null);
        });
    });
};