import express from "express";
import session from 'express-session';
import user from "./routes/userRoute.js";
import admin from "./routes/adminRoute.js";
import connectToDB from "./db config/db.js";


const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 30
  }
}));

connectToDB();

app.use('/user', (req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use('/admin', (req, res, next) => {
  res.locals.admin = req.session.admin || null;
  next();
});

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

app.use('/user', user);
app.use('/admin', admin);

app.listen(PORT, () => {
  console.log("server is running on port 3000");
});

