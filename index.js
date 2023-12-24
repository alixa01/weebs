const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  try {
    const [populerAnime, rekomendasiAnime] = await axios.all([
      axios.get("https://api.jikan.moe/v4/top/anime?limit=10"),
      axios.get("https://api.jikan.moe/v4/top/manga?limit=10"),
    ]);

    const populerData = populerAnime.data.data;
    const rekomendasiData = rekomendasiAnime.data.data;

    res.render("index.ejs", {
      populerData: populerData,
      rekomendasiData: rekomendasiData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/popular", async (req, res) => {
  try {
    const response = await axios.get("https://api.jikan.moe/v4/anime");
    res.render("popular.ejs", { animeData: response.data.data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    const response = await axios.get(
      `https://api.jikan.moe/v4/anime?q=${query}`
    );
    res.render("search.ejs", { query, animeData: response.data.data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, function () {
  console.log(`Server Running on Port ${port}`);
});
