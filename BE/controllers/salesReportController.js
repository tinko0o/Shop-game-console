const jwt = require("jsonwebtoken");
const SalesReport = require("../models/salesReportModel");
const User = require("../models/userModel");

//get sales reports

//http://localhost:8080/api/sales-reports?startYear=2022&startMonth=1&endYear=2022&endMonth=3
//nếu ko có gì truyền vào thì hiện tất cả

exports.getSalesReports = async (req, res) => {
  try {
    const token = req.headers.authentication;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const key = process.env.JWT_SEC;
    const decoded = jwt.verify(token, key);
    const user = await User.findOne({ email: decoded.email });
    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
    const startYear = parseInt(req.query.startYear) || (new Date().getFullYear() - 1);
    const startMonth = parseInt(req.query.startMonth) || 1;
    const endYear = parseInt(req.query.endYear) || new Date().getFullYear();
    const endMonth = parseInt(req.query.endMonth) || 12;
    const startDate = new Date(startYear, startMonth - 1, 1);
    const endDate = new Date(endYear, endMonth, 0, 23, 59, 59, 999);

    const salesReports = await SalesReport.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $sort: { date: -1 },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalSales: { $sum: "$totalSales" },
          numberOfOrder: { $sum: "$numberOfOrders" },
          totalUsers: { $sum: "$totalUsers" },
          totalProducts: { $sum: "$totalProducts" },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: { format: "%Y-%m", date: { $toDate: { $concat: [ { $toString: "$_id.year" }, "-", { $toString: "$_id.month" }, "-01" ] } } }
          },
          totalSales: 1,
          numberOfOrder: 1,
          totalUsers: 1,
          totalProducts: 1
        }
      }
    ]);
    res.json({ success: true, data: salesReports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
};

