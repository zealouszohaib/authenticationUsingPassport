const express = require("express");
const router = require("./lib/router");
const morgan = require("morgan");

const app = express();

const port = 3000;

let _ = {};

_.start = () => {
  try {
    
    app.listen(port);
    console.log(`Express Server running on the port ${port}`);
  } catch (error) {
    throw new Error(error);
  }
};

app.use(express.json())
app.use(morgan("dev"));
app.use("/api/v1", router);


_.start();
