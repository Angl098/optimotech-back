const {Router} = require("express");
const { getCart } = require("../controllers/getCart")
const { getCartById } = require("../controllers/getCartById")
const { postCart } = require("../controllers/postCart")

const router = Router();

//Rutas para el carrito de compras
router.post('/cart', postCart);
router.get('/cart', getCart);
router.get('/cart/:id', getCartById);

module.exports = router;