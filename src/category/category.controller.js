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
        const { name } = req.body; // Solo se requiere el nombre de la categoría

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
    try {

        const {id: categoriaId} = req.params;
        // Verifica si la categoría existe
        const categoria = await Category.findById(categoriaId);
        if (!categoria) {
            throw new Error('La categoría no existe');
        }

        // Encuentra la categoría predeterminada (puedes cambiar este ID según tu configuración)
        const categoriaPredeterminada = await Category.findOne({ name: 'Producto Comercial' });

        // Actualiza los productos asociados a la categoría que se va a eliminar
        await Producto.updateMany({ category: categoriaId }, { category: categoriaPredeterminada._id });

        // Elimina la categoría
        const categoryDeleted = await Category.findByIdAndDelete(categoriaId);

        res.status(200).json({
            category: categoryDeleted
        })
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        res.status(500).json({ error: 'Error al eliminar la categoria' });
    }
};
