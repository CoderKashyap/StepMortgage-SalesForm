const express = require("express");
const { sendLeadToSalesforce } = require("../controllers/userController");


const router = express.Router();

router.route("/sendLeadToSalesforce").post(sendLeadToSalesforce);


module.exports = router;
