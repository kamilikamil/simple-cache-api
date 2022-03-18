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

    console.log(`TTL of cache is: ${process.env.TTL_SECONDS || 10} seconds`);

    console.log(`Max cache entries is: ${process.env.MAX_ENTRIES || 10}`);
  });
});
app.post("/insert", async function (req, res) {
  const { key, value } = req.body;

  if (!key) {
    res.status(400);
    res.send({ msg: "key cannot be empty" });
    return;
  }

  if (!value) {
    res.status(400);
    res.send({ error: { msg: "Value cannot be empty" } });
    return;
  }

  let result;
  try {
    result = await database.add(key, value);
  } catch (error) {
    res.status(500);
    res.send({ error: { msg: "Unexpected Error." } });
    return;
  }

  const { state } = result;

  if (state === "updated") {
    res.status(200);
  } else {
    res.status(201);
  }

  res.send({ error: null, key: result.key, value: result.value });
});
  });
});
