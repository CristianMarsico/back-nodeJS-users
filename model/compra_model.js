"use strict";

const { conexion } = require('../database/bd2.js');
//Agrega la compra a la BD.
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

//Retorna el resultados con las compras realizadas en una fecha dada.
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