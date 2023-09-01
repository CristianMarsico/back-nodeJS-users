"use strict";

const bcrypt = require('bcryptjs');
const conexion = require('../database/bd.js');
const { addRol, verificarExistenciaRol } = require('../model/rol_model.js');
const { getUserByNameAndUserName, addUser, deleteUser, updateUser } = require('../model/userModel.js');
const { generateToken, generateRefreshToken } = require('../utils/tokenManager.js');

exports.register = (async (req, res) => {

    try {
        let tipoRol = req.body.tipo;
        let password = req.body.pass;
        let passHash = await bcrypt.hash(password, 8);

        const USUARIO = {
            nombre: req.body.nombre.toLowerCase(),
            pass: passHash,
            usuario: req.body.usuario.toLowerCase(),
            email: req.body.email,
        }

        if (!tipoRol) {
            let id_rol = await verificarExistenciaRol("default", conexion, res);
            verificarYCrearUsuario(USUARIO, id_rol, conexion, res)
        }
        else {
            let id_rol = await verificarExistenciaRol(tipoRol, conexion, res);
            verificarYCrearUsuario(USUARIO, id_rol, conexion, res)
        }
    }
    catch (error) {
        return res.status(500).json({ error: "Error de servidor" })
    }
})

const verificarYCrearUsuario = (async (USUARIO, id_rol, conexion, res) => {

    if (id_rol != null) {
        let existsUser = await getUserByNameAndUserName(USUARIO.nombre, USUARIO.usuario, conexion, res);
        if (existsUser != null) {
            crearRol(existsUser[0].id, id_rol, conexion, res);
            return res.status(201).json(`Rol creado exitosamente!`);
        } else {
            addUser(USUARIO, conexion, res);
            let user = await getUserByNameAndUserName(USUARIO.nombre, USUARIO.usuario, conexion, res);
            crearRol(user[0].id, id_rol, conexion, res);
            return res.status(201).json(`Usuario y rol creados exitosamente!`);
        }
    }
    else
        res.status(404).json('No existe ese rol en la base de datos');
});

function crearRol(id_user, id_rol, conexion, res) {
    if (id_user && id_rol) {
        const ROL = {
            usuario_id: id_user,
            rol_id: id_rol // ID del rol por defecto
        };
        addRol(ROL, conexion, res);
    }
}

exports.login = (async (req, res) => {

    try {
        const user = req.body.usuario.toLowerCase()
        const pass = req.body.pass

        conexion.query('SELECT * FROM usuario WHERE usuario = ?', [user], async (error, results) => {
            if (results.length == 0 || ! await bcrypt.compare(pass, results[0].pass)) {
                if (error == null)
                    return res.status(404).json({ error: "Usuario o password incorrecto" })
            }

            let { id, usuario, nombre, email } = results[0]

            let rol = []
            const sql = 'SELECT r.tipo FROM usuario_role ur, role r WHERE ur.rol_id = r.id AND ur.usuario_id = ?';
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
                return res.status(500).json({ error: 'Error de servidor' });
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
                return res.status(500).json({ error: 'Error de servidor' });
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
        return res.status(500).json({ error: "Error de server" });
    }
}

exports.logout = (req, res) => {
    res.clearCookie('refreshToken');
    res.json({ logout: true })
}


exports.deleteUser = (async (req, res) => {

    const { id } = req.params;

    try {
        let response = await deleteUser(id, conexion, res)
        console.log(response)
        if (response != null)  // un error indica que hubo problemas con la consulta
            return res.status(200).json(`Usuario borrado con éxito`);
        else
            res.status(404).json({ error: "No se ha podido eliminar el usuario" })
    } catch (error) {
        return res.status(500).json({ error: "Error de server" });
    }
})

exports.updateUser = (async (req, res) => {

    const { id, } = req.params;
    const nombre = req.body.nombre;
    const email = req.body.email;

    console.log(id, nombre, email)
    try {
        let response = await updateUser(id, nombre, email, conexion, res);
        if (response != null)  // un error indica que hubo problemas con la consulta
            return res.status(200).json(`Usuario actualizado con éxito`);
        else
            res.status(404).json({ error: "No se ha podido actualizar el usuario" })
    } catch (error) {
        return res.status(500).json({ error: "Error de server" });
    }
})

