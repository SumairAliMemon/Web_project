const express = require("express");
const { getUserAnnouncements} = require("../Controller/announcement");
const {verifyToken} = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/" , verifyToken, getUserAnnouncements);


module.exports = router;
