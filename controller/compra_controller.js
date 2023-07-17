"use strict";
const conexion = require('../database/bd.js')

exports.compra = ((req, res) => {

    const COMPRA = {
        producto: req.body.producto,
        cantidad: req.body.cantidad,
        precio_unitario: req.body.precio_unitario,
        total: req.body.total,
        fecha: req.body.fecha,  // Asegúrate de usar el formato 'YYYY-MM-DD'
    };

    console.log(COMPRA.producto)
    console.log(COMPRA.cantidad)
    console.log(COMPRA.precio_unitario)
    console.log(COMPRA.total)
    console.log(COMPRA.fecha)


    // Inserta la compra en la base de datos
    conexion.query('INSERT INTO compra SET ?', COMPRA, (err, result) => {
        if (err) {
            return res.status(404).json('Error al agregar la compra:');
        }
        res.status(201).json(`Compra agregada exitosamente! - id : ${result.insertId}`);
    });
})