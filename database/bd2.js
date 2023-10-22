const mysql = require('mysql');
const mysqldump = require('mysqldump');
const fs = require('fs');


const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
};

const conexion = mysql.createConnection(dbConfig);

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