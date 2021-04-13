const express = require('express')
const app = express()
const port = 3000;
var cors = require("cors");
var compression = require("compression");
var bodyParser = require("body-parser");
var db = require("./db/db")

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

app.use(bodyParser.json({ limit: '150mb' }));
app.use(bodyParser.urlencoded({ extended: false }))


app.use("/api", require("./route/api"));

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})
