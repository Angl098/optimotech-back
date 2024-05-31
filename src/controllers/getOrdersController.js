const { Orden } = require('../db')

const getOrdersController = async (req, res) => {
    try {
        const orders = await Orden.findAll();
        res.json(orders);
    } catch (error) {
        console.error('Error al obtener las órdenes:', error);
        res.status(500).json({ error: 'Error al obtener las órdenes' });
    }
}

module.exports = { getOrdersController }