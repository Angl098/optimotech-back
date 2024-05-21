const {Router} = require("express");

const userRouter = Router();

//Importar los handlers
const {loginHandler} = require("../handlers/login");

//Rutas
userRouter.post("/login", loginHandler);

module.exports = userRouter;