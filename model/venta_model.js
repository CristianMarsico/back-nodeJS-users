"use strict";
const { conexion } = require('../database/bd2.js');

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

//Retorna el resultados con las compras realizadas en una fecha dada.
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
