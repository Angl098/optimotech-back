const {Router} = require("express");
const upload = require("../Midleware/Upload"); // Importa el middleware de Multer

const suplementRouter = Router();

//Importa los handlers
const { getSuplementsHandler, 
    getSuplementByIdHandler, 
    createSuplementHandler, 
    getFilteredSuplementsHandler,
    editSuplementHandler } = require("../handlers/suplementHandlers");

//Rutas
suplementRouter.get("/", getSuplementsHandler);
suplementRouter.get("/filter", getFilteredSuplementsHandler);
suplementRouter.get("/:id", getSuplementByIdHandler);
suplementRouter.post("/", upload.array("images", 3), createSuplementHandler);
suplementRouter.put("/:id", editSuplementHandler);


module.exports = suplementRouter;