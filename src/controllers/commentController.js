const { Comment, User, Suplement } = require('../db');

const createComment = async (content, userId, suplementId, parentId = null) => {
    try {
        const newComment = await Comment.create({
            content,
            userId,
            suplementId,
            parentId
        });
        return newComment;
    } catch (error) {
        throw new Error('Error creating comment: ' + error.message);
    }
};

const replyToComment = async (content, userId, commentId) => {
    try {
        const parentComment = await Comment.findByPk(commentId);
        if (!parentComment) {
            throw new Error('Parent comment not found');
        }

        const newComment = await Comment.create({
            content,
            userId,
            suplementId: parentComment.suplementId,
            parentId: commentId
        });
        return newComment;
    } catch (error) {
        throw new Error('Error replying to comment: ' + error.message);
    }
};

const getCommentsBySuplementId = async (suplementId) => {
    try {
        const comments = await Comment.findAll({
            where: { suplementId ,parentId: null},
            include: [
                { model: User, attributes: ['id', 'name'] },
                { model: Comment, as: 'responses', include: [{ model: User, attributes: ['id', 'name'] }]  }
            ],
            order: [['createdAt', 'ASC']]
        });
        return comments;
    } catch (error) {
        throw new Error('Error fetching comments: ' + error.message);
    }
};

module.exports = {
    createComment,
    replyToComment,
    getCommentsBySuplementId
};
