"use strict";

const bcrypt = require('bcryptjs');
const conexion = require('../database/bd.js');
const { generateToken, generateRefreshToken } = require('../utils/tokenManager.js');

exports.register = (async (req, res) => {

    try {
        let tipoRol = req.body.tipo;
        let password = req.body.pass;
        let passHash = await bcrypt.hash(password, 8);

        const USUARIO = {
            nombre: req.body.nombre,
            pass: passHash,
            usuario: req.body.usuario,
            email: req.body.email,
        }

        if (!tipoRol) {
            let id_rol = await verificarExistenciaRol("default");

            if (id_rol != null)
                insertInBD(USUARIO, id_rol, res);
            else
                res.status(404).json('No existe ese rol en la base de datos');
        }
        else {
            let id_rol = await verificarExistenciaRol(tipoRol)

            if (id_rol != null)
                insertInBD(USUARIO, id_rol, res);
            else
                res.status(404).json('No existe ese rol en la base de datos');
        }
    }
    catch (error) {
        return res.status(500).json({ error: "Error de servidor" })
    }
})

function insertInBD(USUARIO, id_rol, res) {
    conexion.query('INSERT INTO usuario_1 SET ?', USUARIO, (error, results) => {
        if (error) return res.json(error);

        // Obtiene el ID del usuario recién insertado
        const usuarioId = results.insertId;

        const ROL = {
            usuario_id: usuarioId,
            rol_id: id_rol // ID del rol por defecto
        };
        conexion.query('INSERT INTO usuarios_role_1 SET ?', ROL, (error) => {
            if (error) {
                console.error('Error al insertar el rol del usuario: ', error);
                return;
            }
            res.status(201).json('Registro de usuario creado exitosamente');
        });
    });
}

const verificarExistenciaRol = (rol) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM role_1 WHERE tipo = ?';
        conexion.query(query, [rol], (error, results) => {
            if (error)
                reject(error);
            else {
                if (results.length > 0)
                    resolve(results[0].id);
                else
                    resolve(null);
            }
        });
    });
};

exports.login = (async (req, res) => {

    try {
        const user = req.body.usuario
        const pass = req.body.pass

        conexion.query('SELECT * FROM usuario_1 WHERE usuario = ?', [user], async (error, results) => {
            if (results.length == 0 || ! await bcrypt.compare(pass, results[0].pass)) {
                if (error == null)
                    return res.status(403).json({ error: "usuario o password incorrecto" })
            }

            let { id, usuario, nombre, email } = results[0]

            let rol = []
            const sql = 'SELECT r.tipo FROM usuarios_role_1 ur, role_1 r WHERE ur.rol_id = r.id AND ur.usuario_id = ?';
            conexion.query(sql, [id], (error, r) => {
                if (error)
                    return res.json(error)

                r.forEach(e => {
                    rol.push({ tipo: e.tipo })
                });

                //GENERAR TOKEN
                const { token, tiempoVidaToken } = generateToken(id, usuario, nombre)
                generateRefreshToken(id, usuario, nombre, res)
                return res.json({ token, tiempoVidaToken, id, usuario, nombre, rol, email })
            })
        })
    } catch (e) {
        return res.status(500).json({ error: "Error de servidor" })
    }
})

exports.info = ((req, res) => {
    let id = req.new_id
    let sql = 'SELECT * FROM usuario WHERE id = ?'
    conexion.query(sql, [id], (err, results) => {

        try {
            if (err)  // un error indica que hubo problemas con la consulta
                return res.status(500).json({ error: 'Server error' });
            if (results.length === 0)  // Si el usuario no existe
                throw new Error("No existe usuario con ese id ")
            else {
                let user = results[0].usuario
                let rol = results[0].rol
                res.status(200).json({ id, user, rol })
            }
        } catch (e) {
            return res.status(401).json({ error: e.message });
        }
    })
})

exports.getAllUser = ((req, res) => {
    let id = req.new_id
    let sql = 'SELECT * FROM usuario'
    conexion.query(sql, [id], (err, results) => {

        try {
            if (err)  // un error indica que hubo problemas con la consulta
                return res.status(500).json({ error: 'Server error' });
            if (results.length === 0)  // Si el usuario no existe
                throw new Error("No existen usuarios en la BD ")
            else
                res.status(200).json({ results })
        } catch (e) {
            return res.status(401).json({ error: e.message });
        }
    })
})

exports.refreshToken = (req, res) => {

    try {
        const { token, tiempoVidaToken } = generateToken(req.new_id, req.new_user, req.new_name);
        return res.status(200).json({ token, expiresIn: tiempoVidaToken });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "error de server" });
    }
}

exports.logout = (req, res) => {
    res.clearCookie('refreshToken');
    res.json({ logout: true })
}


exports.deleteUser = (async (req, res) => {

    const { id } = req.params;
    let sql = 'DELETE FROM usuario WHERE id = ?'
    conexion.query(sql, [id], (err, result) => {

        try {

            if (err)  // un error indica que hubo problemas con la consulta
                return res.status(500).json({ error: 'Server error' });
            else
                res.status(200).json({ affectedRows: result.affectedRows })

        } catch (error) {
            return res.status(500).json({ error: "error de server" });
        }
    })
})