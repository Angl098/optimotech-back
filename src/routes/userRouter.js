const {Router} = require("express");

const userRouter = Router();

//Importar los handlers
const {createUserHandler, sendEmail, getFilteredUsersHandler, changePasswordHandler} = require("../handlers/userHandlers");

//Rutas
userRouter.post("/", createUserHandler);
userRouter.post("/email", sendEmail);
userRouter.get("/filter", getFilteredUsersHandler);
userRouter.post("/changePassword", changePasswordHandler);
module.exports = userRouter;