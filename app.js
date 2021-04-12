const express = require('express')
const app = express()
const port = 3000;
var cors = require("cors");
var compression = require("compression");
var bodyParser = require("body-parser");
var passport = require("passport");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);

app.use(cors({
  credentials: true,
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
}));
app.use(compression());

db.connect("mongodb://localhost", { useUnifiedTopology: true }, (err) => {
  if (err) {
    return console.log("unable to connect to db");
  }
  return console.log("connected to db");
});

app.use(cookieParser("truckx-n6v0e6"));

let sesObj = {
  name: "winnow",
  secret: "truckx-n6v0e6",
  resave: false,
  store: new MongoStore({
    url: "mongodb://localhost"
  }),
  saveUninitialized: false,
  domain: ""
};

//  app.use(session(sesObj));
//  app.use(passport.initialize());
//  app.use(passport.session());

app.use("/api", require("./route/api"));

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})
