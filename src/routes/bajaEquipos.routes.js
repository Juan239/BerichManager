import { Router } from "express";
import { validarToken } from "../middleware/verificarToken.middleware.js";
import {
  obtenerBajaEquipos,
  crearBajaEquipos,
  eliminarBajaEquipos,
  actualizarBajaEquipos,
  obtenerBajaEquiposPorId
} from "../controllers/bajaEquipos.controller.js";

const router = Router();

router.get("/bajaEquipos", obtenerBajaEquipos);

router.get("/bajaEquipos/:id", obtenerBajaEquiposPorId);

router.post("/bajaEquipos", crearBajaEquipos);

router.delete("/bajaEquipos/:id", eliminarBajaEquipos);

router.put("/bajaEquipos/:id", actualizarBajaEquipos);

export default router;
