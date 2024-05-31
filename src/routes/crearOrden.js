const { Router } = require("express");
const { crearOrden } = require("../controllers/crearOrden");

const routerOrden = Router();

routerOrden.post('/crear-orden', crearOrden)


module.exports = routerOrden;