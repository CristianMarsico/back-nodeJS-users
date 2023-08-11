"use strict";
const conexion = require('../database/bd.js');
const { updatePrecio, updateStock, getMPByName, getAllMP, getStockMP, deleteMP } = require('../model/materiaPrima_model.js');

// exports.updateStock = ((req, res) => {
//     try {
//         const { id, stock } = req.params;
//         if (stock > 0) {
//             updateStock(id, stock, res, conexion);
//             return;
//         }
//         else
//             return res.status(404).json('Revise la cantidad del stock.');
//     } catch (e) {
//         return res.status(500).json("Error de servidor")
//     }
// });


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

        if (cantidad <= 0)
            return res.status(404).json({ error: "Verifique el valor ingresado" });

        let total = await getStockMP(id, conexion, res);
        let stockDisponible = total[0].stock
        if (stockDisponible == 0)
            return res.status(404).json({ error: "No dispone de stock" });

        if (stockDisponible >= cantidad)
            updateStock(id, cantidad, conexion, res);
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

