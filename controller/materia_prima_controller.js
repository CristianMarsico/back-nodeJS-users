"use strict";
const conexion = require('../database/bd.js')

exports.updateStock = (async (req, res) => {

    try {
        const { id, stock } = req.params;
        conexion.query('SELECT stock FROM materia_prima WHERE id = ?', [id], (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                const stockActual = results[0].stock;

                if (stockActual >= stock) {
                    // Stock suficiente, realizar la actualización
                    const nuevoStock = stockActual - stock;

                    conexion.query('UPDATE materia_prima SET stock = ? WHERE id = ?', [nuevoStock, id], (err, results) => {
                        if (err) throw err;
                        return res.status(200).json('Stock actualizado correctamente.');
                    });
                } else {
                    return res.status(200).json(`No hay suficiente stock para realizar el retiro. Ud dispone de ${stockActual}`);
                }
            } else {
                return res.status(404).json('No se encuentra en la base de datos.');
            }
        });
    } catch (e) {
        return res.status(500).json("Error de servidor")
    }

})


exports.updatePrecio = (async (req, res) => {

    try {
        const { id, precio } = req.params;
        if (precio > 0) {
            conexion.query('UPDATE materia_prima SET precio = ? WHERE id = ?', [precio, id], (err, results) => {
                if (err) throw err;
                return res.status(200).json('Precio actualizado correctamente.');
            });
        } else {
            return res.status(404).json('Revise el valor del precio.');
        }

    } catch (e) {
        return res.status(500).json("Error de servidor")
    }

})