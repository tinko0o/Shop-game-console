const router = require("express").Router();
const salesReportController = require("../controllers/salesReportController");

//user


//admin
router.get("",salesReportController.getSalesReports);

module.exports = router;