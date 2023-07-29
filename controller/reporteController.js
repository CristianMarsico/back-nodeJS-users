"use strict";
const conexion = require('../database/bd.js');
const { getCompraFecha } = require('../model/compra_model.js');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const os = require('os');

exports.reporte = (async (req, res) => {
    try {
        const { fecha } = req.params;
        let respuesta = await getCompraFecha(fecha, conexion, res);
        if (respuesta != null && respuesta.length > 0) {
            generarInforme(respuesta, fecha);
            return res.status(200).json({ ok: 'informe de compras ha sido descargado' });
        }
        return res.status(404).json({ error: 'No hay compras en esa fecha' });
    } catch (error) {
        return res.status(500).json({ error: "Error de servidor" })
    }
});

function generarInforme(compras, fecha) {
    const doc = new PDFDocument();
    // const fechaHoy = new Date();
    // let dia = fechaHoy.getDate();
    // let mes = fechaHoy.getMonth() + 1;
    // let anio = fechaHoy.getFullYear();
    const desktopPath = path.join(os.homedir(), 'Desktop');

    // doc.pipe(fs.createWriteStream(`${desktopPath}/reporte Compras ${dia}-${mes - 1}-${anio}.pdf`));
    doc.pipe(fs.createWriteStream(`${desktopPath}/reporte Compras Mes ${fecha}.pdf`));
    doc.fontSize(18).text('Informe de Compras', { align: 'center' });
    // doc.fontSize(14).text(`Fecha: Mes ${mes - 1} del ${anio}`, { align: 'center', margin: [0, 10] });
    doc.fontSize(14).text(`Fecha: Mes ${fecha}`, { align: 'center', margin: [0, 10] });


    let total = 0;
    compras.forEach((compra) => {
        let suma = 0;
        doc.text(`Producto: ${compra.producto}`);
        doc.text(`Cantidad: ${compra.cantidad}`);
        doc.text(`Precio Unitario: ${compra.precio_unitario}`);
        suma = compra.precio_unitario * compra.cantidad;
        total += suma;
        doc.text(`Total: ${suma}`);
        doc.text(`Fecha de compra: ${compra.fecha}`);
        doc.moveDown();
    });
    doc.fontSize(14).text(`El total en compras fue de: $ ${total}`);
    doc.moveDown();
    doc.end();
}


