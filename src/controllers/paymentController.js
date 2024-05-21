const mercadopago = require('mercadopago')
require('dotenv').config();
// const { MercadoPagoConfig, Preference } = require('mercadopago');

const {
    ACCESS_TOKEN
} = process.env;

const createOrder = async (req, res) => {

    mercadopago.configure({
        ACCESS_TOKEN,
    });

    let preference = {
        items: [
            {
                title: req.body.description,
                unit_price: Number(req.body.price),
                quantity: Number(req.body.quantity),
            }
        ],
        back_urls: {
            success: "http://localhost:5173",
            failure: "http://localhost:5173",
            pending: ""
        },
        auto_return: "approved",
    };

    mercadopago.preferences.create(preference)
        .then(function (response) {
            res.json({
                id: response.body.id
            });
        }).catch(function (error) {
            console.log(error);
        });

    // ---------------------
    // Configura tus credenciales de acceso !! ULTIMA VERSION
    // const mp = new MercadoPagoConfig({
    //     access_token: 'TEST-5195882570333001-051518-9c11188389044e24ccbcf9c9336188e6-1813050139', // Reemplaza con tu access token
    // });

    // mercadopago.configure({
    //     access_token: "TEST-5195882570333001-051518-9c11188389044e24ccbcf9c9336188e6-1813050139",
    // });

    //CREANDO LA ORDEN PARA EL PAGO
    // const result = await mercadopago.preferences.create({
    //     items: [
    //         {
    //             title: "Suplement",
    //             unit_price: 500,
    //             currency_id: "ARS",
    //             quantity: 1,
    //         }
    //     ]
    // })

    //     back_urls: {
    //         success: "http://localhost:5173"
    //         failure: "http://localhost:5173"
    //         pending: ""
    //     }
    //     notification_url: "https://6be7-186-128-46-113.ngrok-free.app/webhook"
    //     console.log(result);

    //     res.send(result.body)
};

// const receiveWebhook = async (req, res) => {

//     // aca se reciben los datos del webhook 
//     const payment = req.query

//     try {
//         if (payment.type === 'payment') {
//             const data = await mercadopago.payment.findById(payment['data.id'])
//             console.log(data);
//             // podemos guardar los datos en la bdd
//         }

//         res.sendStatus(204);
//     } catch (error) {
//         console.log(error);
//         return res.sendStatus(500).json({ error: error.message })
//     }
// }

module.exports = { createOrder, }