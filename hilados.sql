/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: cliente
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `cliente` (
  `id_cliente` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_cliente`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: compra
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `compra` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `producto` varchar(50) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10, 2) NOT NULL,
  `total` decimal(10, 2) NOT NULL,
  `fecha` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 12 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: enproduccion
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `enproduccion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `stock` int(11) NOT NULL,
  `fecha` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 7 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: hilado
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `hilado` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `producto_terminado` varchar(150) NOT NULL,
  `color` varchar(50) NOT NULL,
  `stock_loberia` int(11) NOT NULL,
  `stock_buenosAires` int(11) NOT NULL,
  `precio_venta_mayorista` decimal(10, 2) NOT NULL,
  `precio_venta_minorista` decimal(10, 2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: materia_prima
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `materia_prima` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `precio` decimal(10, 2) NOT NULL,
  `stock` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 9 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: role
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: usuario
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `pass` varchar(200) NOT NULL,
  `usuario` varchar(150) NOT NULL,
  `email` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: usuario_role
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `usuario_role` (
  `usuario_id` int(11) NOT NULL,
  `rol_id` int(11) NOT NULL,
  PRIMARY KEY (`usuario_id`, `rol_id`),
  KEY `rol_id` (`rol_id`),
  CONSTRAINT `usuario_role_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `usuario_role_ibfk_2` FOREIGN KEY (`rol_id`) REFERENCES `role` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: venta
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `venta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `producto_id` int(11) NOT NULL,
  `nombre_prod` varchar(100) NOT NULL,
  `color` varchar(100) NOT NULL,
  `cantidad_vendida` int(11) NOT NULL,
  `precio` decimal(10, 2) NOT NULL,
  `stock_origen` enum('stock_loberia', 'stock_buenosAires') NOT NULL,
  `tipo_venta` enum(
  'precio_venta_mayorista',
  'precio_venta_minorista'
  ) NOT NULL,
  `fecha` date NOT NULL,
  `cliente` varchar(100) NOT NULL,
  `medio_pago` varchar(100) NOT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `hilado` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: cliente
# ------------------------------------------------------------

INSERT INTO
  `cliente` (
    `id_cliente`,
    `nombre`,
    `direccion`,
    `email`,
    `telefono`
  )
VALUES
  (
    1,
    'cliente dia 1',
    'las heras 219',
    'cristian@cristian.com',
    ''
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: compra
# ------------------------------------------------------------

INSERT INTO
  `compra` (
    `id`,
    `producto`,
    `cantidad`,
    `precio_unitario`,
    `total`,
    `fecha`
  )
VALUES
  (
    1,
    'fernet dia 1',
    10,
    5000.00,
    50000.00,
    '2023-10-21'
  );
INSERT INTO
  `compra` (
    `id`,
    `producto`,
    `cantidad`,
    `precio_unitario`,
    `total`,
    `fecha`
  )
VALUES
  (2, 'fernet dia 1', 5, 9000.00, 45000.00, '2023-10-22');
INSERT INTO
  `compra` (
    `id`,
    `producto`,
    `cantidad`,
    `precio_unitario`,
    `total`,
    `fecha`
  )
VALUES
  (3, 'vino dia 1', 60, 900.00, 54000.00, '2023-10-22');
INSERT INTO
  `compra` (
    `id`,
    `producto`,
    `cantidad`,
    `precio_unitario`,
    `total`,
    `fecha`
  )
VALUES
  (4, 'fernet dia 1', 5, 7000.00, 35000.00, '2023-10-21');
INSERT INTO
  `compra` (
    `id`,
    `producto`,
    `cantidad`,
    `precio_unitario`,
    `total`,
    `fecha`
  )
VALUES
  (5, 'vino', 12, 600.00, 7200.00, '2023-10-19');
INSERT INTO
  `compra` (
    `id`,
    `producto`,
    `cantidad`,
    `precio_unitario`,
    `total`,
    `fecha`
  )
VALUES
  (6, 'fernet dia 1', 5, 6900.00, 34500.00, '2023-11-29');
INSERT INTO
  `compra` (
    `id`,
    `producto`,
    `cantidad`,
    `precio_unitario`,
    `total`,
    `fecha`
  )
VALUES
  (
    7,
    'fernet dia 3',
    20,
    3000.00,
    60000.00,
    '2023-11-28'
  );
INSERT INTO
  `compra` (
    `id`,
    `producto`,
    `cantidad`,
    `precio_unitario`,
    `total`,
    `fecha`
  )
VALUES
  (8, 'dia backup', 12, 2.00, 24.00, '2023-12-20');
INSERT INTO
  `compra` (
    `id`,
    `producto`,
    `cantidad`,
    `precio_unitario`,
    `total`,
    `fecha`
  )
VALUES
  (9, 'back up 2', 2, 2.00, 4.00, '2023-12-16');
INSERT INTO
  `compra` (
    `id`,
    `producto`,
    `cantidad`,
    `precio_unitario`,
    `total`,
    `fecha`
  )
VALUES
  (
    10,
    'cerrar sesionmmmmmmmmmmmmmmmmmmmm',
    8,
    2.00,
    16.00,
    '2023-12-20'
  );
INSERT INTO
  `compra` (
    `id`,
    `producto`,
    `cantidad`,
    `precio_unitario`,
    `total`,
    `fecha`
  )
VALUES
  (11, 'backu´´p ', 4, 10.00, 40.00, '2023-12-20');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: enproduccion
# ------------------------------------------------------------

INSERT INTO
  `enproduccion` (`id`, `nombre`, `stock`, `fecha`)
VALUES
  (
    4,
    'cerrar sesionmmmmmmmmmmmmmmmmmmmm',
    8,
    '2023-12-14'
  );
INSERT INTO
  `enproduccion` (`id`, `nombre`, `stock`, `fecha`)
VALUES
  (5, 'dia backup', 1, '2023-12-15');
INSERT INTO
  `enproduccion` (`id`, `nombre`, `stock`, `fecha`)
VALUES
  (6, 'dia backup', 1, '2023-12-21');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: hilado
# ------------------------------------------------------------

INSERT INTO
  `hilado` (
    `id`,
    `producto_terminado`,
    `color`,
    `stock_loberia`,
    `stock_buenosAires`,
    `precio_venta_mayorista`,
    `precio_venta_minorista`
  )
VALUES
  (1, 'pt dia 1', 'negro', 349, 401, 1000.00, 1500.00);
INSERT INTO
  `hilado` (
    `id`,
    `producto_terminado`,
    `color`,
    `stock_loberia`,
    `stock_buenosAires`,
    `precio_venta_mayorista`,
    `precio_venta_minorista`
  )
VALUES
  (2, 'pt2 dia 1', 'gris', 1, 40, 4000.00, 4500.00);
INSERT INTO
  `hilado` (
    `id`,
    `producto_terminado`,
    `color`,
    `stock_loberia`,
    `stock_buenosAires`,
    `precio_venta_mayorista`,
    `precio_venta_minorista`
  )
VALUES
  (3, 'sdadas', 'sdadsa', 3, 4, 344.00, 433.00);
INSERT INTO
  `hilado` (
    `id`,
    `producto_terminado`,
    `color`,
    `stock_loberia`,
    `stock_buenosAires`,
    `precio_venta_mayorista`,
    `precio_venta_minorista`
  )
VALUES
  (
    4,
    'fsdfsdfdsfs',
    'dfsdfsd',
    43,
    34,
    44344.00,
    3434343.00
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: materia_prima
# ------------------------------------------------------------

INSERT INTO
  `materia_prima` (`id`, `nombre`, `precio`, `stock`)
VALUES
  (1, 'fernet dia 1', 6900.00, 15);
INSERT INTO
  `materia_prima` (`id`, `nombre`, `precio`, `stock`)
VALUES
  (4, 'fernet dia 3', 3000.00, 15);
INSERT INTO
  `materia_prima` (`id`, `nombre`, `precio`, `stock`)
VALUES
  (5, 'dia backup', 2.00, 10);
INSERT INTO
  `materia_prima` (`id`, `nombre`, `precio`, `stock`)
VALUES
  (6, 'back up 2', 2.00, 2);
INSERT INTO
  `materia_prima` (`id`, `nombre`, `precio`, `stock`)
VALUES
  (7, 'cerrar sesionmmmmmmmmmmmmmmmmmmmm', 2.00, 0);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: role
# ------------------------------------------------------------

INSERT INTO
  `role` (`id`, `tipo`)
VALUES
  (1, 'super_admin');
INSERT INTO
  `role` (`id`, `tipo`)
VALUES
  (2, 'admin');
INSERT INTO
  `role` (`id`, `tipo`)
VALUES
  (3, 'default');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: usuario
# ------------------------------------------------------------

INSERT INTO
  `usuario` (`id`, `nombre`, `pass`, `usuario`, `email`)
VALUES
  (
    1,
    'santiago',
    '$2a$08$bnSM5bloOLHUKEU8SvhfBuiDSV0WKKutxAQwZlodQJGrqcgr4jDZu',
    'santiago',
    'santiago@santiago.com'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: usuario_role
# ------------------------------------------------------------

INSERT INTO
  `usuario_role` (`usuario_id`, `rol_id`)
VALUES
  (1, 1);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: venta
# ------------------------------------------------------------

INSERT INTO
  `venta` (
    `id`,
    `producto_id`,
    `nombre_prod`,
    `color`,
    `cantidad_vendida`,
    `precio`,
    `stock_origen`,
    `tipo_venta`,
    `fecha`,
    `cliente`,
    `medio_pago`,
    `direccion`,
    `email`,
    `telefono`
  )
VALUES
  (
    1,
    2,
    'pt2 dia 1',
    'gris',
    49,
    196000.00,
    'stock_loberia',
    'precio_venta_mayorista',
    '2023-10-22',
    'cliente dia 1',
    'mercado pago',
    'las heras 219',
    'cristian@cristian.com',
    ''
  );

# ------------------------------------------------------------
# TRIGGER DUMP FOR: tr_compra_actualizarMateriaPrima
# ------------------------------------------------------------

DROP TRIGGER IF EXISTS tr_compra_actualizarMateriaPrima;
DELIMITER ;;
CREATE TRIGGER tr_compra_actualizarMateriaPrima 
                    AFTER INSERT ON compra FOR EACH ROW
                    BEGIN
                    DECLARE stock_diff INT;
                    SET stock_diff = NEW.cantidad;
  
                    IF EXISTS (SELECT 1 FROM materia_prima WHERE nombre = NEW.producto) THEN
                        UPDATE materia_prima SET stock = stock + stock_diff, precio = NEW.precio_unitario WHERE nombre = NEW.producto;
                    ELSE
                        INSERT INTO materia_prima (nombre, precio, stock) VALUES (NEW.producto, NEW.precio_unitario, stock_diff);
                    END IF;
                    END;;
DELIMITER ;

# ------------------------------------------------------------
# TRIGGER DUMP FOR: tr_mp_cambiarNombreCompra
# ------------------------------------------------------------

DROP TRIGGER IF EXISTS tr_mp_cambiarNombreCompra;
DELIMITER ;;
CREATE TRIGGER tr_mp_cambiarNombreCompra
                    AFTER UPDATE ON materia_prima FOR EACH ROW
                    BEGIN
                    IF NEW.nombre != OLD.nombre THEN
                        UPDATE compra SET producto = NEW.nombre WHERE producto = OLD.nombre;
                        UPDATE enproduccion SET nombre = NEW.nombre WHERE nombre = OLD.nombre;
                    END IF;
                    END;;
DELIMITER ;

# ------------------------------------------------------------
# TRIGGER DUMP FOR: tr_descontar_stock_hilado
# ------------------------------------------------------------

DROP TRIGGER IF EXISTS tr_descontar_stock_hilado;
DELIMITER ;;
CREATE TRIGGER tr_descontar_stock_hilado 
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
                    END;;
DELIMITER ;

# ------------------------------------------------------------
# TRIGGER DUMP FOR: tr_cargarCliente
# ------------------------------------------------------------

DROP TRIGGER IF EXISTS tr_cargarCliente;
DELIMITER ;;
CREATE TRIGGER tr_cargarCliente
                    AFTER INSERT ON venta FOR EACH ROW
                    BEGIN
                        DECLARE cliente_id INT;
    
                        -- Verificar si el cliente ya existe
                        SELECT id_cliente INTO cliente_id
                        FROM cliente
                        WHERE nombre = NEW.cliente;
    
                        -- Si el cliente no existe, insertarlo
                        IF cliente_id IS NULL THEN
                            INSERT INTO cliente (nombre, direccion, email, telefono)
                            VALUES (NEW.cliente, NEW.direccion, NEW.email, NEW.telefono);
                        ELSE
                        UPDATE cliente SET direccion = NEW.direccion, email = NEW.email, telefono = NEW.telefono WHERE nombre = NEW.cliente;   
                        END IF;
                    END;;
DELIMITER ;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
