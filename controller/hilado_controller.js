"use strict";
const conexion = require('../database/bd.js');
// const fs = require('fs');
// const path = require('path');
const { addHilado, getAllHilado } = require('../model/hilado_model.js');

exports.add = ((req, res) => {

    try {

        const HILADO = {
            producto_terminado: req.body.producto_terminado,
            stock_loberia: req.body.stock_loberia,
            stock_buenosAires: req.body.stock_buenosAires,
            precio_venta_mayorista: req.body.precio_venta_mayorista,
            precio_venta_minorista: req.body.precio_venta_minorista,
            nombre: req.file.originalname,
            ruta_archivo: req.file.path,
            descripcion: req.body.descripcion
        }
        console.log(HILADO)
        addHilado(HILADO, conexion, res)
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});

exports.getAll = (async (req, res) => {
    try {

        let response = await getAllHilado(conexion, res);
        if (response != null) {

            // response.map(img => {
            //     fs.writeFileSync(path.join(__dirname, '../dbImages/' + img.id + '.png'), img.imagen)
            // })

            // const imgDB = fs.readdirSync(path.join(__dirname, '../dbImages/'))


            return res.status(200).json({ response });
        }
        return res.status(404).json({ error: "No hay productos en la base de datos" });
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});


