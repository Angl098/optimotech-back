const { createTag, updateTag, getAllTagsController } = require("../controllers/tagController");

const createTagHandler = async (req, res) => {
    const { name } = req.body;
    try {
        const response = await createTag(name);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const updateTagHandler = async (req, res) => {
    const { id , name } = req.body;
    try {
        const response = await updateTag(id,name);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const getTagHandler = async (req, res) => {
    const { name } = req.query;
    try {
        const response = await getAllTagsController(name);
        res.status(200).json(response);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { createTagHandler, getTagHandler,updateTagHandler }