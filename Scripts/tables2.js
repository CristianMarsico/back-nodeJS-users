const tables = [
    {
        name: 'usuario',
        definition: `
                    CREATE TABLE IF NOT EXISTS usuario (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        nombre VARCHAR(50) NOT NULL,
                        pass VARCHAR(200) NOT NULL,
                        usuario VARCHAR(150) NOT NULL,
                        email VARCHAR(200) NOT NULL
                    )`
    }
    ,
    {
        name: 'role',
        definition: `
                    CREATE TABLE IF NOT EXISTS role (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        tipo VARCHAR(50)
                    )`
    }
    ,
    {
        name: 'usuario_role',
        definition: `
                    CREATE TABLE IF NOT EXISTS usuario_role (
                        usuario_id INT,
                        rol_id INT,
                        PRIMARY KEY (usuario_id, rol_id),
                        FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
                        FOREIGN KEY (rol_id) REFERENCES role(id)
                    )`
    }
    ,
    {
        name: 'materia_prima',
        definition: `
                    CREATE TABLE IF NOT EXISTS materia_prima(
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        nombre VARCHAR(50) NOT NULL,
                        precio DECIMAL(10, 2) NOT NULL,
                        stock DECIMAL(10, 3) NOT NULL
                    )`
    }
    ,
    {
        name: 'enProduccion',
        definition: `
                    CREATE TABLE IF NOT EXISTS enProduccion(
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        nombre VARCHAR(50) NOT NULL,
                        stock DECIMAL(10, 3) NOT NULL,
                        fecha DATE NOT NULL
                    )`
    }
    ,
    {
        name: 'compra',
        definition: `
                    CREATE TABLE IF NOT EXISTS compra(
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        producto VARCHAR(50) NOT NULL,
                        cantidad DECIMAL(10, 3) NOT NULL,
                        precio_unitario DECIMAL(10, 2) NOT NULL,
                        total DECIMAL(10, 2) NOT NULL,
                        fecha DATE NOT NULL
                    )`
    }
    ,
    {
        name: 'hilado',
        definition: `
                     CREATE TABLE IF NOT EXISTS hilado (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        producto_terminado VARCHAR(150) NOT NULL,
                        color VARCHAR(50) NOT NULL,
                        stock_loberia DECIMAL(10, 3) NOT NULL,
                        stock_buenosAires DECIMAL(10, 3) NOT NULL,
                        precio_venta_mayorista DECIMAL(10, 2) NOT NULL,
                        precio_venta_minorista DECIMAL(10, 2) NOT NULL
                    )`
    }
    ,
    {
        name: 'venta',
        definition: `
                     CREATE TABLE IF NOT EXISTS venta (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        producto_id INT NOT NULL,
                        nombre_prod VARCHAR(100) NOT NULL,
                        color VARCHAR(100) NOT NULL,
                        cantidad_vendida DECIMAL(10, 3) NOT NULL,
                        precio DECIMAL(10, 2) NOT NULL,
                        stock_origen ENUM('stock_loberia', 'stock_buenosAires') NOT NULL,
                        tipo_venta ENUM('precio_venta_mayorista', 'precio_venta_minorista') NOT NULL,
                        fecha DATE NOT NULL,
                        cliente VARCHAR(100) NOT NULL,
                        medio_pago VARCHAR(100) NOT NULL,
                        direccion VARCHAR(100) NULL,
                        email VARCHAR(100) NULL,
                        telefono VARCHAR(100) NULL,
                        FOREIGN KEY (producto_id) REFERENCES hilado(id)
                    )`
    }
    ,
    {
        name: 'cliente',
        definition: `
                     CREATE TABLE IF NOT EXISTS cliente (
                        id_cliente INT AUTO_INCREMENT PRIMARY KEY,
                        nombre VARCHAR(100) NOT NULL,
                        direccion VARCHAR(100) NULL,
                        email VARCHAR(100) NULL,
                        telefono VARCHAR(100) NULL
                    )`
    }


];

module.exports = tables;