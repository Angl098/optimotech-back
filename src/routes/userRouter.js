const {Router} = require("express");

const userRouter = Router();

//Importar los handlers
const {createUserHandler, sendEmail, getFilteredUsersHandler} = require("../handlers/userHandlers");

//Rutas
userRouter.post("/", createUserHandler);
userRouter.post("/email", sendEmail);
userRouter.get("/filter", getFilteredUsersHandler);
module.exports = userRouter;