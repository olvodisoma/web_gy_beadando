const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET /kapcsolat – űrlap megjelenítése
router.get("/kapcsolat", (req, res) => {
    const success = req.query.success === "1";
    const error = req.query.error || null;
    res.render("kapcsolat", { success, error });
});

// POST /kapcsolat – űrlap feldolgozása, mentés adatbázisba
router.post("/kapcsolat", (req, res) => {
    const { nev, email, targy, uzenet } = req.body;

    // Egyszerű ellenőrzés
    if (!nev || !email || !uzenet) {
        return res.render("kapcsolat", {
            success: false,
            error: "Név, e-mail és üzenet megadása kötelező!"
        });
    }

    const sql = `
        INSERT INTO uzenetek (name, email, subject, message)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [nev, email, targy || null, uzenet], (err) => {
        if (err) {
            console.log(err);
            return res.render("kapcsolat", {
                success: false,
                error: "Hiba történt az üzenet mentésekor."
            });
        }

        // Siker esetén redirect, hogy F5-re ne küldje újra az űrlapot
        res.redirect("/app030/kapcsolat?success=1");
    });
});

module.exports = router;
