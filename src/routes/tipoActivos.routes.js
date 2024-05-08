import { Router } from "express";
import { validarToken } from "../middleware/verificarToken.middleware.js";
import {
  obtenerTipoActivos,
  crearTipoActivos,
  eliminarTipoActivos,
  actualizarTipoActivos,
  obtenerTipoActivoPorId
} from "../controllers/bajaEquipos/tipoActivos.controller.js";

const router = Router();

router.get("/tipoActivos", obtenerTipoActivos);

router.post("/tipoActivos", crearTipoActivos);

router.delete("/tipoActivos/:id", eliminarTipoActivos);

router.put("/tipoActivos/:id", actualizarTipoActivos);

router.get("/tipoActivos/:id", obtenerTipoActivoPorId);

export default router;