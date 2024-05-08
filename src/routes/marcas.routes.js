import { Router } from "express";
import { obtenerMarcas, crearMarcas, eliminarMarca, obtenerMarcaPorId, actualizarMarca } from "../controllers/bajaEquipos/marcas.controller.js";
import { validarToken } from "../middleware/verificarToken.middleware.js";

const router = Router();

router.get("/marcas", validarToken, obtenerMarcas);

router.post("/marcas", validarToken, crearMarcas);

router.delete("/marcas/:id", validarToken, eliminarMarca);

router.get("/marcas/:id", validarToken, obtenerMarcaPorId);

router.put("/marcas/:id", validarToken, actualizarMarca);

export default router;