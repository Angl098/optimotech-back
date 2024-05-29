const {Router} = require("express");

const userRouter = Router();

//Importar los handlers
const {createUserHandler, sendEmail} = require("../handlers/userHandlers");

//Rutas
userRouter.post("/", createUserHandler);
userRouter.post("/email", sendEmail);

module.exports = userRouter;