const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middleware/auth");

// /admin csak adminnak érhető el
router.get("/admin", isAdmin, (req, res) => {
    res.render("admin", {
        user: req.session.user
    });
});

module.exports = router;
