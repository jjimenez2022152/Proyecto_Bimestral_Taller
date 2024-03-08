import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";

import {
    carritoPost
} from '../carrito/carrito.controller.js'

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check("nombreProducto", "El nombre del producto es obligatorio").not().isEmpty(),
        check("cantidad", "La cantidad es obligatoria").not().isEmpty(),
    ],
    carritoPost
);

export default router;