require('dotenv').config();
const { ACCESS_TOKEN } = process.env;
const { Orden, Suplement } = require('../db');
const axios = require('axios')
//IMPORTS MERCADO PAGO
const { MercadoPagoConfig, Preference } = require('mercadopago');
const mercadopago = require('mercadopago')
const { sendEmailController } = require('../controllers/userController'); // Importa la función para enviar correos electrónicos

const client = new MercadoPagoConfig({ accessToken: `${ACCESS_TOKEN}` });


const createOrder = async (req, res) => {
    // console.log(req.body);s
    // const { items, total } = req.body;

    try {
        const body = {
            items: req.body.items.map((item) => {
                return {
                    title: item.title,
                    unit_price: parseFloat(item.price),
                    quantity: parseFloat(item.quantity),
                    currency_id: "ARS",
                    userId: req.body.userId
                }
            }
            ),
            back_urls: {
                "success": `http://localhost:5173/home`,
                "failure": `http://localhost:5173/home`,
                "pending": `http://localhost:5173/home`
            },
            notification_url: "https://1850-186-128-109-75.ngrok-free.app/payment/webhook",
            metadata: {
                userId: req.body.userId
            }
        };

        const preference = new Preference(client)

        const result = await preference.create({ body })
        console.log(result);
        res.json({ point: result.init_point, });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error al crear la preferencia :(",
        })
    }
}

const receiveWebhook = async (req, res) => {
    const paymentId = req.query['data.id'];
    const topic = req.query.type;

    if (topic === 'payment') {
        try {
            const response = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                headers: {
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
                }
            });

            const payment = response.data;
            console.log('Respuesta de mercado pago:', payment);

            const { transaction_details, additional_info, status: mpStatus, payer } = payment;
            const total_paid_amount = Math.round(transaction_details.total_paid_amount * 100);
            const { transaction_details, additional_info, status: mpStatus, payer, metadata  } = payment;
            const total_paid_amount = Math.round(transaction_details.total_paid_amount * 100); // convirtiendo a num entero
            const items = additional_info.items;
            // console.log('items:', items);
            const userId = metadata ? metadata.user_id : null;
            // console.log('Payer:', payer);
            // console.log('userid recibido de metdata:', userId);

            let status;
            if (mpStatus === 'approved') {
                status = 'completed';
                // Envía un correo electrónico cuando el pago es exitoso
                await sendEmailController(payer.email, null, 'buy');
            } else if (mpStatus === 'pending') {
                status = 'pending';
            } else {
                status = 'cancelled';
            }

            const orden = await Orden.create({
                total: total_paid_amount,
                status,
                paymentMethod: 'mercadopago',
                userId,
            });

            for (const item of items) {
                if (!item.title || !item.quantity || !item.unit_price) {
                    throw new Error(`El item no tiene la estructura esperada: ${JSON.stringify(item)}`);
                }

                const suplementoName = item.title;
                const cantidad = parseInt(item.quantity, 10);
                const precio = Math.round(parseFloat(item.unit_price) * 100);
                const precio = Math.round(parseFloat(item.unit_price) * 100);

                // console.log(`Buscando suplemento con título: ${suplementoName}`);

                const suplemento = await Suplement.findOne({ where: { name: suplementoName } });
                if (!suplemento) {
                    throw new Error(`Suplemento con título ${suplementoName} no encontrado en la base de datos`);
                }
                await orden.addSuplement(suplemento, { through: { cantidad, precio } });
            }

            // res.status(200).send('webhook procesado con exito');
            res.json({ orderId: orden.id, userId: orden.userId });
        } catch (error) {
            console.error('Error al procesar el webhook de Mercado Pago:', error);
            res.status(500).json({
                message: 'Error al procesar el webhook de Mercado Pago',
                error: error.message
            });
        }
    } else {
        res.status(400).send('tipo de webhook no soportado');
    }
};



module.exports = { createOrder, receiveWebhook }
