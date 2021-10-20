const express = require("express");
const router = express.Router();
const MainController = require("../controllers/MainController");
router.get("/cep/:number", MainController.getAddressByCep);
//router.get('/rota', controller)

module.exports = router;
