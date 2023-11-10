module.exports = (req, res, next) => {
  // Validation de l'e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(req.body.email)) {
    return res.status(400).json({ message: "Adresse e-mail invalide" });
  }

  // Validation du mot de passe
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{10,}$/;
  if (!passwordRegex.test(req.body.password)) {
    return res.status(400).json({
      message:
        "Le mot de passe doit contenir au moins 10 caractères, dont une majuscule et un chiffre",
    });
  }

  next();
};
