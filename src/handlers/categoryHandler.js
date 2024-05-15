const { createCategory, getAllCategoryController } = require("../controllers/categoryController");

const createCategoryHandler = async (req, res) => {
    const { name } = req.body;
    try {
        const response = await createCategory(name);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const getCategoryHandler = async (req, res) => {
    const { name } = req.query;
    try {
        const response = await getAllCategoryController(name);
        res.status(200).json(response);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { createCategoryHandler, getCategoryHandler }