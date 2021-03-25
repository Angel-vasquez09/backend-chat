
const { response } = require("express")

const usuarioGet = (req, res) => {
    const query = req.query;
    res.json({
        mensaje: "Get - Controllers",
        query: query
    })
}

const usuarioPut = (req, res) => {
    const id = req.params.id;
    res.json({
        mensaje: "Put - Controllers",
        id: id
    })
}

const usuarioPost = (req, res) => {

    const body = req.body;

    res.json({
        mensaje: "Post - Controllers",
        body: body
    })
}

const usuarioDelete = (req, res) => {
    res.json({
        mensaje: "delete - Controllers"
    })
}


module.exports = {
    usuarioGet,
    usuarioPut,
    usuarioPost,
    usuarioDelete
}