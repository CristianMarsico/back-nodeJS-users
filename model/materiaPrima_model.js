"use strict";
exports.updatePrecio = ((precio, id, res, conexion) => {
    try {
        conexion.query('UPDATE materia_prima SET precio = ? WHERE id = ?', [precio, id], (err, results) => {
            if (err) throw err;
            return res.status(200).json('Precio actualizado correctamente.');
        });
    } catch (error) {
        return res.status(500).json({ error: "Error de conexion" });
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
                    return res.status(200).json({ error: `No hay suficiente stock para realizar el retiro. Ud dispone de ${stockActual}` });
                }
            } else {
                return res.status(404).json({ error: 'No se encuentra en la base de datos.' });
            }
        } catch (error) {
            return res.status(500).json({ error: "Error de conexion" });
        }
    });
});

exports.getMPByName = (conexion, res) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT nombre FROM materia_prima';
        conexion.query(sql, (err, resultados) => {
            if (err) {
                return res.status(404).json({ error: 'Error al obtener las materias primas' });
            }
            if (resultados.length > 0) {
                return resolve(resultados);
            }
            resolve(null);
        });
    });
};

exports.getAllMP = (conexion, res) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM materia_prima';
        conexion.query(sql, (err, resultados) => {
            if (err) {
                return res.status(404).json({ error: 'Error al obtener las materias primas' });
            }
            if (resultados.length > 0) {
                return resolve(resultados);
            }
            resolve(null);
        });
    });
};