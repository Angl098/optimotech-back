const mercadopago = require('mercadopago')
require('dotenv').config();
const { MercadoPagoConfig, Preference } = require('mercadopago');
const { ACCESS_TOKEN } = process.env;
const { crearOrden } = require('../controllers/crearOrden')


const client = new MercadoPagoConfig({ accessToken: `${ACCESS_TOKEN}` });


const createOrder = async (req, res) => {
    // console.log(req.body);
    const { items, total } = req.body;
    
    try {
        const body = {
            items: req.body.items.map((item) => {
                return {
                    title: item.title,
                    unit_price: parseFloat(item.price),
                    quantity: parseFloat(item.quantity),
                    currency_id: "ARS",
                }
            }
            ),
            back_urls: {
                "success": `http://localhost:5173/home`,
                "failure": `http://localhost:5173/home`,
                "pending": `http://localhost:5173/home`
            },
            notification_url: "https://9882-186-128-85-193.ngrok-free.app/payment/webhook",
        };
        
        const preference = new Preference(client)
        // console.log("preference:", preference)

        const result = await preference.create({ body })
        console.log(result);


        res.json({ point:result.init_point,  });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error al crear la preferencia :(",
        })
    }
}

const receiveWebhook = async(req, res) => {
    console.log('Datos recibidos en el webhook:', req.query);

    const payment = req.query
    
    try {
        if(payment.type === "payment") {
            
            const data = await mercadopago.payment.get(payment['data.id'])
            console.log(data);

            //GUARDAR EN BASEDEDATOS
        }
    
        res.status(204)
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error.message})
    }
}


module.exports = { createOrder, receiveWebhook }
