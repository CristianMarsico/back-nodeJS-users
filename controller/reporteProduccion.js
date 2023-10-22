"use strict";

const PDFDocument = require('pdfkit');
const fs = require('fs');
const { WritableStream, ReadableStream } = require('memory-streams');
const { getProduccionFecha } = require('../model/materiaPrima_model.js');

exports.reporteProduccion = (async (req, res) => {
    const { fechaMin } = req.params;
    const { fechaMax } = req.params;
    try {
        let respuesta = await getProduccionFecha(fechaMin, fechaMax, res);
        const outputPath = 'reporte.pdf';
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(outputPath);

        doc.pipe(stream);
        doc.fontSize(18).text('Informe Materia Prima en Producción', { align: 'center' });
        doc.fontSize(14).text(`Del ${fechaMin} al ${fechaMax}`, { align: 'center', margin: [0, 10] });
        doc.moveDown();
        respuesta.forEach((compra) => {
            const fechaFormateada = compra.fecha.toLocaleDateString('es-AR');
            doc.text(`FECHA: ${fechaFormateada}`);
            doc.text(`MATERIA PRIMA: ${compra.nombre}`);
            doc.text(`CANTIDAD ENVIADA A PRODUCCIÓN: ${compra.stock}`);
            doc.text('---');
            doc.moveDown();
        });
        doc.end();

        stream.on('finish', () => {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=reporte.pdf');
            const fileStream = fs.createReadStream(outputPath);
            fileStream.pipe(res);

            // Borrar el archivo después de que se haya enviado con éxito
            fileStream.on('close', () => {
                fs.unlink(outputPath, (err) => {
                    if (err) {
                        console.error('Error al borrar el archivo:', err);
                    }
                });
            });

        });


    } catch (error) {
        res.status(500).json({ error: 'Error de servidor' });
    }
});