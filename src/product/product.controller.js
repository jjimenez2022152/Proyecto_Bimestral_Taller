import { response, request } from "express";
import User from './user.model.js';
import bcryptjs from 'bcryptjs';
import Product from '../product/product.model.js'

export const productPost = async (req, res) => {
    try {
        // Verificar el usuario autenticado y su rol
        const usuario = req.usuario;

        if (usuario.role !== 'ADMIN_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        // Obtener los datos del cuerpo de la solicitud
        const { name, description, price, stock, categoryId } = req.body;

        // Crear un nuevo producto
        const nuevoProducto = new Product({
            name,
            description,
            price,
            stock,
            category: categoryId // Asignar el ID de la categoría proporcionada al producto
        });

        // Guardar el nuevo producto en la base de datos
        await nuevoProducto.save();

        res.status(200).json({ producto: nuevoProducto });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const productPut = async (req, res) => {
    try {
        // Obtener el ID del producto de los parámetros de la solicitud
        const { id } = req.params;

        // Extraer el ID, contraseña, google y correo del cuerpo de la solicitud
        const { _id, password, google, correo, ...resto } = req.body;

        // Verificar el usuario autenticado y su rol
        const usuario = req.usuario;

        if (usuario.role !== 'ADMIN_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        // Si se proporciona una nueva contraseña, encriptarla antes de actualizarla
        if (password) {
            const salt = bcryptjs.genSaltSync();
            resto.password = bcryptjs.hashSync(password, salt);
        }

        // Actualizar el producto en la base de datos
        await Product.findByIdAndUpdate(id, resto);

        // Buscar el producto actualizado en la base de datos
        const productoActualizado = await Product.findOne({ _id: id });

        // Verificar si el producto fue encontrado
        if (!productoActualizado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Enviar respuesta con el producto actualizado
        res.status(200).json({
            msg: 'Producto actualizado',
            producto: productoActualizado
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};