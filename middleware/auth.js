function isLoggedIn(req, res, next) {
    if (req.session.user) return next();
    res.redirect("/app030/login");  // FIX
}

function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === "admin") return next();
    res.redirect("/app030/");       // FIX
}

module.exports = { isLoggedIn, isAdmin };
