import { Router } from "express";
import { ordenesPorEstablecimientoMes, ordenesTrabajoTotal, ordenesTotalesPorMes, viajesTotales, viajesTotalesMesActual, ordenesTotalesMesActual } from "../controllers/ordenesTrabajo/graficos.controller.js";

const router = Router()

router.get("/graficos/:mes", ordenesPorEstablecimientoMes)
router.get("/ordenesTotales", ordenesTrabajoTotal)
router.get("/ordenesTotalesPorMes/:year", ordenesTotalesPorMes)
router.get("/viajesTotales", viajesTotales)
router.get("/viajesMes", viajesTotalesMesActual)
router.get("/ordenesMes", ordenesTotalesMesActual)



export default router   