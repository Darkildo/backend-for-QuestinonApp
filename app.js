const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/auth");

const keys = require("./config/keys");
const app = express();

mongoose
  .connect(keys.mongoURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("DB Connected!"))
  .catch((err) => {
    console.log(`DB Connection Error: ${err.message}`);
  });
app.use(passport.initialize());
require("./middleware/passport")(passport);

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);

module.exports = app;
