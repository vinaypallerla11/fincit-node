const express = require("express");
const { request } = require("http");
const cors = require('cors');
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");


const dbPath = path.join(__dirname, "user.db");
const app = express();

app.use(express.json());
app.use(cors());


let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(5000, () => {
      console.log("Server Running at http://localhost:5000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(-1);
  }
};
initializeDBAndServer();

app.get("/projects/", async (request, response) => {
  const projectQuery = `SELECT * FROM user;`; // Corrected table name to "users"
  const result = await db.all(projectQuery);
  response.send(result);
});

app.post("/projects/", async (request, response) => {
  const { name, link, description } = request.body;
  const insertQuery = `
      INSERT INTO user(name, link, description)
      VALUES('${name}','${link}','${description}');`;
  const result = await db.run(insertQuery);
  response.send("User posted successfully");
});


app.delete("/projects/", async (request, response) => {
  const { name, link, description } = request.body;
  const deleteQuery = `
    DELETE FROM user WHERE link = '';`;
  const result = await db.run(deleteQuery);
  response.send("User deleted successfully");
});

app.put("/projects/", async (request, response) => {
  const { name, link, description } = request.body;
  const updateQuery = `
    UPDATE user
    SET link = 'https://media.cnn.com/api/v1/images/stellar/prod/200310023921-dubai-buildings-skyline.jpg?q=w_2000,c_fill/f_webp', 
        description = 'Being you, luxury is nothing new. For a high-flyer, you’ve always experienced life at the very top with premium 3 bhk & 4 bhk luxurious Flats in Hyderabad. And now we take it many notches higher – by 36 floors! At My Home Bhooja, luxury property sees even greater heights. Spread across 18 acres. My Home Bhooja, gated community in Hyderabad with exclusive 3bhk flats & 4bhk flats is situated in most premium location – HITEC City.'
    WHERE name = 'My Home Bhooja';`;
  const result = await db.run(updateQuery);
  response.send("User updated successfully");
});


