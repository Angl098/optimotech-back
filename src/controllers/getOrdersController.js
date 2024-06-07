const { Op } = require('sequelize');
const { Orden, OrdenSuplement, Suplement, User } = require('../db')

const getOrdersController = async (req, res) => {
    const { fecha, orderBy, orderDirection, page = 1, pageSize = 7 } = req.query;
    let order = [];
    if (orderBy && orderDirection) {
        order = [[orderBy, orderDirection]]
    }
    let where = {};

    
    if (fecha) {
        const startDate = new Date(fecha);
        const endDate = new Date(fecha);
        endDate.setDate(endDate.getDate() + 1);

        where = {
            ...where,
            createdAt: {
                [Op.between]: [startDate, endDate]
            }
        };
    }

    try {
        let include = [];

        const offset = (page - 1) * pageSize;

        const body = {
            include,
            where,
            order,
            limit: pageSize,
            offset
        }
        
        // Realizar la consulta con Sequelize
        const { count, rows } = await Orden.findAndCountAll(body);
        // Calcular el número total de páginas
        const totalPages = Math.ceil(count / pageSize);
        
        // Devolver los suplementos filtrados, el número total de páginas y la página actual
        
        res.json({
            totalPages,
            currentPage: page,
            pageSize,
            totalItems: count,
            items: rows
        });

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