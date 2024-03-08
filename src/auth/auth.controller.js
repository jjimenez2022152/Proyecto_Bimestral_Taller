import bcryptjs from 'bcryptjs';
import Usuario from '../users/user.model.js'
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    //verificar si el email existe:
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(400).json({
        msg: "Credenciales incorrectas, Correo no existe en la base de datos",
      });
    }
    //verificar si el ususario está activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "El usuario no existe en la base de datos",
      });
    }
    // verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "La contraseña es incorrecta",
      });
    }
    //generar el JWT
    const token = await generarJWT(usuario.id);

    res.status(200).json({
      msg: 'Welcomeeeee to the Login!!!',
      usuario,
      token
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: "Comuniquese con el administrador",
    });
  }
}


// ----------Clientes
export const signUp = async (req, res) => {

  const { nombre, correo, password, informacion } = req.body;
  const usuario = new Usuario({ nombre, correo, password, informacion });

  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  await usuario.save();

  res.status(200).json({
    usuario
  });
}

export const usuariosDeleteClientes = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = req.usuario;

    if (usuario.role !== 'CLIENT_ROLE') {
      return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
    }

    const usuarioEliminar = await Usuario.findById(id);
    if (!usuarioEliminar) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (usuario.correo !== usuarioEliminar.correo) {
      return res.status(403).json({ error: 'Acceso denegado. No tiene permisos para eliminar este usuario.' });
    }

    const usuarioEliminado = await Usuario.findByIdAndUpdate(id, { estado: false });

    if (!usuarioEliminado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({ msg: 'Usuario eliminado', usuario: usuarioEliminado });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const usuarioPropioPut = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    const usuario = req.usuario;

    if (usuario.role !== 'CLIENT_ROLE') {
      return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
    }

    const usuarioActualizar = await Usuario.findById(id);
    if (!usuarioActualizar) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (usuario.correo !== usuarioActualizar.correo) {
      return res.status(403).json({ error: 'Acceso denegado. No tiene permisos para actualizar este usuario.' });
    }

    if (password) {
      const salt = bcryptjs.genSaltSync();
      resto.password = bcryptjs.hashSync(password, salt);
    }

    await Usuario.findByIdAndUpdate(id, resto);

    const usuarioActualizado = await Usuario.findOne({ _id: id });

    if (!usuarioActualizado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({
      msg: 'Usuario actualizado',
      usuario: usuarioActualizado
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};