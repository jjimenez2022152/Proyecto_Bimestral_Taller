import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { salePost, getSale } from "./sale.controller.js";
import { existeProductoById } from "../helpers/db-validators.js";

const router = Router();

router.get("/", validarJWT, getSale)

router.post(
  "/",
  [
    validarJWT,
    check("product", "El nombre del producto es obligatorio").not().isEmpty(), // Cambio en la validación del nombre del producto
    check("cantidad", "La cantidad es obligatoria").isInt({ min: 1 }),
    validarCampos,
  ],
  salePost
);


export default router;
