var express = require('express');

const { get, show, create, update, del } = require("../controller/materials/index");
const { runValidator, postValidator, putValidator } = require("../controller/materials/validation");
const router = express.Router();

router.get("/", get);
router.get("/:id", show);
router.post("/", postValidator, runValidator, create);
router.put("/", putValidator, runValidator, update);
router.delete("/", del);

module.exports = router;
