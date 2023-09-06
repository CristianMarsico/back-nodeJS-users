"use strict";

// exports.updatePrecio = ((precio, id, res, conexion) => {
//     try {
//         conexion.query('UPDATE materia_prima SET precio = ? WHERE id = ?', [precio, id], (err, results) => {
//             if (err) throw err;
//             return res.status(200).json('Precio actualizado correctamente.');
//         });
//     } catch (error) {
//         return res.status(500).json({ error: "Error de conexion" });
//     }
// });


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


exports.updateStock = (id, cantidad, nombre, fecha, conexion, res) => {

    try {
        const updateOrigenQuery = `UPDATE materia_prima SET stock = stock - ? WHERE id = ?`;
        conexion.query(updateOrigenQuery, [cantidad, id]);

        let datos = insertTablita(cantidad, nombre, fecha, conexion);
        if (datos != null) {
            conexion.commit();
            return res.status(201).json('Stock actualizado correctamente.');
        }
    } catch (error) {
        conexion.rollback();
        return res.status(404).json({ error: 'Error al actulizar el Stock.' });
    }
};

function insertTablita(cantidad, nombre, fecha, conexion) {
    return new Promise((resolve, reject) => {
        let sql = 'INSERT INTO enproduccion (nombre, stock, fecha) VALUES (?, ?, ?)';
        conexion.query(sql, [nombre, cantidad, fecha], (err, resultados) => {
            try {
                if (err)
                    return;
                if (resultados.affectedRows > 0)
                    return resolve(resultados);
                return resolve(null);
            } catch (error) {
                return res.status(500).json({ error: "Error de conexion" });
            }
        });
    });
}

//Retorna el resultados con las compras realizadas en una fecha dada.
exports.getProduccionFecha = ((min, max, conexion, res) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(nombre) as total, nombre, stock, fecha FROM enproduccion WHERE fecha BETWEEN ? AND ? GROUP BY nombre, fecha, stock ORDER BY fecha';
        conexion.query(sql, [min, max], (err, resultados) => {
            try {
                if (err)
                    return res.status(404).json({ error: 'Error al obtener las ordenes en produccion' });
                if (resultados.length > 0)
                    return resolve(resultados);
                resolve(null);
            } catch (error) {
                res.status(500).json({ error: "Error de conexion" });
            }
        });
    });
});


exports.getStockMP = (id, conexion, res) => {
    return new Promise((resolve, reject) => {

        const sql = `SELECT stock FROM materia_prima WHERE id = ?`;
        conexion.query(sql, [id], (err, resultados) => {
            if (err) {
                return res.status(404).json({ error: 'Error al obtener cantidad de stock' });
            }
            if (resultados.length > 0) {
                return resolve(resultados);
            }
            return resolve(null);
        });
    });
};

exports.deleteMP = ((id, conexion, res) => {
    return new Promise((resolve, reject) => {
        let sql = 'DELETE FROM materia_prima WHERE id = ?';
        conexion.query(sql, [id], (err, resultados) => {
            try {
                if (err)
                    return res.status(404).json({ error: 'Error al eliminar' });
                if (resultados.affectedRows > 0)
                    return resolve(resultados);
                return resolve(null);
            } catch (error) {
                return res.status(500).json({ error: "Error de conexion" });
            }
        });
    });
});


exports.updateMP = ((nombre, precio, stock, id, conexion, res) => {
    return new Promise((resolve, reject) => {
        let sql = 'UPDATE materia_prima SET nombre=?, precio=? ,stock=? WHERE id=?';
        conexion.query(sql, [nombre, precio, stock, id], (err, resultados) => {
            try {
                if (err)
                    return res.status(404).json({ error: 'Error al edtiar' });
                if (resultados.affectedRows > 0)
                    return resolve(resultados);
                return resolve(null);
            } catch (error) {
                return res.status(500).json({ error: "Error de conexion" });
            }
        });
    });
});