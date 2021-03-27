const { response } = require("express")

/* un middleware es una simple funcion que debe tener como parametro
-reques
-response
-next: El next se ejecuta si todo sale bien */
const esAdminRole = (req,res = response,next) => {

    if(!req.usuario){
        return res.status(500).json({
            msg: "primero debes verificar el token"
        })
    }

    const { rol, nombre } = req.usuario;

    if (rol !== "ADMIN_ROLE") {
        return res.status(401).json({
            msg: `El ${nombre} no es administrador - no puede hacer esto`
        });
    }


    next();
}

module.exports = {
    esAdminRole
}