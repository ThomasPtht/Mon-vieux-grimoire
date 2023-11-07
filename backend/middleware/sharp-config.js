const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises;

async function sharpMiddleware(req, res, next) {
  if (req.file) {
    const imagePath = req.file.path;

    try {
      const resizedImageData = await sharp(imagePath)
        .resize(300, null, {
          fit: "inside",
        })
        .jpeg({ quality: 80 })
        .toBuffer();

      await fs.writeFile(imagePath, resizedImageData);

      // Continuez avec la logique de la route
      next();
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Erreur lors du traitement de l'image." });
    }
  } else {
    // Si aucune image n'a été téléchargée, passez simplement à la suite de la logique de la route.
    next();
  }
}

module.exports = sharpMiddleware;
