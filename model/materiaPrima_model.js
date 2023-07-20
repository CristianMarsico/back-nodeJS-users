"use strict";
exports.updatePrecio = ((precio, id, res, conexion) => {
    try {
        conexion.query('UPDATE materia_prima SET precio = ? WHERE id = ?', [precio, id], (err, results) => {
            if (err) throw err;
            return res.status(200).json('Precio actualizado correctamente.');
        });
    } catch (error) {
        return res.status(500).json("Error de conexion");
    }
});


exports.updateStock = ((id, stock, res, conexion) => {

    conexion.query('SELECT stock FROM materia_prima WHERE id = ?', [id], (err, results) => {
        try {
            if (err) throw err;

            if (results.length > 0) {
                const stockActual = results[0].stock;

                if (stockActual >= stock) {
                    // Stock suficiente, realizar la actualización
                    const nuevoStock = stockActual - stock;

                    conexion.query('UPDATE materia_prima SET stock = ? WHERE id = ?', [nuevoStock, id], (err, results) => {
                        if (err) throw err;
                        return res.status(200).json('Stock actualizado correctamente.');
                    });
                } else {
                    return res.status(200).json(`No hay suficiente stock para realizar el retiro. Ud dispone de ${stockActual}`);
                }
            } else {
                return res.status(404).json('No se encuentra en la base de datos.');
            }
        } catch (error) {
            return res.status(500).json("Error de conexion");
        }
    });
});