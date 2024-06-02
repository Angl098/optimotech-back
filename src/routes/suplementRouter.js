const {Router} = require("express");
const upload = require("../Middleware/upload"); // Importa el middleware de Multer

const suplementRouter = Router();

//Importa los handlers
const { getSuplementsHandler, getSuplementByIdHandler, createSuplementHandler, getFilteredSuplementsHandler, getRandomSuplementsHandler, updateSuplementHandler } = require("../handlers/suplementHandlers");

//Rutas
suplementRouter.get("/", getSuplementsHandler);
suplementRouter.get("/randomSuplementes", getRandomSuplementsHandler);
suplementRouter.get("/filter", getFilteredSuplementsHandler);
suplementRouter.get("/:id", getSuplementByIdHandler);
suplementRouter.post("/", upload.array("images", 3), createSuplementHandler);
suplementRouter.put("/:id", upload.array("images", 3), updateSuplementHandler);

module.exports = suplementRouter;