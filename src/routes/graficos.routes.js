import { Router } from "express";
import { ordenesPorEstablecimientoMes, ordenesTrabajoTotal, ordenesTotalesPorMes } from "../controllers/ordenesTrabajo/graficos.controller.js";

const router = Router()

router.get("/graficos/:mes", ordenesPorEstablecimientoMes)
router.get("/ordenesTotales", ordenesTrabajoTotal)
router.get("/ordenesTotalesPorMes/:year", ordenesTotalesPorMes)

export default router   