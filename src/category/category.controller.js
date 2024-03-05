import bcryptjs from 'bcryptjs';
import Category from '../category/category.model.js';
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

        const { name, description } = req.body;
        const nuevaCategoria = new Category({ name, description });

        await nuevaCategoria.save();

        res.status(200).json({ categoria: nuevaCategoria });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

