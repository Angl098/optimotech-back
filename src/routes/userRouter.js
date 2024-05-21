const {Router} = require("express");

const userRouter = Router();

//Importar los handlers
const {createUserHandler} = require("../handlers/userHandlers.js");

//Rutas
userRouter.post("/", createUserHandler);

module.exports = userRouter;