import bcryptjs from 'bcryptjs';
import Category from '../category/category.model.js';


export const categoryPost = async (req, res) => {
    try {
        // Verificar el usuario autenticado y su rol
        const usuario = req.usuario;

        if (usuario.role !== 'ADMIN_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        // Obtener los datos del cuerpo de la solicitud
        const { name, description } = req.body;

        // Crear una nueva categoría
        const nuevaCategoria = new Category({ name, description });

        // Guardar la nueva categoría en la base de datos
        await nuevaCategoria.save();

        res.status(200).json({ categoria: nuevaCategoria });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};