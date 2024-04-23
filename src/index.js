import express from "express";
import usuariosRoutes from "./routes/usuarios.routes.js";
import establecimientosRoutes from "./routes/establecimientos.routes.js";
import ordenTrabajoRoutes from "./routes/ordenTrabajo.routes.js";
import sesionRoutes from "./routes/sesion.routes.js";
import credencialesRoutes from "./routes/credenciales.routes.js"
import categoriasRoutes from "./routes/categorias.routes.js"
import cors from "cors";
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());

app.use(cors({
  origin: "*", // Permitir solicitudes solo desde este dominio
    methods: "*", // Permitir solo los métodos GET y POST
    credentials: true
  }));
  
//app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use('/api',usuariosRoutes)
app.use('/api', establecimientosRoutes)
app.use('/api', ordenTrabajoRoutes)
app.use('/api', sesionRoutes)
app.use('/api', credencialesRoutes)
app.use('/api', categoriasRoutes)


console.log('Escuchando puerto 3000');
app.listen(3000);
