import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rutas from "./routers/veterinario_routers.js";

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

app.use('/api/',rutas)

app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))

export default app;