"use strict";
const conexion = require('../database/bd.js');
const { compra } = require('../model/compra_model.js');

exports.compra = ((req, res) => {

    const COMPRA = {
        producto: req.body.producto.toLowerCase(),
        cantidad: req.body.cantidad,
        precio_unitario: req.body.precio_unitario,
        total: req.body.precio_unitario * req.body.cantidad,
        fecha: req.body.fecha,  // Asegúrate de usar el formato 'YYYY-MM-DD'
    };
    compra(COMPRA, conexion, res);
})