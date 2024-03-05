import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { existeNombreCategoria, existeCategoriaById } from "../helpers/db-validators.js";
//import { tieneRole } from "../middlewares/validar-roles.js";
import { categoryPost, categoryGet, categoryPut} from "./category.controller.js"; // Importar la función categoryPost del controlador de categorías

const router = Router();

router.get("/",validarJWT, categoryGet);

router.post(
  "/",
  [
    validarJWT, 
    check("name").custom(existeNombreCategoria),
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("description", "la descripcion es obligatoria").not().isEmpty(),
    validarCampos, 
  ],
  categoryPost 
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeCategoriaById),
    validarCampos,
  ],
  categoryPut
);



export default router;