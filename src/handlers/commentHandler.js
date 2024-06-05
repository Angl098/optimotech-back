const { createComment, replyToComment, getCommentsBySuplementId } = require("../controllers/commentController.js");

const createCommentHandler = async (req, res) => {
    const { content, userId, suplementId, parentId } = req.body;
    try {
        const response = await createComment(content, userId, suplementId, parentId);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const replyToCommentHandler = async (req, res) => {
    const { content, userId, commentId } = req.body;
    try {
        const response = await replyToComment(content, userId, commentId);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getCommentsBySuplementIdHandler = async (req, res) => {
    const { suplementId } = req.params;
    try {
        const response = await getCommentsBySuplementId(suplementId);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    createCommentHandler,
    replyToCommentHandler,
    getCommentsBySuplementIdHandler
}
