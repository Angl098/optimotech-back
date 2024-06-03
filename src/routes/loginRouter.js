const {Router} = require("express");

const loginRouter = Router();

//Importar los handlers
const {loginHandler} = require("../handlers/loginHandler.js");

//Rutas
loginRouter.post("/", loginHandler);

module.exports = loginRouter;