import { Router } from "express";
import { obtenerCategorias, crearCategorias, eliminarCategoria, obtenerCategoriaPorId, actualizarCategoria } from "../controllers/ordenesTrabajo/categorias.controller.js";
import { validarToken } from "../middleware/verificarToken.middleware.js";

const router = Router();

router.get("/categorias", validarToken, obtenerCategorias);
router.post("/categorias", validarToken, crearCategorias);
router.delete("/categorias/:id", validarToken, eliminarCategoria);
router.get("/categorias/:id", validarToken, obtenerCategoriaPorId);
router.put("/categorias/:id", validarToken, actualizarCategoria);

export default router;
