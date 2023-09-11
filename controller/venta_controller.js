"use strict";
const conexion = require('../database/bd.js');
const { getCantidadStockCiudad, getPrecioComercial } = require('../model/hilado_model.js');
const { addVenta } = require('../model/venta_model.js');

exports.venta = (async (req, res) => {
    try {
        const VENTA = {
            producto_id: req.body.producto_id,
            nombre_prod: req.body.nombre_prod,
            color: req.body.color,
            cantidad_vendida: req.body.cantidad_vendida,
            precio: 0,
            stock_origen: req.body.origen.toLowerCase(),
            tipo_venta: req.body.tipo_venta.toLowerCase(), //TIPO DE CONSUMIDOR
            fecha: req.body.fecha,
            cliente: req.body.cliente
        }
        let cantidad = await getCantidadStockCiudad(VENTA.producto_id, VENTA.stock_origen, conexion, res);

        // Verificar la disponibilidad en el stock según el origen
        const stockDisponible = cantidad[0].stock >= VENTA.cantidad_vendida;

        if (!stockDisponible)
            return res.status(404).json({ error: `No hay suficiente stock disponible. Dispone de: ${cantidad[0].stock}` });
        else {
            if (VENTA.cantidad_vendida <= 0)
                return res.status(404).json({ error: `Revise el valor ingresado` });

            // Verificar eñ precio dependiendo si es MAYORISTA O MINORISTA
            let precio = await getPrecioComercial(VENTA.producto_id, VENTA.tipo_venta, conexion, res);

            if (precio != null) {
                VENTA.precio = (VENTA.cantidad_vendida * precio[0].precio);
                addVenta(VENTA, conexion, res);
                return;
            }
            return res.status(404).json({ error: `Ocurrió un error al intetar agregar` });
        }
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" });
    }
});