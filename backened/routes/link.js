import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { target_url, code } = req.body;

  try {
    try { new URL(target_url); }
    catch { return res.status(400).json({ error: "Invalid URL" }); }

    const existing = await pool.query("SELECT * FROM links WHERE code=$1", [code]);

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Code already exists" });
    }

    const result = await pool.query(
      "INSERT INTO links (code, target_url) VALUES ($1, $2) RETURNING *",
      [code, target_url]
    );

    const saved = result.rows[0];
    saved.short_url = `http://localhost:8000/${saved.code}`;

    res.json(saved);

  } catch (err) {
    console.log("err are ====>",err)
    res.status(500).json({ error: "Server error" });
  }
});

// router.get("/:code", async (req, res) => {
//   const { code } = req.params;

//   const result = await pool.query("SELECT * FROM links WHERE code=$1", [code]);

//   if (result.rows.length === 0) {
//     return res.status(404).send("Not Found");
//   }

//   const link = result.rows[0];

  
//   await pool.query(
//     "UPDATE links SET click_count = click_count + 1, last_clicked = NOW() WHERE code=$1",
//     [code]
//   );

//   res.redirect(302, link.target_url);
// });
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM links ORDER BY created_at DESC"
    );

    const final = result.rows.map(row => ({
      ...row,
      short_url: `http://localhost:9000/${row.code}`
    }));

    res.json(final);

  } catch (err) {
    console.error("GET /api/links error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.delete("/:code", async (req, res) => {
  const { code } = req.params;

  const result = await pool.query("DELETE FROM links WHERE code=$1", [code]);

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json({ success: true });
});


router.get("/:code", async (req, res) => {
  const { code } = req.params;

  try {
    const result = await pool.query(
      "SELECT code, target_url, click_count, created_at, last_clicked FROM links WHERE code = $1",
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    const row = result.rows[0];

    // respond with exactly the fields the frontend will expect
    return res.json({
      code: row.code,
      target_url: row.target_url,
      click_count: row.click_count,
      created_at: row.created_at,
      last_clicked: row.last_clicked,
      short_url: `${process.env.BASE_URL || "http://localhost:8000"}/${row.code}`
    });
  } catch (err) {
    console.error("GET /api/links/:code error", err);
    return res.status(500).json({ error: "Server error" });
  }
});




export default router;
