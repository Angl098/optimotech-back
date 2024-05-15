const {Router} = require("express");
//Importar rutas
const userRouter = require("./userRouter");
const suplementRouter = require("./suplementRouter");
const categoryRouter = require("./categoryRouter");

const routes = Router();

//Rutas

routes.use("/users", userRouter);
routes.use("/category", categoryRouter);
routes.use("/suplements", suplementRouter);

module.exports = routes;