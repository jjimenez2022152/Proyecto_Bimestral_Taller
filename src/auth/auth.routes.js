import { Router } from "express";
import { check } from "express-validator";

import { login, signUp, usuariosDeleteClientes, usuarioPropioPut } from "./auth.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { existenteEmail } from "../helpers/db-validators.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

import {
    existeUsuarioById,
  } from "../helpers/db-validators.js";

const router = Router()

router.post(
    '/login',
    [
        check('correo', 'Este no es un correo válido').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos,
    ], login
);

router.post(
    '/signUp', [
    check('nombre', 'El nombre no puede ir Vacio').not().isEmpty(),
    check('correo', 'Este correo no es un correo valido').isEmail(),
    check("correo").custom(existenteEmail),
    check('password', 'La password es obligatoria').not().isEmpty(),
    check("informacion"),
    validarCampos,
], signUp)


router.delete(
    '/:id',
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
    ],usuariosDeleteClientes

);

router.put(
    "/:id",
    [
      validarJWT,
      check("id", "No es un ID válido").isMongoId(),
      check("id").custom(existeUsuarioById),
      validarCampos,
    ],
    usuarioPropioPut
  );

export default router