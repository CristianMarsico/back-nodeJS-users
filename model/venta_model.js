"use strict";
const { conexion } = require('../database/bd2.js');

/**
 * Agrega una venta a la base de datos.
 * @param {object} VENTA - Los datos de la venta a agregar.
 * @param {object} res - El objeto de respuesta HTTP.
 */
exports.addVenta = ((VENTA, res) => {
    conexion.query('INSERT INTO venta SET ?', VENTA, (err, result) => {
        try {
            if (err)
                return res.status(404).json('Error al agregar la venta:');
            return res.status(200).json(`Venta agregada exitosamente! - id : ${result.insertId}`);
        } catch (error) {
            return res.status(500).json("Error de conexion");
        }
    });
});


/**
 * Obtiene las ventas realizadas en un rango de fechas.
 * @param {string} min - La fecha mínima del rango.
 * @param {string} max - La fecha máxima del rango.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en los datos de las ventas o nulo si no se encontraron.
 */
exports.getVentaFecha = ((min, max, res) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(nombre_prod) as total, nombre_prod, color,SUM(cantidad_vendida) as cantidad, SUM(precio) AS precio, cliente, fecha, tipo_venta FROM venta WHERE fecha BETWEEN ? AND ? GROUP BY nombre_prod, color, cliente, tipo_venta, fecha ORDER BY fecha';
        conexion.query(sql, [min, max], (err, resultados) => {
            try {
                if (err)
                    return res.status(404).json({ error: 'Error al obtener las ventas' });
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
 * Obtiene todas las ventas ordenadas por ID descendente.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en los datos de las ventas o nulo si no se encontraron.
 */
exports.getAllVentas = (res) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM venta ORDER BY id DESC';
        conexion.query(sql, (err, resultados) => {
            if (err) {
                return res.status(404).json({ error: 'Error al obtener ventas' });
            }
            if (resultados.length > 0) {
                return resolve(resultados);
            }
            resolve(null);
        });
    });
};
