
const { getSuplements, getSuplementByName, getSuplementById, createSuplement, getFilteredSuplementsController, getRandomSuplements, updateSuplement } = require('../controllers/suplementControllers');
const cloudinaryPush = require("../utils/cloudinaryPush")
const path = require("path");
const deleteImageFromCloudinary = require('../utils/deleteImageFromCloudinary');
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
const getRandomSuplementsHandler = async (req, res) => {
    try {
        const response = await getRandomSuplements();
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

        const response = await createSuplement(suplementData, category);
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
    console.log(req.query);
    try {
        const suplements = await getFilteredSuplementsController(
            req.query
        );
        return res.json(suplements);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}


const updateSuplementHandler = async (req, res) => {
    const { id } = req.params;
    const { name, category, description, price, amount } = req.body;
    const images = req.files;

    try {
        const existingSuplement = await getSuplementById(id);
        if (!existingSuplement) {
            return res.status(404).json({ error: 'Suplemento no encontrado' });
        }

        let suplementData = {
            name,
            description,
            price,
            amount,
        };

        if (images && images.length > 0) {
            // Eliminar la imagen actual de Cloudinary
            const publicId = existingSuplement.image.split('/').pop().split('.')[0];
            console.log(publicId);
            await deleteImageFromCloudinary(publicId);

            // Obtener las rutas de las nuevas imágenes
            const imagePaths = images.map((image) =>
                path.join(__dirname, "../public/img/upload", image.filename)
            );
            const uploadedImageUrls = await cloudinaryPush(imagePaths);
            suplementData.image = uploadedImageUrls[0];
        }

        const response = await updateSuplement(id, suplementData, category);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
module.exports = {
    getSuplementsHandler,
    getSuplementByIdHandler,
    createSuplementHandler,
    getFilteredSuplementsHandler,
    getRandomSuplementsHandler,
    updateSuplementHandler
}