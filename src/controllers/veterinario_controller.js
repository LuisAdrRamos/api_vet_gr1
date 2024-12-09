import veterinario from "../models/veterinario.js"

const registro = async (req, res) => {
    const {email, password} = req.body
    
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"lo sentimos debes llenar todo los campos"})
    
    const verificarEmail = await veterinario.findOne({email})
    if (verificarEmail) return res.status(400).json({msg:"lo sentimos este email ya esta registrado"})

    const nuevoVeterinario = new veterinario(req.body)
    nuevoVeterinario.password = nuevoVeterinario.encrypPassword(password)
    nuevoVeterinario.password.crearToken()
    await nuevoVeterinario.save()
    res.status(200).json(nuevoVeterinario)
    
    res.send("Veterinario Registrado")
}

export {
    registro
}