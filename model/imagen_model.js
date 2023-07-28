"use strict";
// exports.addImagen = (IMG, conexion, res) => {

//     // exports.addHilado = (producto_terminado, stock_loberia, stock_buenosAires, precio_venta_mayorista,
//     //     precio_venta_minorista, descripcion, tipo, nombre, imagen, conexion, res) => {

//     conexion.query('INSERT INTO imagen SET ?', IMG, (err, result) => {
//         try {
//             if (err)
//                 return res.status(404).json('Error al agregar la imagen:');
//             return res.status(201).json(`imagen agregada exitosamente! - id: ${result.insertId}`);
//         } catch (error) {
//             return res.status(500).json("Error de conexion");
//         }
//     });
// };


exports.getAll = (conexion, res) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT h.producto_terminado, i.ruta_archivo, h.descripcion, h.id, i.id_imagen FROM imagen i JOIN hilado h ON i.producto_id = h.id';
        conexion.query(sql, (err, resultados) => {
            if (err) {
                return res.status(404).json({ error: 'Error al obtener imagen' });
            }
            if (resultados.length > 0) {
                return resolve(resultados);
            }
            resolve(null);
        });
    });
};