import express from "express"; 
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));

// app.get("/", async (req, res) => {
//     try {
//     const result = await axios.get("https://pokeapi.co/api/v2/pokemon/charizard");
//         res.render("index.ejs", {
//         name: result.data.name,
//         type: result.data.types[0].type.name,
//         type2: result?.data?.types?.[1]?.type?.name || '',
//         sprite: result.data.sprites.front_default,
//     });
//     }
//         catch (error) {
//         console.log(error.response.data);
//         res.status(500);
//     }
// });

app.get("/", async (req, res) => {
  try {
    const result = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=10");

    // Extract names
    const names = result?.data?.results?.map(item => item.name) || [];

    res.render("index.ejs", { names });
  } catch (error) {
    res.status(500).send("Error fetching data: " + error.message);
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});