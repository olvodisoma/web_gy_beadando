const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const { isAdmin } = require("../middleware/auth"); // ha máshol van, az utat módosítsd

// LISTA – összes felhasználó
router.get("/crud/users", isAdmin, (req, res) => {
    const sql = "SELECT id, email, role FROM users ORDER BY id ASC";

    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return res.send("Hiba a felhasználók lekérdezésekor.");
        }

        res.render("crud/users_list", {
            users: rows
        });
    });
});

// ÚJ FELHASZNÁLÓ FORM
router.get("/crud/users/new", isAdmin, (req, res) => {
    res.render("crud/users_new", {
        error: null
    });
});

// ÚJ FELHASZNÁLÓ MENTÉSE
router.post("/crud/users/new", isAdmin, (req, res) => {
    const { email, password, confirm, role } = req.body;

    if (!email || !password || !confirm || !role) {
        return res.render("crud/users_new", {
            error: "Minden mező kitöltése kötelező!"
        });
    }

    if (password !== confirm) {
        return res.render("crud/users_new", {
            error: "A két jelszó nem egyezik!"
        });
    }

    const hashed = bcrypt.hashSync(password, 10);

    // Ellenőrizzük, hogy létezik-e már az email
    db.query("SELECT id FROM users WHERE email = ?", [email], (err, rows) => {
        if (err) {
            console.log(err);
            return res.render("crud/users_new", {
                error: "Ismeretlen hiba történt."
            });
        }

        if (rows.length > 0) {
            return res.render("crud/users_new", {
                error: "Ezzel az e-mail címmel már létezik felhasználó!"
            });
        }

        db.query(
            "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
            [email, hashed, role],
            (err2) => {
                if (err2) {
                    console.log(err2);
                    return res.render("crud/users_new", {
                        error: "Hiba történt a mentés közben."
                    });
                }

                res.redirect("/crud/users");
            }
        );
    });
});

// SZERKESZTŐ FORM
router.get("/crud/users/edit/:id", isAdmin, (req, res) => {
    const id = req.params.id;

    db.query("SELECT id, email, role FROM users WHERE id = ?", [id], (err, rows) => {
        if (err || rows.length === 0) {
            console.log(err);
            return res.send("A felhasználó nem található.");
        }

        res.render("crud/users_edit", {
            userData: rows[0],
            error: null
        });
    });
});

// FELHASZNÁLÓ FRISSÍTÉSE
router.post("/crud/users/edit/:id", isAdmin, (req, res) => {
    const id = req.params.id;
    const { email, role, password } = req.body;

    if (!email || !role) {
        return res.render("crud/users_edit", {
            userData: { id, email, role },
            error: "Az e-mail és szerepkör mező kötelező!"
        });
    }

    // Ha van új jelszó -> frissítjük azt is, ha nincs -> csak email+role
    const updateUser = (withPassword) => {
        if (withPassword) {
            const hashed = bcrypt.hashSync(password, 10);
            db.query(
                "UPDATE users SET email = ?, role = ?, password = ? WHERE id = ?",
                [email, role, hashed, id],
                (err) => {
                    if (err) {
                        console.log(err);
                        return res.render("crud/users_edit", {
                            userData: { id, email, role },
                            error: "Hiba történt a frissítés során."
                        });
                    }
                    res.redirect("/crud/users");
                }
            );
        } else {
            db.query(
                "UPDATE users SET email = ?, role = ? WHERE id = ?",
                [email, role, id],
                (err) => {
                    if (err) {
                        console.log(err);
                        return res.render("crud/users_edit", {
                            userData: { id, email, role },
                            error: "Hiba történt a frissítés során."
                        });
                    }
                    res.redirect("/crud/users");
                }
            );
        }
    };

    if (password && password.trim() !== "") {
        updateUser(true);
    } else {
        updateUser(false);
    }
});

// TÖRLÉS
router.get("/crud/users/delete/:id", isAdmin, (req, res) => {
    const id = req.params.id;

    db.query("DELETE FROM users WHERE id = ?", [id], (err) => {
        if (err) {
            console.log(err);
            return res.send("Hiba történt a törlés során.");
        }
        res.redirect("/crud/users");
    });
});

module.exports = router;
