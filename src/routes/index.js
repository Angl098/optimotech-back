const {Router} = require("express");
//Importar rutas
const userRouter = require("./userRouter");
const suplementRouter = require("./suplementRouter");

const loginRouter = require('./loginRouter');


const routes = Router();

//Rutas
routes.use("/users", userRouter);
routes.use("/suplements", suplementRouter);

routes.use('/login', loginRouter);

module.exports = routes;