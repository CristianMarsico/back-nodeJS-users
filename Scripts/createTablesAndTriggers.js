// scripts/createTablesAndTriggers.js
const { queryAsync } = require('../database/bd2.js');
const tables = require('./tables2.js');
const triggers = require('./triggers.js');

async function eliminarTrigger(nombre) {
    const query = `DROP TRIGGER IF EXISTS ${nombre}`;
    await queryAsync(query, `trigger ${nombre} eliminado`)
}

async function createTablesAndTriggers() {

    try {
        for (const trigger of triggers) {
            eliminarTrigger(trigger.name)
                .then(() => {
                    console.log(`Trigger ${trigger.name} eliminado con éxito`);
                })
                .catch((error) => {
                    console.error('Error al eliminar el trigger:', error);
                });
        }

        for (const table of tables) {
            await createTable(table.name, table.definition);
            console.log(`Tabla ${table.name} creada exitosamente.`);
        }

        for (const trigger of triggers) {
            await createTable(trigger.name, trigger.definition);
            console.log(`Trigger ${trigger.name} creado exitosamente.`);
        }

    } catch (error) {
        console.error("Error al crear tablas y triggers:", error);
    }
}

async function createTable(name, definition) {
    const createTableQuery = definition;
    await queryAsync(createTableQuery, `Crear tabla ${name}`);
}




module.exports = {
    createTablesAndTriggers

};