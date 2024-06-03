const {Router} = require("express");
//Importar rutas
const userRouter = require("./userRouter");
const suplementRouter = require("./suplementRouter");
const categoryRouter = require("./categoryRouter");
const payment = require("./payment")
const getOrders = require('./getOrders')
const loginRouter = require('./loginRouter');
const providerRouter = require("./providerRouter");
const tagsRouter = require("./tagsRouter");
const createCart = require('./createCart');



const routes = Router();

//Rutas

routes.use("/users", userRouter);
routes.use("/category", categoryRouter);
routes.use("/provider", providerRouter);
routes.use("/tags", tagsRouter);
routes.use("/suplements", suplementRouter);
routes.use("/payment", payment);
routes.use('/orders', getOrders)
routes.use('/login', loginRouter);
routes.use("/cart", createCart)

module.exports = routes;