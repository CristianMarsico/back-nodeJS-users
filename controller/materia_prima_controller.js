"use strict";
const {
    updateStock,
    getMPByName,
    getAllMP,
    getStockMP,
    deleteMP,
    updateMP } = require('../model/materiaPrima_model.js');

/**
* Obtiene una materia prima por su nombre.
* @param {object} res - El objeto de respuesta HTTP.
* @returns {Promise} Una promesa que resuelve en la materia prima con el nombre especificado o nulo si no se encuentra el registro.
*/
exports.getMPByName = (async (req, res) => {
    try {
        let response = await getMPByName(res);
        if (response != null)
            return res.status(200).json({ response });
        return res.status(404).json({ error: "No hay Materia Prima en la base de datos" });

    } catch (error) {
        return res.status(500).json("Error de servidor");
    }
});

/**
 * Obtiene todas las materias primas registradas en la base de datos.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en una matriz de materias primas o nulo si no se encuentran registros.
 */
exports.getAllMP = (async (req, res) => {
    try {
        let response = await getAllMP(res);
        if (response != null)
            return res.status(200).json({ response });
        return res.status(404).json({ error: "No hay Materia Prima en la base de datos" });

    } catch (error) {
        return res.status(500).json("Error de servidor");
    }
});

/**
 * Actualiza el stock de una materia prima.
 * @param {number} id - ID de la materia prima.
 * @param {number} cantidad - Cantidad a agregar o restar.
 * @param {string} nombre - Nombre de la materia prima.
 * @param {string} fecha - Fecha de la operación.
 * @param {object} res - El objeto de respuesta HTTP.
 */
exports.updateStock = (async (req, res) => {
    try {
        const { id } = req.params;
        const cantidad = req.body.cantidad;
        const nombre = req.body.nombre.toLowerCase();
        const fecha = req.body.fecha;

        const fechaActual = new Date();
        const formattedFechaActual = fechaActual.toISOString().split('T')[0];
        if (fecha > formattedFechaActual)
            return res.status(404).json({ error: 'Revise la fecha. No puede registar retiros superiores a la fecha actual' });

        if (cantidad <= 0)
            return res.status(404).json({ error: "Verifique el valor ingresado" });

        let total = await getStockMP(id, res);
        let stockDisponible = total[0].stock
        if (stockDisponible == 0)
            return res.status(404).json({ error: "No dispone de stock" });

        if (stockDisponible >= cantidad)
            updateStock(id, cantidad, nombre, fecha, res);
        else
            return res.status(404).json({ error: "No dispone esa cantidad" });

    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});

/**
 * Elimina una materia prima por su ID.
 * @param {number} id - ID de la materia prima.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en los resultados de la eliminación o nulo si no se encontró el registro.
 */
exports.deleteMP = (async (req, res) => {

    const { id } = req.params;
    try {
        let response = await deleteMP(id, res)
        if (response != null)
            return res.status(200).json(`Materia prima borrada con éxito`);
        else
            res.status(404).json({ error: "No se ha podido eliminar la materia prima" })
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
})

/**
 * Actualiza los datos de una materia prima por su ID.
 * @param {string} nombre - Nombre de la materia prima.
 * @param {number} precio - Precio de la materia prima.
 * @param {number} stock - Stock de la materia prima.
 * @param {number} id - ID de la materia prima a actualizar.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en los resultados de la actualización o nulo si no se encontró el registro.
 */
exports.updateMP = (async (req, res) => {

    const { id } = req.params;
    const nombre = req.body.nombre.toLowerCase();
    const stock = req.body.stock;
    const precio = req.body.precio;
    try {
        if (stock <= 0 || precio <= 0)
            return res.status(404).json({ error: "Verifique el valor ingresado" });

        let response = await updateMP(nombre, precio, stock, id, res)
        if (response != null)
            return res.status(200).json(`Materia prima actualizada con éxito`);
        else
            res.status(404).json({ error: "No se ha podido actualizar la materia prima" })
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
})

