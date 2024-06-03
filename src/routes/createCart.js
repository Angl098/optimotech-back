const { Router } = require("express");
const { createCart, addSuplementToCart, getCartById } = require("../controllers/createCart");

const routerOrden = Router();

routerOrden.post('/create-cart', createCart)
routerOrden.post('/add-suplement', addSuplementToCart)
routerOrden.get('/:cartId', getCartById)


module.exports = routerOrden;