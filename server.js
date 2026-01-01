require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors({
  origin: "*",   // GitHub Pages + future domains allow
}));
app.use(express.json());

/* ================= DATABASE ================= */
connectDB();

/* ================= ROUTES ================= */
app.use("/api/contact", contactRoutes);

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
  res.send("Backend running successfully 🚀");
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
