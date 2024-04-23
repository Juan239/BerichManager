import { Router } from "express";
import { verificarUsuario } from "../controllers/sesion.controller.js";

const router = Router();

router.post("/sesion", verificarUsuario )

export default router