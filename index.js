import express from "express"; 
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

let cards = [];

app.get("/", async (req, res) => {
  try {
    const result = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=494");
    const names = Array.isArray(result.data.results) ? result.data.results.map(p => p.name) : [];
    res.render("index", { names, cards });
  } catch (err) {
    console.error("Error fetching Pokémon list:", err.message);
    res.render("index", { names: [], cards });
  }
});

app.post("/add", async (req, res) => {
  const name = req.body.pokemon;

  if (!name) return res.redirect("/");

  // Limit to 6
  if (cards.length >= 6) return res.redirect("/");

  // prevent duplicate cards
  //if (cards.some(c => c.name === name)) return res.redirect("/");

  try {
    const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = result.data;

    const type1 = data.types[0]?.type?.name || "";
    const type2 = data.types[1]?.type?.name || "";
    const sprite = data.sprites?.front_default || "";

    const abilities = data.abilities.map(a => ({
      name: a?.ability?.name || "",
      hidden: a?.is_hidden || false
    }));

    const newCard = {
      name: data.name,
      type: type1,
      type2,
      sprite,
      abilities
    };
    cards.push(newCard);
  } catch (err) {
    console.error("Error fetching Pokémon:", err.message);
  }

  res.redirect("/");
});

app.post("/clear", (req, res) => {
  cards = [];
  res.redirect("/");
});

app.post("/clear-self", (req, res) => {
  const index = parseInt(req.body.index);

  if (!isNaN(index) && index >= 0 && index < cards.length) {
    cards.splice(index, 1);
  }

  res.redirect("/");
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
