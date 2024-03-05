import { Router } from "express";
import { check } from "express-validator";
import {
  usuariosGet,
  usuariosPost,
  getUsuarioById,
  usuariosPut,
  usuariosDelete,
} from "./user.controller.js";
import {
  existenteEmail,
  //checkRole,
  existeUsuarioById,
} from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { tieneRole } from "../middlewares/validar-roles.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/",validarJWT, usuariosGet);

router.get(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioById),
    validarCampos,
  ],
  getUsuarioById
);

router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe ser mayor a 6 caracteres").isLength({
      min: 6,
    }),
    check("correo", "Este no es un correo válido").isEmail(),
    check("correo").custom(existenteEmail),
    check("role", "El role no puede estar vacio").not().isEmpty(),
    //check("role").custom(checkRole), // Aplicar el middleware 'checkRoleMiddleware' para verificar si el rol existe en la base de datos
    validarCampos,
  ],
  usuariosPost
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioById),
    validarCampos,
  ],
  usuariosPut
);

router.delete(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioById),
    validarCampos,
  ],
  usuariosDelete
);

export default router;