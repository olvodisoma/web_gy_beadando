const express = require("express");
const path = require("path");
const session = require("express-session");

const authRoutes = require("./routes/auth");
const adatbazisRoutes = require("./routes/adatbazis");
const kapcsolatRoutes = require("./routes/kapcsolat");
const uzenetekRoutes = require("./routes/uzenetek");
const crudUsersRoutes = require("./routes/crud_users");
const adminRoutes = require("./routes/admin");

const app = express();

// ------------------------------
// BODY PARSER
// ------------------------------
app.use(express.urlencoded({ extended: true }));

// ------------------------------
// STATIC FILES PREFIX: /app030
// ------------------------------
app.use("/app030/assets", express.static(path.join(__dirname, "public", "assets")));
app.use("/app030/images", express.static(path.join(__dirname, "public", "images")));

// ------------------------------
// SESSION
// ------------------------------
app.use(
  session({
    secret: "mozi_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

// ------------------------------
// GLOBAL EJS VARIABLES
// ------------------------------
app.use((req, res, next) => {
  res.locals.currentPath = req.path;          // pl. "/login"
  res.locals.user = req.session.user || null; // logged-in user
  next();
});

// ------------------------------
// VIEW ENGINE
// ------------------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ------------------------------
// ROUTES — mindent /app030 alá teszünk
// ------------------------------
app.use("/app030", authRoutes);
app.use("/app030", adatbazisRoutes);
app.use("/app030", kapcsolatRoutes);
app.use("/app030", uzenetekRoutes);
app.use("/app030", crudUsersRoutes);
app.use("/app030", adminRoutes);

// ------------------------------
// MAIN PAGE
// ------------------------------
app.get("/app030", (req, res) => {
  res.render("index");
});

// ------------------------------
// SERVER START
// ------------------------------
app.listen(4030, () => {
  console.log("Szerver fut a 4030-as porton... (prefix: /app030)");
});
