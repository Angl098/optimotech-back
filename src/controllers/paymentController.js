require('dotenv').config();
const { ACCESS_TOKEN } = process.env;
const { Orden, Suplement } = require('../db');
const axios = require('axios')
//IMPORTS MERCADO PAGO
const { MercadoPagoConfig, Preference } = require('mercadopago');
const mercadopago = require('mercadopago')


const client = new MercadoPagoConfig({ accessToken: `${ACCESS_TOKEN}` });


const createOrder = async (req, res) => {
    // console.log(req.body);s
    // const { items, total } = req.body;

    try {
        const items = req.body.items;

        // Verificar el stock disponible
        for (const item of items) {
            const suplemento = await Suplement.findOne({ where: { name: item.title } });
            if (!suplemento) {
                return res.status(404).json({ error: `Suplemento con nombre ${item.title} no encontrado` });
            }

            if (suplemento.amount < item.quantity) {
                return res.status(400).json({ error: `Stock insuficiente para ${suplemento.name}` });
            }
        }
        const body = {
            items: req.body.items.map((item) => {
                return {
                    title: item.title,
                    unit_price: parseFloat(item.price),
                    quantity: parseFloat(item.quantity),
                    currency_id: "ARS",
                    // userId: req.body.userId
                }
            }
            ),
            back_urls: {
                "success": `http://localhost:5173/home`,
                "failure": `http://localhost:5173/home`,
                "pending": `http://localhost:5173/home`
            },
            notification_url: "https://3f73-2802-8011-3005-1d00-ddec-b923-f856-71c7.ngrok-free.app/payment/webhook",
            metadata: {
                userId: req.body.userId
            }
        };

        const preference = new Preference(client)

        const result = await preference.create({ body })
        // console.log(result);
        res.json({ point: result.init_point, });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error al crear la preferencia :(",
        })
    }
}

const receiveWebhook = async (req, res) => {
    // console.log('datos recibidos en el webhook:', req.query);

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
            // console.log('Datos de la api de mp:', payment);

            const { transaction_details, additional_info, status: mpStatus, payer, metadata } = payment;
            const total_paid_amount = Math.round(transaction_details.total_paid_amount * 100); // convirtiendo a num entero
            const items = additional_info.items;
            const userId = metadata ? metadata.user_id : null;
            console.log('UserId recibido de metadata:', userId);
            // console.log('Payer:', payer);

            let status;
            if (mpStatus === 'approved') {
                status = 'completed';
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

            console.log('Orden creada:', orden);
            // AÑADIR suplementos a la orden
            for (const item of items) {
                if (!item.title || !item.quantity || !item.unit_price) {
                    throw new Error(`El item no tiene la estructura esperada: ${JSON.stringify(item)}`);
                }

                const suplementoName = item.title;
                const cantidad = parseInt(item.quantity, 10);
                const precio = Math.round(parseFloat(item.unit_price) * 100); 

                // console.log(`Buscando suplemento con título: ${suplementoName}`);

                const suplemento = await Suplement.findOne({ where: { name: suplementoName } });
                if (!suplemento) {
                    throw new Error(`Suplemento con título ${suplementoName} no encontrado en la base de datos`);
                }
                // console.log(`Suplemento encontrado: ${suplemento.id}, añadiendo a la orden`);
                await orden.addSuplement(suplemento, { through: { cantidad, precio } });

                if (status === 'completed') {
                    // Reducir el stock permanentemente
                    if (suplemento.amount < cantidad) {
                        console.error(`No hay suficiente stock para el suplemento ${suplemento.name}`);
                        throw new Error(`No hay suficiente stock para el suplemento ${suplemento.name}`);
                    }
                    suplemento.amount -= cantidad;
                    await suplemento.save();
                    console.log(`Stock actualizado para el suplemento ${suplemento.name}. Nueva cantidad: ${suplemento.amount}`);
                }
                
            }

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
}


module.exports = { createOrder, receiveWebhook }