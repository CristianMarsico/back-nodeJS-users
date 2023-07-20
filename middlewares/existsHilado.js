"use strict";

const conexion = require('../database/bd.js');
const { existsHilado } = require('../model/hilado_model.js');

exports.existsHilado = (async (req, res, next) => {

    let producto_id = req.body.producto_id;

    try {
        let productoExistente = await existsHilado(producto_id, conexion, res);
        let existe = productoExistente[0].count > 0;
        if (!existe)
            return res.status(200).json({ message: 'El hilado no existe en la base de datos' });
        return next();

    } catch (e) {
        console.log("error");
    }

});