import Carrito from '../carrito/carrito.model.js';
import Product from '../product/product.model.js';
import { validationResult } from 'express-validator';

export const carritoPost = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nombreProducto, cantidad } = req.body;
    const usuario = req.usuario;

    try {
        // Verificar el rol del usuario
        if (usuario.role !== 'CLIENT_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado. El Admin no tiene permisos para realizar esta función.' });
        }

        const producto = await Product.findOne({ name: nombreProducto });

        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        if (producto.stock < cantidad) {
            return res.status(400).json({ msg: 'No hay suficiente stock' });
        }

        const precio = producto.price;
        const total = cantidad * precio;

        const carritoExistente = await Carrito.findOne({ user: usuario });

        if (carritoExistente) {
            const productoExistenteIndex = carritoExistente.productos.findIndex(producto => producto.nombreProducto === nombreProducto);

            if (productoExistenteIndex !== -1) {
                carritoExistente.productos[productoExistenteIndex].cantidad += cantidad;
                carritoExistente.productos[productoExistenteIndex].total += total;
            } else {
                carritoExistente.productos.push({ nombreProducto, cantidad, precio, total });
            }

            await carritoExistente.save();

        } else {
            const nuevoCarrito = new Carrito({
                user: usuario,
                productos: [{ nombreProducto, cantidad, precio, total }]
            });

            await nuevoCarrito.save();
        }

        producto.stock -= cantidad;
        await producto.save();

        return res.status(200).json({ mensaje: 'Producto agregado a tu carrito' });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ msg: 'Error al agregar producto al carrito' });
    }
};

