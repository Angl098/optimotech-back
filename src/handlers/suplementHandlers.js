
const { getSuplements, getSuplementByName, getSuplementById, createSuplement, getAllSuplementsController } = require('../controllers/suplementControllers');
const cloudinaryPush= require("../utils/cloudinaryPush")
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
const getAllSuplements = async (req, res) => {
    try {
            const response = await getAllSuplementsController();
            res.status(200).json(response);
        
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
    const { name, category, description, price, image, amount } = req.body;
    const images = req.files;
    try {
        // Obtener las rutas de las imágenes
        const imagePaths = images.map((image) =>
            path.join(__dirname, "../public/img/upload", image.filename)
        );
        console.log(imagePaths);
        const uploadedImageUrls = await cloudinaryPush(imagePaths);
        console.log("backend");
        console.log(uploadedImageUrls);
        let suplementData = {
            name,
            category,
            description,
            price,
            image:uploadedImageUrls[0],
            amount,
          };

        const response = await createSuplement(suplementData);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { getSuplementsHandler, getSuplementByIdHandler, createSuplementHandler ,getAllSuplements}