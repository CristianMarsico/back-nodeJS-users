"use strict";
const conexion = require('../database/bd.js');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const { WritableStream, ReadableStream } = require('memory-streams');
const { getVentaFecha } = require('../model/venta_model.js');

exports.reporteVenta = (async (req, res) => {
    const { fechaMin } = req.params;
    const { fechaMax } = req.params;
    try {
        let respuesta = await getVentaFecha(fechaMin, fechaMax, conexion, res);
        const outputPath = 'reporteVenta.pdf';
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(outputPath);

        doc.pipe(stream);
        doc.fontSize(18).text('Informe de Ventas', { align: 'center' });
        doc.fontSize(14).text(`Del ${fechaMin} al ${fechaMax}`, { align: 'center', margin: [0, 10] });
        doc.moveDown();
        respuesta.forEach((venta) => {
            const fechaFormateada = venta.fecha.toLocaleDateString('es-AR');
            doc.text(`FECHA: ${fechaFormateada}`);
            doc.text(`N° DE VENTAS: ${venta.total}`);
            doc.text(`PRODUCTO: ${venta.nombre_prod} - ${venta.color}`);
            doc.text(`CANTIDAD VENDIDA: ${venta.cantidad}`);
            doc.text(`PRECIO: ${venta.precio}`);
            doc.text(`CLIENTE / EMPRESA: ${venta.cliente}`);
            doc.text(`CONSUMIDOR: ${venta.tipo_venta}`);
            doc.text('---');
            doc.moveDown();
        });
        doc.end();

        stream.on('finish', () => {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=reporteVenta.pdf');
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