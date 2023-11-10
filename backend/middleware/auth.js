const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

// Middleware pour vérifier et décoder un token JWT dans les en-têtes de la requête
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Récupère le token JWT à partir de l'en-tête "Authorization"
    const decodedToken = jwt.verify(token, jwtSecret); // Vérifie et décode le token en utilisant la clé secrète stockée dans les variables d'environnement
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId, // Stock l'ID de l'utilisateur dans l'objet "auth" de la requête pour l'exploiter dans nos routes.
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
