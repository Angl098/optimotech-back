const { createCategory, getAllCategoryController, updateCategory } = require("../controllers/categoryController");

const createCategoryHandler = async (req, res) => {
    const { name } = req.body;
    try {
        const response = await createCategory(name);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const updateCategoryHandler = async (req, res) => {
    const { id , name } = req.body;
    try {
        const response = await updateCategory(id,name);
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

module.exports = { createCategoryHandler, getCategoryHandler,updateCategoryHandler }