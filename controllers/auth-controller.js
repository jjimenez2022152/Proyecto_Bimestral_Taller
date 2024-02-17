const { request, response } = require("express");
const Usuario = require("../models/usuario");
const bycryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");


const login = async (req = request, res = response) => {
    const { correo, password } = req.body;

    try{
        const usuario = await Usuario.findOne({correo});

        if(!usuario){
            return res.status(400).json({
                msg: "Credencias incorrectas, correo no existe en la base de datos."
            });
        }

         if(!usuario.estado){
            return res.status(400).json({
                msg: " El usuario no existe en la base de datos."
            });
         };

         const validarPassword = bycryptjs.compareSync(password, usuario.password);
         if(!validarPassword){
            return res.status(400).json({
                msg: "La contraseña es incorrecta"
            })
         }

         const token = await generarJWT(usuario.id);

         res.status(200).json({
            msg: "Bienvenido",
            usuario,
            token
         });

    }catch(e){
        console.log(e);
        res.status(500).json({
            msg: "Comuniquese con el administrador"
        });
    };

};

module.exports = {
    login
}