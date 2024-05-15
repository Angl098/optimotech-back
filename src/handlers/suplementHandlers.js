
const { getSuplements, getSuplementByName, getSuplementById, createSuplement } = require('../controllers/suplementControllers');
const cloudinaryPush = require("../utils/cloudinaryPush")
const path = require("path");
//por query
const getSuplementsHandler = async (req, res) => {
    const { name } = req.query;
    try {
        if (name) {
            const response = await getSuplementByName(name);
            res.status(200).json(response);
        } else {
            const response = await getSuplements();
            res.status(200).json(response);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


//por params
const getSuplementByIdHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await getSuplementById(id);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

//por body
const createSuplementHandler = async (req, res) => {
    const { name, category, description, price, amount } = req.body;
    const images = req.files;
    try {
        // Obtener las rutas de las imágenes
        const imagePaths = images.map((image) =>
            path.join(__dirname, "../public/img/upload", image.filename)
        );
        const uploadedImageUrls = await cloudinaryPush(imagePaths);

        let suplementData = {
            name,
            description,
            price,
            image: uploadedImageUrls[0],
            amount,
        };

        const response = await createSuplement(suplementData, CATE);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const getFilteredSuplementsHandler = async (req, res) => {

    const {
        category,
        orderBy,
        orderDirection
    } = req.query;

    try {
        const suplements = await getFilteredSuplementsController(
            category,
            orderBy,
            orderDirection
        );
        return res.json(suplements);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

module.exports = { getSuplementsHandler, getSuplementByIdHandler, createSuplementHandler , getFilteredSuplementsHandler }