const mercadopago = require('mercadopago')
require('dotenv').config();
const { MercadoPagoConfig, Preference } = require('mercadopago');
const { ACCESS_TOKEN } = process.env;


// const client = new MercadoPagoConfig({
//     accessToken: ACCESS_TOKEN
// });
const client = new MercadoPagoConfig({ accessToken: `${ACCESS_TOKEN}` });


const createOrder = async (req, res) => {
    try {
        const body = {
            items: [
                {
                    // title: item.name,
                    // quantity: item.quantity,
                    // unit_price: item.price,
                    // currency_id: "ARS",
                    title: req.body.title,
                    unit_price: Number(req.body.price),
                    quantity: Number(req.body.quantity),
                    currency_id: "ARS",
                },
            ],
            back_urls: {
                "success": `https://github.com/Angl098/optimotech-front`,
                "failure": `https://github.com/Angl098/optimotech-front`,
                "pending": `https://github.com/Angl098/optimotech-front`
            },
            auto_retunr: "approved",
        };

        const preference = new Preference(client)
        const result = await preference.create({ body })
        res.json({
            id: result.id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error al crear la preferencia :(",
        })
    }
}



module.exports = { createOrder }
