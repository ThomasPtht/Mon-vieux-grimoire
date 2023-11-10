const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, //unique : un seul utilisateur avec cette adresse
  password: { type: String, required: true },
});

// Utilisation du plugin "uniqueValidator" pour s'assurer que le mail de l'utilisateur est unique
// Améliore les messages d'erreur
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
