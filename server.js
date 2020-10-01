const express = require("express");
// const config = require("config");
const debug = require("debug");
const passport = require("passport");
const cors = require("cors");
const session = require("express-session");
const flash = require("connect-flash");
const bodyParser = require("body-parser");

// imported files
var db = require("./dbSetup");
require("./passport/index")(passport);

setInterval(function () {
  db.query("SELECT 1");
}, 5000);

// Initialize Express App
const app = express();

// BodyParser MiddleWare
app.use(express.json());

// CORS package
app.use(
  cors({
    origin:
      "https://5f75ff874be864735a277322--jovial-bhaskara-3e555a.netlify.app/",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(flash());
// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

app.use(
  session({
    cookie: { maxAge: 60000 },
    secret: "edunomics",
    resave: false,
    saveUninitialized: false,
  })
);

const aggregate = require("./routes/aggregate");
const customer = require("./routes/customer");
const trucker = require("./routes/trucker");

var createTables = require("./db_functions/index");

// Creating Database
db.connect(function (err) {
  if (err) throw err;
  console.log("Connected");
});

app.use("/api/aggregate", aggregate);
app.use("/api/customer", customer);
app.use("/api/trucker", trucker);

app.get("/", function (req, res) {
  res.send("welcome to the app");
});

createTables();

// Set PORT and start server

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
