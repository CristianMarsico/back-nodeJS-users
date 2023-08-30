"use strict";
const conexion = require('../database/bd.js');
// const fs = require('fs');
// const path = require('path');
const { addHilado, getAllHilado, getHiladoByName, transferStockBetweenLocations, getCantidadStockCiudad } = require('../model/hilado_model.js');

exports.add = ((req, res) => {

    try {

        const HILADO = {
            producto_terminado: req.body.producto_terminado,
            color: req.body.color,
            stock_loberia: req.body.stock_loberia,
            stock_buenosAires: req.body.stock_buenosAires,
            precio_venta_mayorista: req.body.precio_venta_mayorista,
            precio_venta_minorista: req.body.precio_venta_minorista,
            // nombre: req.file.originalname,
            // ruta_archivo: req.file.path,
            // descripcion: req.body.descripcion
        }
        addHilado(HILADO, conexion, res)
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});

exports.getAll = (async (req, res) => {
    try {

        let response = await getAllHilado(conexion, res);
        if (response != null)
            return res.status(200).json({ response });
        return res.status(404).json({ error: "No hay productos en la base de datos" });
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});

exports.getHiladoByName = (async (req, res) => {
    try {

        let response = await getHiladoByName(conexion, res);
        if (response != null)
            return res.status(200).json({ response });
        return res.status(404).json({ error: "No hay productos en la base de datos" });
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});

exports.transferStockBetweenLocations = (async (req, res) => {
    try {
        const { id } = req.params;
        const cantidad_tranferida = req.body.cantidad_tranferida;
        const origen = req.body.origen;
        const destino = req.body.destino;
        if (cantidad_tranferida <= 0)
            return res.status(404).json({ error: "Verifique el valor ingresado" });

        let total = await getCantidadStockCiudad(id, origen, conexion, res);
        let stockDisponible = total[0].stock
        if (stockDisponible == 0)
            return res.status(404).json({ error: "No dispone de stock" });

        if (stockDisponible >= cantidad_tranferida)
            transferStockBetweenLocations(id, cantidad_tranferida, origen, destino, conexion, res);
        else
            return res.status(404).json({ error: "No dispone esa cantidad" });

    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});


