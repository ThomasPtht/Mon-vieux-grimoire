const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router(); // Création  d'un routeur express pour gérer les routes
const multer = require("../middleware/multer-config");
const sharpMiddleware = require("../middleware/sharp-config");

const booksCtrl = require("../controllers/books");

// Définition des routes :
router.get("/", booksCtrl.getAllBooks);
router.get("/bestrating", booksCtrl.bestRating);
router.post("/", auth, multer, sharpMiddleware, booksCtrl.createBook);
router.post("/:id/rating", auth, booksCtrl.rating);
router.get("/:id", booksCtrl.getOneBook);
router.put("/:id", auth, multer, sharpMiddleware, booksCtrl.modifyBook);
router.delete("/:id", auth, booksCtrl.deleteBook);

module.exports = router;
