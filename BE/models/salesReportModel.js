const mongoose = require("mongoose");

const salesReportSchema = new mongoose.Schema(
    {
        date: { type: Date, require: true, unique: true },
        totalSales: { type: Number, default: 0 },
        numberOfOrders: { type: Number, default: 0 },
        totalUsers: { type: Number, default: 0 },
        totalProducts: { type: Number, default: 0 },
    },
    {
        timestamps: true,
        collection: "salesReports",
    }
);
module.exports = mongoose.model("salesReport", salesReportSchema);