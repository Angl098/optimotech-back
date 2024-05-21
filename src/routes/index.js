const {Router} = require("express");
//Importar rutas
const userRouter = require("./userRouter");
const suplementRouter = require("./suplementRouter");
const categoryRouter = require("./categoryRouter");
const payment = require("./payment")
const cart = require("./cart")

const routes = Router();

//Rutas

routes.use("/users", userRouter);
routes.use("/category", categoryRouter);
routes.use("/suplements", suplementRouter);
routes.use("/payment", payment);
routes.use("/", cart)

module.exports = routes;