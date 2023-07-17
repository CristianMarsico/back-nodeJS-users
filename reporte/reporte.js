const conexion = require('../database/bd.js')
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const os = require('os');

obtenerComprasDelDia();

function obtenerComprasDelDia() {
    const consulta = 'SELECT * FROM compra WHERE DAY(CURDATE()) = 15 and MONTH(fecha)= MONTH(CURDATE()) -1';
    conexion.query(consulta, (err, resultados) => {
        if (err) {
            console.error('Error al obtener las compras: ', err);
            return;
        }
        if (resultados.length > 0) {
            generarInforme(resultados);
        }
    });
}

function generarInforme(compras) {
    const doc = new PDFDocument();
    const fechaHoy = new Date();
    let dia = fechaHoy.getDate();
    let mes = fechaHoy.getMonth() + 1;
    let anio = fechaHoy.getFullYear();
    const desktopPath = path.join(os.homedir(), 'Desktop');

    doc.pipe(fs.createWriteStream(`${desktopPath}/reporte Compras ${dia}-${mes - 1}-${anio}.pdf`));
    doc.fontSize(18).text('Informe de Compras', { align: 'center' });
    doc.fontSize(14).text(`Fecha: Mes ${mes - 1} del ${anio}`, { align: 'center', margin: [0, 10] });

    let total = 0;
    compras.forEach((compra) => {
        doc.text(`Producto: ${compra.producto}`);
        doc.text(`Cantidad: ${compra.cantidad}`);
        doc.text(`Precio Unitario: ${compra.precio_unitario}`);
        total += compra.precio_unitario;
        doc.text(`Total: ${compra.total}`);
        doc.moveDown();
    });
    doc.fontSize(14).text(`El total en compras fue de: $ ${total}`);
    doc.moveDown();
    doc.end();
}


