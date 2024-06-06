const { Cart, Suplement, User  } = require('../db');

const getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.findAll();
        res.status(200).json(carts);
    } catch (error) {
        console.error('Error fetching carts:', error);
        res.status(500).json({ error: 'Error fetching carts' });
    }
};

// el carrito lo creamos cuando el usuario ya esta logeado y procede a confirmar el pedido abonandolo
const createCart = async (req, res) => {
    const { total, paymentMethod, paymentStatus, userId } = req.body;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const cart = await Cart.create({
            total,
            paymentMethod,
            paymentStatus,
            userId,
        });
        console.log(cart,"cart");
        res.status(201).json(cart);
    } catch (error) {
        console.error('Error creating cart:', error);
        res.status(500).json({ error: 'Error creating cart' });
    }
};

//agregamos un suplem a un carrito q ya existe
const addSuplementToCart = async (req, res) => {
    const { cartId, suplements } = req.body;

    try {
        const cart = await Cart.findByPk(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        for (const { suplementId, quantity } of suplements) {
            const suplement = await Suplement.findByPk(suplementId);
            if (!suplement) {
                return res.status(404).json({ error: `Suplement with ID ${suplementId} not found` });
            }
            await cart.addSuplement(suplement, { through: { quantity } });
        }

        res.status(200).json({ message: 'Suplements added to cart successfully' });
    } catch (error) {
        console.error('Error adding suplements to cart:', error);
        res.status(500).json({ error: 'Error adding suplements to cart' });
    }
};

//obtener un carrito
const getCartById = async (req, res) => {
    const { cartId } = req.params;
    try {
        const cart = await Cart.findByPk(cartId, {
            include: [{ model: Suplement }],
        });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error getting cart contents:', error);
        res.status(500).json({ error: 'Error getting cart contents' });
    }
};

module.exports = { createCart, addSuplementToCart, getCartById, getAllCarts };