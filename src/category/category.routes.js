import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
//import { tieneRole } from "../middlewares/validar-roles.js";
import { categoryPost } from "./category.controller.js"; // Importar la función categoryPost del controlador de categorías

const router = Router();

router.post(
  "/",
  [
    validarJWT, 
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("description", "la descripcion es obligatoria").not().isEmpty(),
    validarCampos, 
  ],
  categoryPost 
);



export default router;