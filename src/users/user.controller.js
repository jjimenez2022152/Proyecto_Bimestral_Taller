import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import User from './user.model.js';

export const usuariosGet = async (req = request, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };


    const [total, usuarios] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        usuarios
    });
}

export const usuariosPost = async (req, res) => {
    try {
        // Paso 1: Verificar el token JWT usando el middleware validarJWT
        const usuario = req.usuario;

        // Paso 2: Verificar si el usuario tiene el rol ADMIN_ROLE
        if (usuario.role !== 'ADMIN_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        // Continuar con la lógica de creación de usuario si el usuario tiene el rol ADMIN_ROLE
        const { nombre, correo, password, role } = req.body;
        const nuevoUsuario = new User({ nombre, correo, password, role });
        const salt = bcryptjs.genSaltSync();
        nuevoUsuario.password = bcryptjs.hashSync(password, salt);
        await nuevoUsuario.save();

        res.status(200).json({ usuario: nuevoUsuario });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getUsuarioById = async (req, res) => {
    const { id } = req.params;
    const usuario = await User.findOne({ _id: id });

    res.status(200).json({
        usuario
    })
}

export const usuariosPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    await User.findByIdAndUpdate(id, resto);

    const usuario = await User.findOne({ _id: id });

    res.status(200).json({
        msg: 'Usuario Actualizado',
        usuario
    });
}

export const usuariosDelete = async (req, res) => {
    const { id } = req.params;


    const usuario = await User.findByIdAndUpdate(id, { estado: false });
    const usuarioAutenticado = req.usuario;

    res.status(200).json({ msg: 'Usuario a eliminar', usuario, usuarioAutenticado });
}