"use strict";
const conexion = require('../database/bd.js');

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { getProduccionFecha } = require('../model/materiaPrima_model.js');

exports.reporteProduccion = (async (req, res) => {

    const { fechaMin } = req.params;
    const { fechaMax } = req.params;
    try {
        let respuesta = await getProduccionFecha(fechaMin, fechaMax, conexion, res);
        if (respuesta != null) {
            generarInforme(respuesta, fechaMin, fechaMax);
            return res.status(200).json("informe de mp en produccion ha sido descargado");
        } else {
            return res.status(404).json({ error: 'No hay nada produciendose en esa fecha' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error de servidor' });
    }

});


function generarInforme(compras, fechaMin, fechaMax) {

    const doc = new PDFDocument();
    const desktopPath = path.join(os.homedir(), 'Desktop');

    doc.pipe(fs.createWriteStream(`${desktopPath}/reporte en Producción ${fechaMin} - ${fechaMax}.pdf`));
    doc.fontSize(18).text('Informe Materia Prima en Producción', { align: 'center' });
    doc.fontSize(14).text(`Del ${fechaMin} al ${fechaMax}`, { align: 'center', margin: [0, 10] });
    doc.moveDown();

    compras.forEach((compra) => {
        doc.text(`FECHA: ${compra.fecha}`);
        doc.text(`MATERIA PRIMA: ${compra.nombre} - CANTIDAD ENVIADA A PRODUCCIÓN: ${compra.stock}`);
        doc.moveDown();
    });
    doc.moveDown();
    doc.end();
}
