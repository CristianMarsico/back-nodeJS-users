"use strict";
const conexion = require('../database/bd.js');
const { getCompraFecha } = require('../model/compra_model.js');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const os = require('os');

exports.reporte = (async (req, res) => {

    const { fechaMin } = req.params;
    const { fechaMax } = req.params;
    try {
        // const fechaMin = req.body.fechaMin;
        // const fechaMax = req.body.fechaMax;

        console.log(fechaMin)
        console.log(fechaMax)

        let respuesta = await getCompraFecha(fechaMin, fechaMax, conexion, res);
        if (respuesta != null) {
            generarInforme(respuesta, fechaMin, fechaMax);
            return res.status(200).json("informe de compras ha sido descargado");
        } else {
            return res.status(404).json({ error: 'No hay compras en esa fecha' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error de servidor' });
    }

});

function generarInforme(compras, fechaMin, fechaMax) {

    const doc = new PDFDocument();
    const desktopPath = path.join(os.homedir(), 'Desktop');

    doc.pipe(fs.createWriteStream(`${desktopPath}/reporte Compras Mes ${fechaMin}.pdf`));
    doc.fontSize(18).text('Informe de Compras', { align: 'center' });
    doc.fontSize(14).text(`Del ${fechaMin} al ${fechaMax}`, { align: 'center', margin: [0, 10] });
    doc.moveDown();

    let total = 0;
    compras.forEach((compra) => {

        doc.text(`CANTIDAD: ${compra.total} - MATERIA PRIMA: ${compra.producto} - FECHA: ${compra.fecha} - CANTIDAD: ${compra.total_cantidad} - TOTAL: ${compra.total_compra}`);
        total += compra.total_compra;
        doc.moveDown();
    });
    doc.fontSize(14).text(`El total en compras fue de: $ ${total}`);
    doc.moveDown();
    doc.end();
}


