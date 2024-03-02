const triggers = [
    {
        name: 'tr_descontar_stock_hilado',
        definition: `
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
                    END;`
    }
    ,
    {
        name: 'tr_compra_actualizarMateriaPrima',
        definition: `
                   CREATE TRIGGER tr_compra_actualizarMateriaPrima 
                    AFTER INSERT ON compra FOR EACH ROW
                    BEGIN
                    DECLARE stock_diff DECIMAL(10, 3);
                    SET stock_diff = NEW.cantidad;
  
                    IF EXISTS (SELECT 1 FROM materia_prima WHERE nombre = NEW.producto) THEN
                        UPDATE materia_prima SET stock = stock + stock_diff, precio = NEW.precio_unitario WHERE nombre = NEW.producto;
                    ELSE
                        INSERT INTO materia_prima (nombre, precio, stock) VALUES (NEW.producto, NEW.precio_unitario, stock_diff);
                    END IF;
                    END;
                    ;`
    }
    ,
    {
        name: 'tr_mp_cambiarNombreCompra',
        definition: `
                    CREATE TRIGGER tr_mp_cambiarNombreCompra
                    AFTER UPDATE ON materia_prima FOR EACH ROW
                    BEGIN
                    IF NEW.nombre != OLD.nombre THEN
                        UPDATE compra SET producto = NEW.nombre WHERE producto = OLD.nombre;
                        UPDATE enproduccion SET nombre = NEW.nombre WHERE nombre = OLD.nombre;
                    END IF;
                    END;`
    }
    ,
    {
        name: 'tr_cargarCliente',
        definition: `
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
                    END;`
    }

];

module.exports = triggers;