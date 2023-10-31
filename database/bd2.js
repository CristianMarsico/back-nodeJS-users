/**
 * Módulo para interactuar con la base de datos MySQL y realizar copias de seguridad.
 * @module database
 */
const mysql = require('mysql');
const mysqldump = require('mysqldump');
const fs = require('fs');

// Configuración de la base de datos obtenida desde las variables de entorno
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
};

// Crear una conexión a la base de datos
const conexion = mysql.createConnection(dbConfig);


/**
 * Realiza una consulta a la base de datos de manera asíncrona.
 * @param {string} sql - Consulta SQL a ejecutar.
 * @param {Array} values - Valores de los parámetros en la consulta (opcional).
 * @returns {Promise<Array>} Promesa resuelta con los resultados de la consulta.
 */
async function queryAsync(sql, values = []) {
    return new Promise((resolve, reject) => {
        conexion.query(sql, values, (error, results) => {
            if (error) {
                console.log("entro en el error");
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

/**
 * Intenta crear la base de datos si no existe.
 * @returns {Promise} Promesa resuelta una vez que se intenta crear la base de datos.
 */
async function createDatabaseIfNotExists() {
    return new Promise((resolve, reject) => {
        const databaseName = process.env.DB_DATABASE;
        const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${databaseName}`;
        console.log('Intentando crear la base de datos:', databaseName);
        conexion.query(createDatabaseQuery, (error) => {
            if (error) {
                console.error('Error al crear la base de datos:', error);
                reject(error);
            } else {
                console.log('Base de datos creada exitosamente');
                resolve();
            }
        });
    });
}

/**
 * Conecta a la base de datos configurada.
 * @returns {Promise} Promesa resuelta una vez que se ha establecido la conexión.
 */
async function connectToDatabase() {
    return new Promise((resolve, reject) => {
        // Conecta a la base de datos "hilados"
        conexion.changeUser({ database: process.env.DB_DATABASE }, (error) => {
            if (error) {
                console.error('Error en la conexión a la base de datos:', error);
                reject(error);
            } else {
                console.log('Conexión a la base de datos exitosa');
                resolve();
            }
        });
    });
}


/**
 * Realiza una copia de seguridad de la base de datos en un archivo SQL.
 * @returns {Promise} Promesa resuelta una vez que se ha completado la copia de seguridad.
 */
async function performDatabaseBackup() {
    const backupFileName = 'hilados.sql';

    mysqldump({
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        },
        dumpToFile: backupFileName,
    }).then(() => {
        console.log('Copia de seguridad completa. El archivo se guardó como ' + backupFileName);

        // Opcional: Mover el archivo a un directorio específico
        // fs.renameSync(backupFileName, 'ruta/del/backup/' + backupFileName);
    }).catch((err) => {
        console.error('Error al realizar la copia de seguridad:', err);
    });
}

module.exports = {
    conexion,
    queryAsync,
    createDatabaseIfNotExists,
    connectToDatabase,
    performDatabaseBackup
};