const { createProvider, getAllProvidersController, updateProvider } = require("../controllers/providerController");

const createProviderHandler = async (req, res) => {
    const { name } = req.body;
    try {
        const response = await createProvider(name);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const updateProviderHandler = async (req, res) => {
    const { id , name } = req.body;
    try {
        const response = await updateProvider(id,name);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const getProviderHandler = async (req, res) => {
    const { name } = req.query;
    try {
        const response = await getAllProvidersController(name);
        res.status(200).json(response);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { getProviderHandler, updateProviderHandler,createProviderHandler }