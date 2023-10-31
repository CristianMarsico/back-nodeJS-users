"use strict";
const { conexion } = require('../database/bd2.js');

/**
 * Obtiene el nombre de todas las materias primas en la base de datos.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en una matriz de nombres de materias primas o nulo si no se encontraron.
 */
exports.getMPByName = (res) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT nombre FROM materia_prima';
        conexion.query(sql, (err, resultados) => {
            if (err) {
                return res.status(404).json({ error: 'Error al obtener las materias primas' });
            }
            if (resultados.length > 0) {
                return resolve(resultados);
            }
            resolve(null);
        });
    });
};

/**
 * Obtiene todas las materias primas ordenadas por nombre en orden ascendente.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en una matriz de materias primas o nulo si no se encontraron.
 */
exports.getAllMP = (res) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM materia_prima ORDER BY nombre ASC';
        conexion.query(sql, (err, resultados) => {
            if (err) {
                return res.status(404).json({ error: 'Error al obtener las materias primas' });
            }
            if (resultados.length > 0) {
                return resolve(resultados);
            }
            resolve(null);
        });
    });
};

/**
 * Actualiza el stock de una materia prima en la base de datos y registra la actualización en la tabla "enproduccion".
 * @param {number} id - El ID de la materia prima.
 * @param {number} cantidad - La cantidad a restar del stock.
 * @param {string} nombre - El nombre de la materia prima.
 * @param {string} fecha - La fecha de la actualización.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en el resultado de la actualización del stock.
 */
exports.updateStock = (id, cantidad, nombre, fecha, res) => {

    try {
        const updateOrigenQuery = `UPDATE materia_prima SET stock = stock - ? WHERE id = ?`;
        conexion.query(updateOrigenQuery, [cantidad, id]);

        let datos = insertTablita(cantidad, nombre, fecha);
        if (datos != null) {
            conexion.commit();
            return res.status(201).json('Stock actualizado correctamente.');
        }
    } catch (error) {
        conexion.rollback();
        return res.status(404).json({ error: 'Error al actulizar el Stock.' });
    }
};

/**
 * Registra una actualización de stock de una materia prima en la tabla "enproduccion".
 * @param {number} cantidad - La cantidad a restar del stock.
 * @param {string} nombre - El nombre de la materia prima.
 * @param {string} fecha - La fecha de la actualización.
 * @returns {Promise} Una promesa que resuelve en el resultado de la inserción en la tabla "enproduccion".
 */
function insertTablita(cantidad, nombre, fecha) {
    return new Promise((resolve, reject) => {
        let sql = 'INSERT INTO enproduccion (nombre, stock, fecha) VALUES (?, ?, ?)';
        conexion.query(sql, [nombre, cantidad, fecha], (err, resultados) => {
            try {
                if (err)
                    return;
                if (resultados.affectedRows > 0)
                    return resolve(resultados);
                return resolve(null);
            } catch (error) {
                return res.status(500).json({ error: "Error de conexion" });
            }
        });
    });
}

/**
 * Obtiene las actualizaciones de stock de materias primas realizadas en un rango de fechas.
 * @param {string} min - La fecha mínima del rango.
 * @param {string} max - La fecha máxima del rango.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en una matriz de actualizaciones de stock o nulo si no se encontraron actualizaciones.
 */
exports.getProduccionFecha = ((min, max, res) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(nombre) as total, nombre, stock, fecha FROM enproduccion WHERE fecha BETWEEN ? AND ? GROUP BY nombre, fecha, stock ORDER BY fecha';
        conexion.query(sql, [min, max], (err, resultados) => {
            try {
                if (err)
                    return res.status(404).json({ error: 'Error al obtener las ordenes en produccion' });
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
 * Obtiene el stock de una materia prima por su ID.
 * @param {number} id - El ID de la materia prima.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en el stock de la materia prima o nulo si no se encontró la materia prima.
 */
exports.getStockMP = (id, res) => {
    return new Promise((resolve, reject) => {

        const sql = `SELECT stock FROM materia_prima WHERE id = ?`;
        conexion.query(sql, [id], (err, resultados) => {
            if (err) {
                return res.status(404).json({ error: 'Error al obtener cantidad de stock' });
            }
            if (resultados.length > 0) {
                return resolve(resultados);
            }
            return resolve(null);
        });
    });
};

/**
 * Elimina una materia prima por su ID.
 * @param {number} id - El ID de la materia prima a eliminar.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en el resultado de la eliminación de la materia prima.
 */
exports.deleteMP = ((id, res) => {
    return new Promise((resolve, reject) => {
        let sql = 'DELETE FROM materia_prima WHERE id = ?';
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

/**
 * Actualiza una materia prima por su ID.
 * @param {string} nombre - El nombre de la materia prima.
 * @param {number} precio - El precio de la materia prima.
 * @param {number} stock - El stock de la materia prima.
 * @param {number} id - El ID de la materia prima a actualizar.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en el resultado de la actualización de la materia prima.
 */
exports.updateMP = ((nombre, precio, stock, id, res) => {
    return new Promise((resolve, reject) => {
        let sql = 'UPDATE materia_prima SET nombre=?, precio=? ,stock=? WHERE id=?';
        conexion.query(sql, [nombre, precio, stock, id], (err, resultados) => {
            try {
                if (err)
                    return res.status(404).json({ error: 'Error al edtiar' });
                if (resultados.affectedRows > 0)
                    return resolve(resultados);
                return resolve(null);
            } catch (error) {
                return res.status(500).json({ error: "Error de conexion" });
            }
        });
    });
});