import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs"

const veterinariosSchema = new Schema({
    nombre:{
        type:String,
        require:true,
        trim:true
    },
    apellido:{
        type:String,
        require:true,
        trim:true
    },
    direccion:{
        type:String,
        trim:true,
        default:null
    },
    telefono:{
        type:Number,
        trim:true,
        default:null
    },
    email:{
        type:String,
        require:true,
        trim:true,
        unique:true
    },
    token:{
        type:String,
        default:null
    },
    password:{
        type:String,
        require:true,
    },
    status:{
        type:Boolean,
        default:true
    },
    confirmEmail:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

veterinariosSchema.methods.encrypPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    const passwordEncrypt = await bcrypt.hash(password, salt)
    return passwordEncrypt
}

veterinariosSchema.methods.matchPassword = async function(password){
    const response = await bcrypt.compare(password, this.password)
    return response
}

veterinariosSchema.methods.crearToken = function (){
    const tokenGen = this.token = Math.random().toString(36).slice(2)
    return tokenGen
}

export default model("veterinario",veterinariosSchema)