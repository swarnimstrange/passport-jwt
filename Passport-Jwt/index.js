const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const PORT = process.env.PORT || 5000;

mongoose.connect("mongodb://localhost:27017/jwt");

const con = mongoose.connection;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());
require("./models/passport");

con.on("open", () => {
  console.log("connected...");
});

const userRouter = require("./routes/user");
app.use("/", userRouter);

app.listen(PORT, console.log(`Server connected on ${PORT}`));
