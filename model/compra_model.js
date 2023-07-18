"use strict";
exports.compra = ((COMPRA, conexion, res) => {
    // Inserta la compra en la base de datos
    conexion.query('INSERT INTO compra SET ?', COMPRA, (err, result) => {
        if (err)
            return res.status(404).json('Error al agregar la compra:');
        res.status(201).json(`Compra agregada exitosamente! - id : ${result.insertId}`);
    });
});