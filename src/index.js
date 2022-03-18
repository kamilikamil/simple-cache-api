require("dotenv").config();

const express = require("express");

const database = require("./database");

const app = express();

const port = process.env.PORT || 6060;

app.use(express.json());

//try to connect to db first before starting the server
database.connectToServer(function (error) {
  if (error) {
    console.error("MongoDB connection failed");
    console.error(error);
    return;
  }

  console.log("Successfully connected to MongoDB.");

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});
