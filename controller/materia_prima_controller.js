"use strict";
const conexion = require('../database/bd.js');
const { updatePrecio, updateStock } = require('../model/materiaPrima_model.js');

exports.updateStock = ((req, res) => {
    try {
        const { id, stock } = req.params;
        if (stock > 0) {
            updateStock(id, stock, res, conexion);
            return;
        }
        else
            return res.status(404).json('Revise la cantidad del stock.');
    } catch (e) {
        return res.status(500).json("Error de servidor")
    }
});


exports.updatePrecio = ((req, res) => {
    try {
        const { id, precio } = req.params;
        if (precio > 0) {
            updatePrecio(precio, id, res, conexion);
            return;
        }
        else
            return res.status(404).json('Revise el valor del precio.');
    } catch (e) {
        return res.status(500).json("Error de servidor")
    }
});