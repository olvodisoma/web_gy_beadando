const express = require("express");
const path = require("path");
const session = require("express-session");

const authRoutes = require("./routes/auth");
const adatbazisRoutes = require("./routes/adatbazis");
const kapcsolatRoutes = require("./routes/kapcsolat");
const uzenetekRoutes = require("./routes/uzenetek");

const app = express();

// Body parser
app.use(express.urlencoded({ extended: true }));

// Statikus fájlok
app.use(express.static(path.join(__dirname, "public")));

// Session
app.use(
  session({
    secret: "mozi_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

// Globális változók a view-knek: aktuális path + user
app.use((req, res, next) => {
  res.locals.currentPath = req.path;          // pl. "/adatbazis"
  res.locals.user = req.session.user || null; // bejelentkezett user (vagy null)
  next();
});

// View engine beállítás
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ROUTES
app.use("/", authRoutes);
app.use("/", adatbazisRoutes);
app.use("/", kapcsolatRoutes);
app.use("/", uzenetekRoutes);
// Főoldal
app.get("/", (req, res) => {
  res.render("index"); // user és currentPath már benne van a res.locals-ban
});

// Szerver indítása
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
