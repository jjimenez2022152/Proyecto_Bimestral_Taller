import { Router } from "express";
import { check } from "express-validator";

import { login, signUp } from "./auth.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";

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
    check('password', 'La password es obligatoria').not().isEmpty(),
    validarCampos,
], signUp)

export default router