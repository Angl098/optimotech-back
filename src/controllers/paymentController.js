const mercadopago = require('mercadopago')
require('dotenv').config();
const { MercadoPagoConfig, Preference } = require('mercadopago');
const { ACCESS_TOKEN } = process.env;


// const client = new MercadoPagoConfig({
//     accessToken: ACCESS_TOKEN
// });
const client = new MercadoPagoConfig({ accessToken: `${ACCESS_TOKEN}` });


const createOrder = async (req, res) => {
    console.log(req.body);
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
            auto_return: "approved",
        };


        const preference = new Preference(client)
        console.log("preference:", preference)
        const result = await preference.create({ body })
        console.log(result);
        res.json({ point:result.init_point });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error al crear la preferencia :(",
        })
    }
}



module.exports = { createOrder }
