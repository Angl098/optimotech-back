const { Cart, CartItem } = require('../db')

const getCart = async (req, res) => {
    try {
        const response = await Cart.findAll({
            where: { payment_status: 'approved' },
            include: [{ 
                model: CartItem, 
                as: 'cartItems' 
            }]
        });

        res.status(200).json(response);
    } catch (error) {
        console.error('Error al obtener los datos', error);
        res.status(500).json({message:'Error al obtener los datos'});
    }
};


module.exports = {getCart}