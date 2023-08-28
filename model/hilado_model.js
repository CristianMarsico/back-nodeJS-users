"use strict";
exports.existsHilado = (producto_terminado, conexion, res) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) AS count FROM hilado WHERE producto_terminado = ?';
        conexion.query(sql, [producto_terminado], (err, resultados) => {
            if (err) {
                return res.status(404).json({ error: 'Error al obtener hilado' });
            }
            if (resultados.length > 0) {
                return resolve(resultados);
            }
            resolve(null);
        });
    });
};

exports.getCantidadStockCiudad = (producto_id, stock_origen, conexion, res) => {
    return new Promise((resolve, reject) => {
        const totaStock = stock_origen === 'stock_loberia' ? 'stock_loberia' : 'stock_buenosAires';
        const sql = `SELECT ${totaStock} AS stock FROM hilado WHERE id = ?`;
        conexion.query(sql, [producto_id], (err, resultados) => {
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

exports.getPrecioComercial = (producto_id, tipo_venta, conexion, res) => {
    return new Promise((resolve, reject) => {
        //CURDATE() -> DIA ACTUAL
        // const consulta = 'SELECT * FROM compra WHERE DAY(CURDATE()) = 17 and MONTH(fecha)= MONTH(CURDATE()) -1';
        const totaStock = tipo_venta === 'precio_venta_mayorista' ? 'precio_venta_mayorista' : 'precio_venta_minorista';
        const sql = `SELECT ${totaStock} AS precio FROM hilado WHERE id = ?`;
        conexion.query(sql, [producto_id], (err, resultados) => {
            try {
                if (err)
                    return res.status(404).json({ error: 'Error al obtener cantidad de stock' });
                if (resultados.length > 0)
                    return resolve(resultados);
                return resolve(null);
            } catch (error) {
                res.status(500).json("Error de conexion");
            }
        });
    });
};
exports.addHilado = (HILADO, conexion, res) => {
    conexion.query('INSERT INTO hilado SET ?', HILADO, (err, result) => {
        try {
            if (err)
                return res.status(404).json('Error al agregar la hilado:');
            return res.status(201).json(`Hilado agregada exitosamente! - id: ${result.insertId}`);
        } catch (error) {
            return res.status(500).json("Error de conexion");
        }
    });
};

exports.getAllHilado = (conexion, res) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM hilado';
        conexion.query(sql, (err, resultados) => {
            if (err) {
                return res.status(404).json({ error: 'Error al obtener hilado' });
            }
            if (resultados.length > 0) {
                return resolve(resultados);
            }
            resolve(null);
        });
    });
};

exports.getHiladoByName = (conexion, res) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, producto_terminado FROM hilado';
        conexion.query(sql, (err, resultados) => {
            if (err) {
                return res.status(404).json({ error: 'Error al obtener hilado' });
            }
            if (resultados.length > 0) {
                return resolve(resultados);
            }
            resolve(null);
        });
    });
};

exports.transferStockBetweenLocations = (id, cantidad_tranferida, origen, destino, conexion, res) => {

    try {
        const updateOrigenQuery = `UPDATE hilado SET ${origen} = ${origen} - ? WHERE id = ?`;
        conexion.query(updateOrigenQuery, [cantidad_tranferida, id]);

        // Sumar la cantidad al destino
        const updateDestinoQuery = `UPDATE hilado SET ${destino} = ${destino} + ? WHERE id = ?`;
        conexion.query(updateDestinoQuery, [cantidad_tranferida, id]);
        conexion.commit();

        return res.status(201).json('Stock actualizado correctamente.');
    } catch (error) {
        conexion.rollback();
        return res.status(404).json({ error: 'Error al actulizar el Stock.' });
    }
};