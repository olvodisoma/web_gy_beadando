const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../config/db");

// LOGIN PAGE
router.get("/login", (req, res) => {
    res.render("login", { user: req.session.user });
});

// REGISTER PAGE
router.get("/register", (req, res) => {
    res.render("register", { user: req.session.user });
});

// REGISTER
router.post("/register", (req, res) => {
    const { email, password } = req.body;

    const hashed = bcrypt.hashSync(password, 10);

    db.query("INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashed],
        (err) => {
            if (err) {
                console.log(err);
                return res.send("Hiba: ez az email már létezik!");
            }
            res.redirect("/login");
        });
});

// LOGIN
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
        if (err || rows.length === 0)
            return res.send("Hibás email vagy jelszó!");

        const user = rows[0];

        if (!bcrypt.compareSync(password, user.password))
            return res.send("Hibás email vagy jelszó!");

        req.session.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        res.redirect("/");
    });
});

// LOGOUT
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

module.exports = router;
