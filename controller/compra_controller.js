"use strict";
const conexion = require('../database/bd.js');
const { addCompra } = require('../model/compra_model.js');

exports.compra = ((req, res) => {
    try {
        const COMPRA = {
            producto: req.body.producto.toLowerCase(),
            cantidad: req.body.cantidad,
            precio_unitario: req.body.precio_unitario,
            total: req.body.precio_unitario * req.body.cantidad,
            fecha: req.body.fecha,  // Asegúrate de usar el formato 'YYYY-MM-DD'
        };
        addCompra(COMPRA, conexion, res);
    } catch (error) {
        return res.status(500).json("Error de servidor");
    }
});