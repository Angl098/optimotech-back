const {Router} = require("express");

const userRouter = Router();

//Importar los handlers
const {createUserHandler,  getAll, banUserHandler, unBanUserHandler} = require("../handlers/userHandlers");

//Rutas
userRouter.post("/", createUserHandler);
userRouter.get("/", getAll);
userRouter.post("/ban/:id", banUserHandler);
userRouter.post("/unBan/:id", unBanUserHandler);


module.exports = userRouter;