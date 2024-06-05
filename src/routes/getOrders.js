const {Router} = require("express");
const { 
    getOrdersController, 
    // getOrderDetails  
} = require("../controllers/getOrdersController");

const router = Router();

//Rutas
router.get("/", getOrdersController);
router.get('/:id', 
// getOrderDetails
);


module.exports = router;