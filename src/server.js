import express from "express";
import dotenv from "dotenv";
import cors from "cors";

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

export default app;