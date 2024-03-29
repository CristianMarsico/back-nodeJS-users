"use strict";
const { getCantidadStockCiudad, getPrecioComercial } = require('../model/hilado_model.js');
const { addVenta, getAllVentas } = require('../model/venta_model.js');

/**
 * Registra una venta en el sistema y actualiza el inventario según la cantidad vendida y el origen del stock.
 * @param {object} req - El objeto de solicitud HTTP que debe contener los detalles de la venta, incluyendo producto, cantidad, origen, tipo de venta y más.
 * @param {object} res - El objeto de respuesta HTTP que devolverá el resultado de la operación.
 */
exports.venta = (async (req, res) => {
    try {
        const VENTA = {
            producto_id: req.body.producto_id,
            nombre_prod: req.body.nombre_prod.toLowerCase(),
            color: req.body.color.toLowerCase(),
            cantidad_vendida: req.body.cantidad_vendida,
            precio: 0,
            stock_origen: req.body.origen.toLowerCase(),
            tipo_venta: req.body.tipo_venta.toLowerCase(),
            fecha: req.body.fecha,
            cliente: req.body.cliente.toLowerCase(),
            medio_pago: req.body.medio_pago.toLowerCase(),
            email: req.body.email.toLowerCase(),
            telefono: req.body.telefono.toLowerCase(),
            direccion: req.body.direccion.toLowerCase(),
        }

        let cantidad = await getCantidadStockCiudad(VENTA.producto_id, VENTA.stock_origen, res);

        // Verificar la disponibilidad en el stock según el origen
        const stockDisponible = cantidad[0].stock >= VENTA.cantidad_vendida;

        if (!stockDisponible)
            return res.status(404).json({ error: `No hay suficiente stock disponible. Dispone de: ${cantidad[0].stock}` });
        else {
            if (VENTA.cantidad_vendida <= 0)
                return res.status(404).json({ error: `Revise el valor ingresado` });

            // Verificar eñ precio dependiendo si es MAYORISTA O MINORISTA
            let precio = await getPrecioComercial(VENTA.producto_id, VENTA.tipo_venta, res);

            if (precio != null) {
                VENTA.precio = (VENTA.cantidad_vendida * precio[0].precio);
                addVenta(VENTA, res);
                return;
            }
            return res.status(404).json({ error: `Ocurrió un error al intetar agregar` });
        }
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});

/**
 * Obtiene una lista de todas las ventas registradas en el sistema.
 * @param {object} req - El objeto de solicitud HTTP (no requiere parámetros).
 * @param {object} res - El objeto de respuesta HTTP que devolverá la lista de ventas o un mensaje de error.
 */
exports.getAll = (async (req, res) => {
    try {

        let response = await getAllVentas(res);
        if (response != null)
            return res.status(200).json({ response });
        return res.status(404).json({ error: "No hay ventas registradas" });
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});