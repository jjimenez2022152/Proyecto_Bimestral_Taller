import { response, request } from "express";
import User from '../users/user.model.js';
import bcryptjs from 'bcryptjs';
import Product from '../product/product.model.js'
import Category from '../category/category.model.js'

export const productGet = async (req, res) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    try {
        /*
        const usuario = req.usuario;

        if (usuario.role !== 'ADMIN_ROLE', 'CLIENT_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado.' });
        }
*/
        const [total, productos] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .populate('category')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            total,
            productos
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const productPost = async (req, res) => {
    try {
        const usuario = req.usuario;

        if (usuario.role !== 'ADMIN_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        const { name, description, price, stock, categoryId } = req.body;

        const nuevoProducto = new Product({
            name,
            description,
            price,
            stock,
            category: categoryId
        });

        await nuevoProducto.save();

        res.status(200).json({ producto: nuevoProducto });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const productPut = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, password, google, correo, ...resto } = req.body;

        const usuario = req.usuario;

        if (usuario.role !== 'ADMIN_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        if (password) {
            const salt = bcryptjs.genSaltSync();
            resto.password = bcryptjs.hashSync(password, salt);
        }

        await Product.findByIdAndUpdate(id, resto);

        const productoActualizado = await Product.findOne({ _id: id });

        if (!productoActualizado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({
            msg: 'Producto actualizado',
            producto: productoActualizado
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = req.usuario;

        if (usuario.role !== 'ADMIN_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.id' });
        }

        const productoEncontrado = await Product.findOne({ _id: id }).populate('category');

        if (!productoEncontrado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({ producto: productoEncontrado });
    } catch (error) {
        console.error('Error al obtener producto por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const productDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = req.usuario;

        if (usuario.role !== 'ADMIN_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        const productoEliminado = await Product.findByIdAndUpdate(id, { estado: false });

        if (!productoEliminado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({ msg: 'Producto eliminado', producto: productoEliminado });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const productAgotadoGet = async (req, res) => {
    const { limite, desde } = req.query;
    const query = { stock: 0 };

    try {
        const usuario = req.usuario;

        if (usuario.role !== 'ADMIN_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.ag' });
        }

        const [total, productosAgotados] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .populate('category')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            total,
            productos: productosAgotados
        });
    } catch (error) {
        console.error('Error al obtener productos agotados:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const productoMasVendido = async (req, res) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { estado: true, stock: { $gt: 0 } };

    try {
        const usuario = req.usuario;

        if (usuario.role !== 'ADMIN_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.VN' });
        }

        const [total, productos] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .sort({ stock: 1 })
                .populate('category')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            total,
            productos
        });
    } catch (error) {
        console.error('Error al obtener productos más vendidos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// ---------------- Clientes Funciones
export const productoMasVendidoClient = async (req, res) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { estado: true, stock: { $gt: 0, $lte: 5 } }; // Modificación para excluir productos con stock 0 y limitar a productos con stock menor o igual a 5

    try {
        const usuario = req.usuario;

        if (usuario.role !== 'CLIENT_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función. Mas' });
        }

        const [total, productos] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .sort({ stock: 1 })
                .populate('category')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            total,
            productos
        });
    } catch (error) {
        console.error('Error al obtener productos más vendidos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};



export const ProductosPorCategoria = async (req, res) => {
    const { categoria } = req.params;

    try {
        const categoriaEncontrada = await Category.findOne({ name: categoria });

        if (!categoriaEncontrada) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        const productos = await Product.find({ category: categoriaEncontrada._id });

        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener el catálogo de productos por categoría:', error);
        res.status(500).json({ error: 'Error al obtener el catálogo de productos por categoría' });
    }
};

export const ProductosPorNombre = async (req, res) => {
    const { nombre } = req.query;

    try {
        const productos = await Product.find({ name: { $regex: new RegExp(nombre, 'i') } });

        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al buscar productos por nombre:', error);
        res.status(500).json({ error: 'Error al buscar productos por nombre' });
    }
};