const { User, Cart } = require('../db')

const postCart = async (req, res) => {
    try {
        const cartData = req.body;
        console.log(cartData);
        const id = req.body.idUserlocal
        const user = await User.findByPk(id);

        let cart = await Cart.create({...cartData, userId:user.id})

        // Asociamos los items al carrito utilizando el método create
        for (const cartItemData of cartData.cartItems) {
            await CartItem.create({
                ...cartItemData,
                cartId: cart.id,  // Asociamos el item al carrito recién creado
            });
        }

        res.status(201).json({ mensaje: 'Carrito creado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al crear el carrito' });
    }
} 

module.exports = {postCart}