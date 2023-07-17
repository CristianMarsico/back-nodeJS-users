// const conexion = require('../database/bd.js')

// exports.insertUser = (async (req, res) => {

//     try {

//         conexion.query('SELECT * FROM usuario_cice', async (error, results) => {
//             if (error == null) {
//                 console.log(errir)
//                 return res.status(403).json({ error: "usuario o password incorrecto" })
//             }

//             return results;
//         })

//     } catch (e) {
//         console.log(e)
//     }

// })