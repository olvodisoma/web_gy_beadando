const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../config/db");

/* ============================
   LOGIN PAGE
   ============================ */
router.get("/login", (req, res) => {
    res.render("login", {
        error: null,
        user: req.session.user
    });
});

/* ============================
   REGISTER PAGE
   ============================ */
router.get("/register", (req, res) => {
    res.render("register", {
        error: null,
        user: req.session.user
    });
});

/* ============================
   REGISTER SUBMIT
   ============================ */
router.post("/register", (req, res) => {
    const { email, password, confirm } = req.body;

    if (!email || !password || !confirm) {
        return res.render("register", {
            error: "Minden mező kitöltése kötelező!",
            user: null
        });
    }

    if (password !== confirm) {
        return res.render("register", {
            error: "A két jelszó nem egyezik!",
            user: null
        });
    }

    const hashed = bcrypt.hashSync(password, 10);

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
        if (rows.length > 0) {
            return res.render("register", {
                error: "Ez az e-mail cím már regisztrálva van!",
                user: null
            });
        }

        db.query(
            "INSERT INTO users (email, password, role) VALUES (?, ?, 'user')",
            [email, hashed],
            (err) => {
                if (err) {
                    console.log(err);
                    return res.render("register", {
                        error: "Ismeretlen hiba történt.",
                        user: null
                    });
                }

                // LINUX FIX → prefix hozzáadása
                res.redirect("/app030/login");
            }
        );
    });
});

/* ============================
   LOGIN SUBMIT
   ============================ */
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render("login", {
            error: "Minden mező kötelező!",
            user: null
        });
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
        if (err || rows.length === 0) {
            return res.render("login", {
                error: "Hibás email vagy jelszó!",
                user: null
            });
        }

        const user = rows[0];

        if (!bcrypt.compareSync(password, user.password)) {
            return res.render("login", {
                error: "Hibás email vagy jelszó!",
                user: null
            });
        }

        req.session.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        // LINUX FIX → főoldal prefixelve
        res.redirect("/app030/");
    });
});

/* ============================
   LOGOUT
   ============================ */
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        // LINUX FIX → prefixelés
        res.redirect("/app030/");
    });
});

module.exports = router;
