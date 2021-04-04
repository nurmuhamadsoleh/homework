var express = require('express');

const { create, get } = require("../controller/presences/index");
const router = express.Router();
const { checkToken }= require("../middleware/jwt");

router.get("/join/kelas",checkToken, get);
router.post("/",checkToken, create);

module.exports = router;
