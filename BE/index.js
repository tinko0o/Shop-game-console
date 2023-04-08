const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRouter");
const bodyParser = require("body-parser");
const cors = require('cors')
dotenv.config();

const app = express();

mongoose
    .connect(process.env.DB_URL)
    .then(() =>
        console.log("connect success"))
    .catch((error) => {
        console.log(err);
    });

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
    });
app.use(express.json());
app.use(bodyParser.json());
app.use("/api/user", userRouter)
app.use(cors());
app.listen(process.env.PORT || 8000, () => {
    console.log("Server is runing! port:"+process.env.PORT);
})
//hehe