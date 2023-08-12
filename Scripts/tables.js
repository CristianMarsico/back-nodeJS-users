"use strict";
const conexion = require('../database/bd.js');

const usuario = `
CREATE TABLE IF NOT EXISTS usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  pass VARCHAR(200) NOT NULL,
  usuario VARCHAR(150) NOT NULL,
  email VARCHAR(200) NOT NULL
)
`;

const role = `
CREATE TABLE IF NOT EXISTS role (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(50)
)
`;

const usuario_role = `
CREATE TABLE IF NOT EXISTS usuario_role (
  usuario_id INT,
  rol_id INT,
  PRIMARY KEY (usuario_id, rol_id),
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
  FOREIGN KEY (rol_id) REFERENCES role(id)
)
`;

const materia_Prima = `
CREATE TABLE IF NOT EXISTS materia_prima(
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  stock INT NOT NULL,
  precio DECIMAL(10, 2)
)
`;

const compra = `
CREATE TABLE IF NOT EXISTS compra(
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto VARCHAR(50) NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  fecha DATE NOT NULL
  )
`;

const hilado = `
    CREATE TABLE IF NOT EXISTS hilado (
      id INT AUTO_INCREMENT PRIMARY KEY,
      producto_terminado VARCHAR(50) NOT NULL,
      stock_loberia INT NOT NULL,
      stock_buenosAires INT NOT NULL,
      precio_venta_mayorista DECIMAL(10, 2) NOT NULL,
      precio_venta_minorista DECIMAL(10, 2) NOT NULL,
      nombre VARCHAR(100) NOT NULL,
      ruta_archivo VARCHAR(255) NOT NULL,
      descripcion VARCHAR(200)
    )
  `;

const imagen = `
    CREATE TABLE IF NOT EXISTS imagen (
       id_imagen INT AUTO_INCREMENT PRIMARY KEY,
       nombre VARCHAR(100) NOT NULL,
       ruta_archivo VARCHAR(255) NOT NULL,
       producto_id INT,
      FOREIGN KEY (producto_id) REFERENCES hilado(id)
    )
  `;

const venta = `
  CREATE TABLE IF NOT EXISTS venta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    cantidad_vendida INT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock_origen ENUM('stock_loberia', 'stock_buenosAires') NOT NULL,
    tipo_venta ENUM('precio_venta_mayorista', 'precio_venta_minorista') NOT NULL,
    FOREIGN KEY (producto_id) REFERENCES hilado(id)
  )
`;

const tr_compra_actualizarMateriaPrima = `
CREATE OR REPLACE TRIGGER tr_compra_actualizarMateriaPrima 
AFTER INSERT ON compra
FOR EACH ROW
BEGIN
  DECLARE cantidad INT;
  DECLARE stock_actual INT;
  
  SELECT NEW.cantidad INTO cantidad;
  
  SELECT stock INTO stock_actual
  FROM materia_prima
  WHERE nombre = LOWER(NEW.producto);
  
  IF stock_actual IS NULL THEN
    -- La materia prima no existe, se debe agregar
    INSERT INTO materia_prima (nombre, stock, precio)
    VALUES (LOWER(NEW.producto), cantidad, NEW.precio_unitario);
    
  ELSE
    -- La materia prima existe, se debe actualizar el stock
    UPDATE materia_prima
    SET stock = stock + cantidad
    WHERE nombre = LOWER(NEW.producto);
    
  END IF;
END;
;
`;

const tr_descontar_stock_hilado = `
CREATE OR REPLACE TRIGGER tr_descontar_stock_hilado 
AFTER INSERT ON venta
FOR EACH ROW
BEGIN
    IF NEW.stock_origen = 'stock_loberia' THEN
        UPDATE hilado
        SET stock_loberia = stock_loberia - NEW.cantidad_vendida
        WHERE id = NEW.producto_id;
    ELSEIF NEW.stock_origen = 'stock_buenosAires' THEN
        UPDATE hilado
        SET stock_buenosAires = stock_buenosAires - NEW.cantidad_vendida
        WHERE id = NEW.producto_id;
    END IF;
END;
`;
const tr_insertar_imagen = `
  CREATE OR REPLACE TRIGGER tr_insertar_imagen
  AFTER INSERT ON hilado
  FOR EACH ROW
  BEGIN
      INSERT INTO imagen(nombre, ruta_archivo, producto_id)
  VALUES(NEW.nombre, NEW.ruta_archivo, NEW.id);
  END;
`;


// const tr_mp_cambiarNombreCompra = `
//   CREATE OR REPLACE TRIGGER tr_mp_cambiarNombreCompra
//  AFTER UPDATE ON materia_prima
// FOR EACH ROW
// BEGIN
//   UPDATE compra
//   SET producto = NEW.nombre
//   WHERE materia_prima_id = NEW.id;
// END;
// `;
createTablesAndTriggers();
existsRoleInDataBase();

function createTablesAndTriggers() {
  //CREACION DE TABLAS
  load(usuario, "USUARIO");
  load(role, "ROL");
  load(usuario_role, "USUARIO_ROL");
  load(materia_Prima, "MATERIA PRIMA");
  load(compra, "COMPRA");
  load(hilado, "HILADO");
  load(venta, "VENTA");
  load(imagen, "IMAGEN");

  //CREACION DE TRIGGERS
  load(tr_compra_actualizarMateriaPrima, "TR_ACTUALIZAR_MATERIA_PRIMA");
  load(tr_descontar_stock_hilado, "TR_DESCONTAR_STOCK_HILADO");
  load(tr_insertar_imagen, "TR_INSERTAR_IMAGEN");
  // load(tr_mp_cambiarNombreCompra, "TR_CAMBIAR_NOMBRE_COMPRA");

}

function load(tabla, nombre) {
  conexion.query(tabla, (error, results) => {
    if (error) throw error;
    console.log(`Tabla ${nombre} ha sido creada exitosamente.`);
  });
}

function existsRoleInDataBase() {
  // Consulta para verificar si existen datos en la tabla role
  const cantidad = 'SELECT COUNT(*) AS count FROM role';

  // Ejecuta la consulta
  conexion.query(cantidad, (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      // conexion.end();
      return;
    }

    const count = results[0].count;
    if (count > 0) {
      console.log('La tabla role ya contiene datos.');
      // conexion.end();
      return;
    }
    insertRole();
    // conexion.end();
  });
}

// Carga de Roles predeterminada 
function insertRole() {
  const roles = [
    { tipo: 'super_admin' },
    { tipo: 'admin' },
    { tipo: 'default' }
    // Agrega más datos según tus necesidades
  ];

  // Consulta SQL para insertar los datos
  const query = 'INSERT INTO role (tipo) VALUES ?';

  // Ejecutar la consulta con los datos
  conexion.query(query, [roles.map(dato => [dato.tipo])], (error, results) => {
    if (error) {
      console.error('Error al insertar datos: ', error);
    } else {
      console.log('Datos insertados correctamente');
    }
    //Cerrar la conexión
    // conexion.end();
  });
}
