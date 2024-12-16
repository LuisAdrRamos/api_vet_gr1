import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rutas_veterinario from "./routers/veterinario_routers.js";
import rutas_pacientes from "./routers/pacientes_routers.js"

const app = express();
dotenv.config();

//Configuracion del server
app.set("port", process.env.PORT || 3000);
app.use(cors());

//Middleware
app.use(express.json())

// Rutas
app.get('/',(req,res) =>{
    res.send("Server ok");  
})

// rutas para veterinarios
app.use('/api/', rutas_veterinario)


// rutas para pacientes
app.use('/api/', rutas_pacientes)

app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))

export default app;