"use strict";
const { addHilado,
    getAllHilado,
    getHiladoByName,
    transferStockBetweenLocations,
    getCantidadStockCiudad,
    modificarPrecio,
    incrementarMercaderia } = require('../model/hilado_model.js');

/**
* Agrega un nuevo hilado a la base de datos.
* @param {object} HILADO - Los detalles del hilado a agregar.
* @param {object} res - El objeto de respuesta HTTP.
*/
exports.add = ((req, res) => {
    try {
        const HILADO = {
            producto_terminado: req.body.producto_terminado.toLowerCase(),
            color: req.body.color.toLowerCase(),
            stock_loberia: req.body.stock_loberia,
            stock_buenosAires: req.body.stock_buenosAires,
            precio_venta_mayorista: req.body.precio_venta_mayorista,
            precio_venta_minorista: req.body.precio_venta_minorista
        }
        addHilado(HILADO, res)
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});

/**
 * Obtiene todos los hilados registrados en la base de datos.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en una matriz de hilados o nulo si no se encuentran registros.
 */
exports.getAll = (async (req, res) => {
    try {

        let response = await getAllHilado(res);
        if (response != null)
            return res.status(200).json({ response });
        return res.status(404).json({ error: "No hay productos en la base de datos" });
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});

/**
 * Obtiene un hilado por su nombre.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en el hilado con el nombre especificado o nulo si no se encuentra el registro.
 */
exports.getHiladoByName = (async (req, res) => {
    try {

        let response = await getHiladoByName(res);
        if (response != null)
            return res.status(200).json({ response });
        return res.status(404).json({ error: "No hay productos en la base de datos" });
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});

/**
 * Transfiere stock entre dos ubicaciones de un hilado específico.
 * @param {number} id - ID del hilado.
 * @param {number} cantidad_tranferida - Cantidad a transferir.
 * @param {string} origen - Ubicación de origen.
 * @param {string} destino - Ubicación de destino.
 * @param {object} res - El objeto de respuesta HTTP.
 */
exports.transferStockBetweenLocations = (async (req, res) => {
    try {
        const { id } = req.params;
        const cantidad_tranferida = req.body.cantidad_tranferida;
        const origen = req.body.origen;
        const destino = req.body.destino;
        if (cantidad_tranferida <= 0)
            return res.status(404).json({ error: "Verifique el valor ingresado" });

        let total = await getCantidadStockCiudad(id, origen, res);
        let stockDisponible = total[0].stock
        if (stockDisponible == 0)
            return res.status(404).json({ error: "No dispone de stock" });

        if (stockDisponible >= cantidad_tranferida)
            transferStockBetweenLocations(id, cantidad_tranferida, origen, destino, res);
        else
            return res.status(404).json({ error: "No dispone esa cantidad" });

    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});

/**
 * Modifica el precio de un hilado para un tipo de consumidor específico.
 * @param {number} id - ID del hilado.
 * @param {number} monto - Nuevo precio.
 * @param {string} tipo_consumidor - Tipo de consumidor para el que se modifica el precio.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en los resultados de la modificación o nulo si no se encontró el registro.
 */
exports.modificarPrecio = (async (req, res) => {
    try {
        const { id } = req.params;
        const tipoConsumidor = req.body.tipo_consumidor;
        const monto = req.body.total;

        if (monto <= 0)
            return res.status(404).json({ error: "Verifique el valor ingresado" });

        let resultado = await modificarPrecio(id, monto, tipoConsumidor, res);

        if (resultado.affectedRows > 0)
            return res.status(201).json("Valor modificado exitosamente");
        else
            return res.status(404).json({ error: "No se ha podido modificar el valor" });

    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});

/**
 * Incrementa la mercadería de un hilado en una ubicación específica.
 * @param {number} id - ID del hilado.
 * @param {number} stock - Cantidad a incrementar.
 * @param {number} total - Nuevo total de stock.
 * @param {object} res - El objeto de respuesta HTTP.
 * @returns {Promise} Una promesa que resuelve en los resultados de la modificación o nulo si no se encontró el registro.
 */
exports.incrementarMercaderia = (async (req, res) => {
    try {
        const { id } = req.params;
        const stock = req.body.stock;
        const total = req.body.total;

        if (total <= 0)
            return res.status(404).json({ error: "Verifique el valor ingresado" });

        let resultado = await incrementarMercaderia(id, total, stock, res);

        if (resultado.affectedRows > 0)
            return res.status(201).json("Stock modificado exitosamente");
        else
            return res.status(404).json({ error: "No se ha podido modificar el stock" });

    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});