const {Router} = require("express");
const { createOrder, receiveWebhook} = require("../controllers/paymentController");


const router = Router();


router.post('/create_preference', createOrder)
// router.get('/success', (req, res) => res.send('success'))
// router.get('/failure', (req, res) => res.send('failure'))
// router.get('/pending', (req, res) => res.send('pending'))
//Webhook escucha por eventos de mercado pago
// router.post('/webhook', receiveWebhook)


module.exports = router;