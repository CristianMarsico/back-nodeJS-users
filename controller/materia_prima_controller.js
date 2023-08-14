"use strict";
const conexion = require('../database/bd.js');
const { updatePrecio,
    updateStock,
    getMPByName,
    getAllMP,
    getStockMP,
    deleteMP,
    updateMP } = require('../model/materiaPrima_model.js');

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
        return res.status(500).json("Error de servidor");
    }
});

exports.getMPByName = (async (req, res) => {
    try {
        let response = await getMPByName(conexion, res);
        if (response != null)
            return res.status(200).json({ response });
        return res.status(404).json({ error: "No hay Materia Prima en la base de datos" });

    } catch (error) {
        return res.status(500).json("Error de servidor");
    }
});

exports.getAllMP = (async (req, res) => {
    try {
        let response = await getAllMP(conexion, res);
        if (response != null)
            return res.status(200).json({ response });
        return res.status(404).json({ error: "No hay Materia Prima en la base de datos" });

    } catch (error) {
        return res.status(500).json("Error de servidor");
    }
});


exports.updateStock = (async (req, res) => {
    try {
        const { id } = req.params;
        const cantidad = req.body.cantidad;
        const nombre = req.body.nombre;

        if (cantidad <= 0)
            return res.status(404).json({ error: "Verifique el valor ingresado" });

        let total = await getStockMP(id, conexion, res);
        let stockDisponible = total[0].stock
        if (stockDisponible == 0)
            return res.status(404).json({ error: "No dispone de stock" });

        if (stockDisponible >= cantidad)
            updateStock(id, cantidad, nombre, conexion, res);
        else
            return res.status(404).json({ error: "No dispone esa cantidad" });

    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});


exports.deleteMP = (async (req, res) => {

    const { id } = req.params;
    try {
        let response = await deleteMP(id, conexion, res)
        if (response != null)
            return res.status(200).json(`Materia prima borrada con éxito`);
        else
            res.status(404).json({ error: "No se ha podido eliminar la materia prima" })
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
})

exports.updateMP = (async (req, res) => {

    const { id } = req.params;
    const nombre = req.body.nombre;
    const stock = req.body.stock;
    const precio = req.body.precio;

    console.log(id)
    console.log(nombre)
    console.log(stock)
    console.log(precio)
    try {
        let response = await updateMP(nombre, stock, precio, id, conexion, res)
        if (response != null)
            return res.status(200).json(`Materia prima actualizada con éxito`);
        else
            res.status(404).json({ error: "No se ha podido actualizar la materia prima" })
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
})

