import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./db.js";
import linkRoutes from "./routes/link.js";

dotenv.config();
const app = express();
const PORT = 9000;


app.use(cors({
     origin: [
    "http://localhost:5173",
    "https://tiny-url-2-degy.onrender.com",
    "https://voluble-rabanadas-e7da3e.netlify.app"
  ],
    methods: ["GET", "POST", "PUT", "DELETE"],
}));


// Body parser
app.use(express.json());

app.set("db", pool);

// Health check
app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true, version: "1.0" });
});


app.use("/api/links", linkRoutes);


app.get("/:code", async (req, res) => {
  const { code } = req.params;

  try {
    const result = await pool.query("SELECT * FROM links WHERE code = $1", [code]);

    if (result.rows.length === 0)
      return res.status(404).send("Not found");

    const link = result.rows[0];

    await pool.query(
      "UPDATE links SET click_count = click_count + 1, last_clicked = NOW() WHERE code = $1",
      [code]
    );

    return res.redirect(302, link.target_url);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
