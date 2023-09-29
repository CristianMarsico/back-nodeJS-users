"use strict";
exports.getAllClientes = (conexion, res) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM cliente ORDER BY nombre ASC';
        conexion.query(sql, (err, resultados) => {
            if (err)
                return res.status(404).json({ error: 'Error al obtener los clientes' });

            if (resultados.length > 0)
                return resolve(resultados);

            resolve(null);
        });
    });
};


exports.updateCliente = ((direccion, email, telefono, id, conexion, res) => {
    return new Promise((resolve, reject) => {
        let sql = 'UPDATE cliente SET direccion=?, email=? ,telefono=? WHERE id_cliente=?';
        conexion.query(sql, [direccion, email, telefono, id], (err, resultados) => {
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
