import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { existeNombreProducto } from "../helpers/db-validators.js";
import { existeProductoById } from "../helpers/db-validators.js";

//import { tieneRole } from "../middlewares/validar-roles.js";
import {
  productPost,
  productPut,
  productGet, 
  getProductById, 
  productDelete,
  productAgotadoGet, 
  productoMasVendido, 
  productoMasVendidoClient, 
  ProductosPorCategoria, 
  ProductosPorNombre
} from "./product.controller.js";
const router = Router();

router.get("/byName", ProductosPorNombre);
router.get("/allProducts", validarJWT, productGet);
router.get("/masVendidos", validarJWT, productoMasVendido);
router.get("/masVendidoClientes", validarJWT, productoMasVendidoClient);
router.get("/categoria/:categoria", ProductosPorCategoria);

router.post(
  "/",
  [
    validarJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("name", "Producto con nombre ya registrado").custom(existeNombreProducto),
    check("description", "La descripcion es obligatoria").not().isEmpty(),
    check("price", "El precio es de caracter obligatorio").not().isEmpty(),
    check("stock", "El stock es obligatorio").not().isEmpty(),
    check("categoryId", "La cartegoria es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  productPost
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeProductoById),
    validarCampos,
  ],
  productPut
);

router.get(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeProductoById),
  ],
  getProductById
)


router.delete(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeProductoById),
  ],
  productDelete
)

router.get("/", validarJWT, productAgotadoGet);



export default router;
