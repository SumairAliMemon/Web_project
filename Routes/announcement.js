const express = require("express");
const { getUserAnnouncements} = require("../Controller/announcement");

const router = express.Router();


router.get("/", getUserAnnouncements);

module.exports = router;
