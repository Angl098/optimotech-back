const {Router} = require("express");
const { 
    getOrdersController, 
    // getOrderDetails  
} = require("../controllers/getOrdersController");

const router = Router();

//Rutas
router.get("/", getOrdersController);
router.get('/:orderId/details', 
// getOrderDetails
);


module.exports = router;