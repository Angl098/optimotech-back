const {Router} = require("express");
const { getOrdersController } = require("../controllers/getOrdersController");

const router = Router();

//Rutas
router.get("/", getOrdersController);


module.exports = router;