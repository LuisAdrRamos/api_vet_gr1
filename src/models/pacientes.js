import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const pacientesSchema = new Schema({
    nombre:{
        type: String,
        require: true,
        trim: true
    },
    propietario: {
        type: String,
        require: true,
        trim: true
    },
    telefono:{
        type: String,
        require: true,
        trim: true
    },
    email:{
        type: String,
        require: true,
        trim: true
    },
    token:{
        type:String,
        default:null
    },
    password:{
        type: String,
        require: true,
    },
    ingreso:{
        type: Date,
        require: true,
        trim: true,
        default: Date.now()
    },
    sintomas:{
        type: String,
        require:true,
        trim: true
    },
    salida:{
        type: Date,
        require: true,
        trim: true,
        default: Date.now()
    },
    estado:{
        type: Boolean,
        default: true
    },
    veterinario:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"veterinario"
    }
},{
    timestamps: true
})

pacientesSchema.methods.encrypPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    const passwordEncrypt = await bcrypt.hash(password, salt)
    return passwordEncrypt
}

pacientesSchema.methods.matchPassword = async function(password){
    const response = await bcrypt.compare(password, this.password)
    return response
}

pacientesSchema.methods.crearToken = function (){
    const tokenGen = this.token = Math.random().toString(36).slice(2)
    return tokenGen
}


export default model("Paciente", pacientesSchema)