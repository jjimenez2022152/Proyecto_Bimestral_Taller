const { response } = require("express");


const esAdminRole = (req, res, next) => {
    if(!req.usuario){
        return res.status(500).json({
            msg: "Se desea validar un usuario sin validar token primero"
        });
    }

    const { role, nombre } =  req.usuario;

    if(role !== "ADMIN_ROLE"){
        return res.status(401).json({
            msg: `${nombre} no es un administrador, no puede usar este endpoint`
        });
    };
    next();
}

const tieneRolAutorizado = (...roles) => {
    return (req =request, res = response, next) =>{
        if(!req.usuario){
            return res.status(500).json({
                msg: "Se desea validar un usuario sin validar token primero"
            });
        }
    
        if(!roles.includes(req.usuario.role)){
            return res.status(401).json({
                msg: `El servicio requiere uno de los siguientes roles autorizados ${roles}`
            });
        }
        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRolAutorizado
}