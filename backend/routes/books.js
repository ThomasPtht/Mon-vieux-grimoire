const express = require("express");
const auth = require("auth");
const router = express.Router();

const Book = require("../models/Book");

const booksCtrl = require("../controllers/books");

//Routes :
router.post("/", auth, booksCtrl.createBook);
router.put("/:id", auth, booksCtrl.modifyBook);
router.delete("/:id", auth, booksCtrl.deleteBook);
router.get("/:id", auth, booksCtrl.getOneBook);
router.get("/", auth, booksCtrl.getAllBooks);

module.exports = router;
