const express = require("express");
const mongoose = require("mongoose");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const { timeStamp } = require("console");

const app = express();
const PORT = 3000;

mongoose
  .connect("mongodb://localhost:27017/short-url", {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use(express.json());

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;

  try {
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      },
      { new: true }
    );

    if (!entry) {
      return res.status(404).send("Shortened URL not found");
    }

    res.redirect(entry.redirectURL);
  } catch (error) {
    console.error("Error processing shortened URL:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
