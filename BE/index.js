const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRouter");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();

mongoose
    .connect(process.env.DB_URL)
    .then(() =>
        console.log("connect success"))
    .catch((error) => {
        console.log(err);
    });

app.use(express.json());
app.use(bodyParser.json());
app.use("/api/user", userRouter)

app.listen(process.env.PORT || 8000, () => {
    console.log("Server is runing!");
})
//hehe