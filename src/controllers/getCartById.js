const { Cart, CartItem } = require('../db')

const getCartById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await Cart.findAll({
            where: {
                userId: id,
                payment_status: 'approved'
            },
            include: [{
                model: CartItem,
                as: 'cartItems'
            }]
        });

        res.status(200).json(response)
    } catch (error) {
        console.error('Error al obtener los datos del cart Id', error);
        res.status(500).json({ message: 'Error al obtener los datos del cart Id' });
    }
} 

module.exports = {getCartById}