const { Orden, Suplement } = require('../db');

const crearOrden = async (req, res) => {

    const { cartItems, total, paymentMethod } = req.body;
    
    if (!cartItems || !total || !paymentMethod) {
        return res.status(400).json({ message: 'Faltan datos necesarios para crear la orden' });
    }


    try {
        const orden = await Orden.create({
            total,
            status: 'abierto', 
            paymentMethod 
            //metodo de pago, como 'mercadopago'
        });

        //añade suplementos a la orden_suplem
        for (const item of cartItems) {
            const { productId, quantity, price } = item;
            const suplemento = await Suplement.findByPk(productId);
            if (!suplemento) {
                throw new Error(`Suplemento con id ${productId} no encontrado`);
            }

            await orden.addSuplement(suplemento, { through: { cantidad: quantity, precio: price } });
        }

        res.status(200).json({
            message: 'Orden creada exitosamente',
            orden
        });
    } catch (error) {
        console.error('Error al crear la orden:', error);
        res.status(500).json({
            message: 'Error al crear la orden',
            error: error.message
        });
    }
};

module.exports = {
    crearOrden
};