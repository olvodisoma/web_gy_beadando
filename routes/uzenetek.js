const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { isLoggedIn } = require("../middleware/auth");

// Üzenetek lista – csak bejelentkezett felhasználónak
router.get("/uzenetek", isLoggedIn, (req, res) => {
    const sql = `
        SELECT id, name, email, subject, message, created_at
        FROM uzenetek
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return res.send("Hiba az üzenetek lekérdezésekor.");
        }

        res.render("uzenetek", {
            messages: rows
        });
    });
});

module.exports = router;