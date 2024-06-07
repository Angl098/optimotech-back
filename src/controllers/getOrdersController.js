const { Orden, OrdenSuplement, Suplement, User } = require('../db')

const getOrdersController = async (req, res) => {
    try {
        const orders = await Orden.findAll();
        res.json(orders);
    } catch (error) {
        console.error('Error al obtener las ordenes:', error);
        res.status(500).json({ error: 'Error al obtener las ordenes' });
    }
}


const getOrderDetails = async (req, res) => {
    const { id } = req.params;  // Assuming this is the userId
    console.log(id, "Userid");
    try {
        const orderDetails = await Orden.findAll({
            where: { userId: id },  // Fetch orders based on userId
            include: [
                {
                    model: Suplement
                }
            ]
        });
        if (!orderDetails || orderDetails.length === 0) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }
        res.json(orderDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los detalles de la orden' });
    }
};



module.exports = { getOrdersController, getOrderDetails }