import { Router } from "express";
import { ordenesPorEstablecimientoMes, ordenesTrabajoTotal, ordenesTotalesPorMes, viajesTotales } from "../controllers/ordenesTrabajo/graficos.controller.js";

const router = Router()

router.get("/graficos/:mes", ordenesPorEstablecimientoMes)
router.get("/ordenesTotales", ordenesTrabajoTotal)
router.get("/ordenesTotalesPorMes/:year", ordenesTotalesPorMes)
router.get("/viajesTotales", viajesTotales)

export default router   