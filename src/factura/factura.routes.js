import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { generarFactura } from "./factura.controller.js";

const router = Router();


router.post(
  "/",
  [
    validarJWT,
    check("idCompra", "El ID de la compra es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  generarFactura
);

export default router;