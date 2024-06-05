const { Router } = require("express");
const { createCommentHandler, replyToCommentHandler, getCommentsBySuplementIdHandler } = require("../handlers/commentHandler");

const commentsRouter = Router();

// Rutas
commentsRouter.post("/", createCommentHandler);
commentsRouter.post("/reply", replyToCommentHandler);
commentsRouter.get("/:suplementId", getCommentsBySuplementIdHandler);

module.exports = commentsRouter;
