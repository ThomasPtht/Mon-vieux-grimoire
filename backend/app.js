// Importation des modules nécessaires
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();

//Importation des fichiers de routes
const booksRoutes = require("./routes/books");
const userRoutes = require("./routes/user");

//Connexion à la BDD MongoDB
mongoose
  .connect(
    "mongodb+srv://tpotherat:T24058789p@cluster0.wjaqgsz.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Initialisation de l'application Express
const app = express();

// Configuration des paramètres de sécurité CORS :
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Configuration de l'analyse des données JSON dans les requêtes
app.use(bodyParser.json());

// Configuration des routes pour les livres et l'authentification des utilisateurs
app.use("/api/books", booksRoutes);
app.use("/api/auth", userRoutes);
// Configuration de la gestion des images
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
