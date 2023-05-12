const mongoose = require("mongoose");

const salesReportSchema = new mongoose.Schema(
    {
        date: { type: Date, require: true, unique: true },
        totalSales: { type: Number, require: true },
        numberOfOrder: { type: Number, require: true },
    },
    {
        timestamps: true,
        collection: "salesReports",
    }
);
module.exports = mongoose.model("salesReport", salesReportSchema);