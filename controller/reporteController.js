"use strict";
const conexion = require('../database/bd.js');
const { getCompraFecha } = require('../model/compra_model.js');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const { WritableStream, ReadableStream } = require('memory-streams');


exports.reporte = (async (req, res) => {
    const { fechaMin } = req.params;
    const { fechaMax } = req.params;

    try {
        let respuesta = await getCompraFecha(fechaMin, fechaMax, conexion, res);
        if (respuesta != null) {
            const outputPath = 'reporteCompra.pdf';
            const doc = new PDFDocument();
            const stream = fs.createWriteStream(outputPath);
            doc.pipe(stream);
            doc.fontSize(18).text('Informe de Compras', { align: 'center' });
            doc.fontSize(14).text(`Del ${fechaMin} al ${fechaMax}`, { align: 'center', margin: [0, 10] });
            doc.moveDown();

            let total = 0;
            respuesta.forEach((compra) => {
                const fechaFormateada = compra.fecha.toLocaleDateString('es-AR');
                doc.text(`FECHA: ${fechaFormateada}`);
                doc.text(`COMPRAS REALIZADAS: ${compra.total}`);
                doc.text(`MATERIA PRIMA: ${compra.producto}`);
                doc.text(`CANTIDAD COMPRADA: ${compra.total_cantidad} - COSTO UNITARIO: $${compra.precio_unitario}`);
                doc.text(`TOTAL: $${compra.total_compra}`);
                total += compra.total_compra;
                doc.moveDown();
            });
            doc.fontSize(14).text(`EL TOTAL: e/ ${fechaMin} y ${fechaMax} es de: $${total}`);
            doc.moveDown();
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

        } else {
            return res.status(404).json({ error: 'No hay compras en esa fecha' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error de servidor' });
    }

});
