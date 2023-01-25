"use strict";
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const conexion = require('../database/bd.js')
const { generateToken, generateRefreshToken } = require('../utils/tokenManager.js');



//EXPORTO LOS VALORES AL ROUTER
exports.register = (async (req, res) => {

    try {
        const name = req.body.name
        const user = req.body.user
        const pass = req.body.pass

        let passHash = await bcrypt.hash(pass, 8)

        conexion.query('INSERT INTO users (user,name,pass) VALUES (?, ? ,?)', [user, name, passHash], (error, results) => {
            if (error) {
                return res.json(error)
            }

            return res.status(201).json(results);
        })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Error de servidor" })
    }
})

exports.login = (async (req, res) => {

    try {
        const user = req.body.user
        const pass = req.body.pass

        conexion.query('SELECT * FROM users WHERE user = ?', [user], async (error, results) => {

            if (results.length == 0 || ! await bcrypt.compare(pass, results[0].pass)) {
                if (error == null) {
                    return res.status(403).json({ error: "usuario o password incorrecto" })
                }
            }
            else {

                let id = results[0].id
                let user = results[0].user
                let name = results[0].name

                //GENERAR TOKEN

                const { token, tiempoVidaToken } = generateToken(id, user, name)


                generateRefreshToken(id, user, name, res)



                return res.json({ token, tiempoVidaToken })
            }
        })


    } catch (e) {
        console.log(e)
        return res.status(500).json({ error: "Error de servidor" })
    }



})

exports.info = ((req, res) => {
    let id = req.new_id

    console.log(id)

    let sql = 'SELECT * FROM users WHERE id = ?'
    conexion.query(sql, [id], (err, results) => {
        try {

            if (err) { // un error indica que hubo problemas con la consulta

                return res.status(500).json({
                    error: 'Server error'
                });
            }
            if (results.length === 0) { // Si el usuario no existe
                throw new Error("No existe usuario con ese id ")
            } else {

                let user = results[0].user
                res.status(200).json({ id, user })

            }

        } catch (e) {
            return res.status(401).json({ error: e.message });
        }
    })
})

exports.refreshToken = (req, res) => {

    try {
        const { token, expiresIn } = generateToken(req.new_id, req.new_user, req.new_name);
        return res.json({ token, expiresIn });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "error de server" });
    }
}
