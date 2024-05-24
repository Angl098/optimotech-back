const {Router} = require("express");

const loginRouter = Router();

//Importar los handlers
const {loginHandler} = require("../handlers/login");

//Rutas
loginRouter.post("/", loginHandler);

module.exports = loginRouter;