import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("✅ Verifactu app (dev) funcionando — Hola, Ksenia & Isaak!");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor en ${PORT}`));
