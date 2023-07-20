"use strict";
exports.addVenta = ((VENTA, conexion, res) => {
    conexion.query('INSERT INTO venta SET ?', VENTA, (err, result) => {
        try {
            if (err)
                return res.status(404).json('Error al agregar la venta:');
            return res.status(200).json(`Venta agregada exitosamente! - id : ${result.insertId}`);
        } catch (error) {
            return res.status(500).json("Error de conexion");
        }
    });
});