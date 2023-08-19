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

        const fechaActual = new Date();
        const formattedFechaActual = fechaActual.toISOString().split('T')[0];
        if (COMPRA.fecha > formattedFechaActual)
            return res.status(404).json({ error: 'Revise la fecha. No puede registrar compras futuras' });
        addCompra(COMPRA, conexion, res);
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});