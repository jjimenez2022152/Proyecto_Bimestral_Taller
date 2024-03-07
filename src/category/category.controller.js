import bcryptjs from 'bcryptjs';
import Category from '../category/category.model.js';
import Product from '../product/product.model.js'
import User from '../users/user.model.js';


export const categoryGet = async (req, res) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    try {
        const usuario = req.usuario;

        if (usuario.role !== 'ADMIN_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        const [total, categorias] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            total,
            categorias
        });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


export const categoryPost = async (req, res) => {
    try {
        const usuario = req.usuario;

        if (usuario.role !== 'ADMIN_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        const { name } = req.body; 
        const nuevaCategoria = new Category({ name });

        await nuevaCategoria.save();

        res.status(200).json({ categoria: nuevaCategoria });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


export const categoryPut = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body; 

        const usuario = req.usuario;

        if (usuario.role !== 'ADMIN_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        const categoryActualizada = await Category.findByIdAndUpdate(id, { name }, { new: true });

        if (!categoryActualizada) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        res.status(200).json({
            msg: 'Categoría actualizada',
            category: categoryActualizada
        });
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const categoryDelete = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = req.usuario;

        if (usuario.role !== 'ADMIN_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        const category = await Category.findByIdAndUpdate(id, { name: "Producto Comercial", description: "A default product", estado: false });

        if (!category) {
            return res.status(404).json({ msg: 'Category no encontrada' });
        }

        const usuarioAutenticado = req.usuario;

        res.status(200).json({
            msg: 'Este catrgoria fue elimana:',
            category,
            usuarioAutenticado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = req.usuario;

        if (usuario.role !== 'ADMIN_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        const categoryFound = await Category.findOne({ _id: id });

        if (!categoryFound) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        res.status(200).json({ categoria: categoryFound });
    } catch (error) {
        console.error('Error al obtener categoría por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};



