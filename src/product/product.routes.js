import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
//import { tieneRole } from "../middlewares/validar-roles.js";
import { productPost, productPut } from "./product.controller.js"; 
const router = Router();

router.post(
  "/", 
  [
    validarJWT, 
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("description", "La descripcion es obligatoria").not().isEmpty(),
    check("price", "El precio es de caracter obligatorio").not().isEmpty(),
    check("stock", "El stock es obligatorio").not().isEmpty(),
    check("categoryId", "La caregoria es obligatoria").not().isEmpty(),
    validarCampos, 
  ],
  productPost 
);

router.put(
  "/:id", 
  [
    validarJWT, 
    check("id", "No es un ID válido").isMongoId(),
    //check("id").custom(existeUsuarioById),
    validarCampos, 
  ],
  productPut 
);


export default router;
