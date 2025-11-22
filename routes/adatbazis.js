const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Adatbázis menü – 3 tábla adatai
router.get("/adatbazis", (req, res) => {
    // 1. Filmek
    const sqlFilmek = "SELECT fkod, filmcim, mufaj, hossz FROM film ORDER BY filmcim LIMIT 50";

    // 2. Mozik
    const sqlMozik = "SELECT moziazon, mozinev, irszam, cim FROM mozi ORDER BY mozinev";

    // 3. Vetítések (JOIN)
    const sqlVetitesek = `
        SELECT 
            film.filmcim,
            mozi.mozinev
        FROM hely
        JOIN film ON hely.fkod = film.fkod
        JOIN mozi ON hely.moziazon = mozi.moziazon
        ORDER BY film.filmcim, mozi.mozinev
        LIMIT 100
    `;

    db.query(sqlFilmek, (err, filmek) => {
        if (err) {
            console.log(err);
            return res.send("Hiba a filmek lekérdezésekor.");
        }

        db.query(sqlMozik, (err2, mozik) => {
            if (err2) {
                console.log(err2);
                return res.send("Hiba a mozik lekérdezésekor.");
            }

            db.query(sqlVetitesek, (err3, vetitesek) => {
                if (err3) {
                    console.log(err3);
                    return res.send("Hiba a vetítések lekérdezésekor.");
                }

                res.render("adatbazis", {
                    user: req.session.user,
                    filmek,
                    mozik,
                    vetitesek
                });
            });
        });
    });
});

module.exports = router;
