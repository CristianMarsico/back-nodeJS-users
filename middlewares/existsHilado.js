"use strict";

const { existsHilado } = require('../model/hilado_model.js');

exports.existsHilado = (async (req, res, next) => {

    let producto_terminado = req.body.producto_terminado;
    let color = req.body.color;
    try {
        let productoExistente = await existsHilado(producto_terminado, color, res);
        let existe = productoExistente[0].count > 0;
        if (!existe)
            return next();
        return res.status(404).json({ error: 'El hilado existe en la base de datos' });

    } catch (e) {
        console.log("error");
    }

});