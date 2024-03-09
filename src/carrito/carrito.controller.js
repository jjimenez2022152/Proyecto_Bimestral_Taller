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

export const getCarrito = async (req, res) => {
    const usuarioId = req.usuario._id;

    try {
        if (req.usuario.role !== 'CLIENT_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        const carrito = await Carrito.findOne({ user: usuarioId }).populate('productos');

        if (!carrito) {
            return res.status(404).json({ msg: 'No se encontró ningún producto en el carrito' });
        }

        let precioTotal = 0;
        const productosEnCarrito = carrito.productos.map(producto => {
            const subtotal = producto.precio * producto.cantidad;
            precioTotal += subtotal;

            return {
                usuario: req.usuario.nombre,
                producto: producto.nombreProducto,
                cantidad: producto.cantidad,
                precio: producto.precio,
                subtotal: subtotal
            };
        });

        const carritoId = carrito._id;

        return res.status(200).json({ carritoId, productosEnCarrito, precioTotal });
    } catch (error) {
        console.error('Error al obtener los productos en el carrito:', error);
        res.status(500).json({ error: 'Error al obtener los productos en el carrito' });
    }
};

export const deleteCarrito = async (req, res) => {
    const { nombreProducto } = req.query;
    const usuario = req.usuario;

    try {
        const carritoExistente = await Carrito.findOne({ user: usuario });

        if (!carritoExistente) {
            return res.status(404).json({ msg: 'No se encontró ningún carrito para este usuario' });
        }

        const productoIndex = carritoExistente.productos.findIndex(item => item.name === nombreProducto);

        if (productoIndex === -1) {
            return res.status(404).json({ msg: 'Producto no encontrado en el carrito' });
        }

        const cantidad = carritoExistente.productos[productoIndex].cantidad;

        carritoExistente.productos.splice(productoIndex, 1);

        await carritoExistente.save();

        await Product.findOneAndUpdate(
            { name: nombreProducto },
            { $inc: { stock: cantidad } }
        );

        return res.status(200).json({ msg: 'Producto eliminado del carrito' });
        
    } catch (error) {
        console.error('Error al eliminar producto del carrito', error);
        res.status(500).json({ msg: 'Error al eliminar producto del carrito'});
    }
};