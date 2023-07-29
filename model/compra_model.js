"use strict";
//Agrega la compra a la BD.
exports.addCompra = ((COMPRA, conexion, res) => {
    // Inserta la compra en la base de datos
    conexion.query('INSERT INTO compra SET ?', COMPRA, (err, result) => {
        try {
            if (err)
                return res.status(404).json({ error: 'Error al agregar la compra:' });
            return res.status(201).json(`Compra agregada exitosamente! - id: ${result.insertId}`);
        } catch (error) {
            return res.status(500).json({ error: "Error de conexion" });
        }
    });
});


//Retorna el resultados con las compras realizadas en una fecha dada.
exports.getCompraFecha = ((fecha, conexion, res) => {
    return new Promise((resolve, reject) => {
        //CURDATE() -> DIA ACTUAL
        // const consulta = 'SELECT * FROM compra WHERE DAY(CURDATE()) = 17 and MONTH(fecha)= MONTH(CURDATE()) -1';
        const sql = 'SELECT * FROM compra WHERE MONTH(fecha) = ?';
        conexion.query(sql, [fecha], (err, resultados) => {
            try {
                if (err)
                    return res.status(404).json({ error: 'Error al obtener las compras' });
                if (resultados.length > 0)
                    return resolve(resultados);
                resolve(null);
            } catch (error) {
                res.status(500).json({ error: "Error de conexion" });
            }
        });
    });
});