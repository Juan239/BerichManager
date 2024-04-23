import { Router } from "express";
import { obtenerCategorias, crearCategorias, eliminarCategoria } from "../controllers/categorias.controller.js";
import { validarToken } from "../middleware/verificarToken.middleware.js";

const router = Router();

router.get("/categorias", validarToken, obtenerCategorias);
router.post("/categorias", validarToken, crearCategorias);
router.delete("/categorias/:id", validarToken, eliminarCategoria);

export default router;
