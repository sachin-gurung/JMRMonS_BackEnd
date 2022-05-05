import "dotenv/config.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import createError from "http-errors";
import session from "express-session";
import logger from "morgan";
import methodOverride from "method-override";
import passport from "passport";
import cors from "cors";
import { auth } from "express-openid-connect";
// connect to MongoDB with mongoose
import("./config/database.js");

// load passport
import("./config/passport.js");

//auth0
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SESSION_SECRET,
  baseURL: "https://mosserryan.github.io/JMRmonS_FrontEnd/",
  clientID: "47Jm3kkR6DMitI7YGSh8eAPk9dlbpfQV",
  issuerBaseURL: "https://dev-adr32rpm.us.auth0.com",
};
// require routes
import { router as indexRouter } from "./routes/index.js";
import { router as authRouter } from "./routes/auth.js";
import { router as monsterRouter } from "./routes/monster.js";
import { passUserToView } from "./middleware/middleware.js";

// create the express app
const app = express();
app.use(cors());

// view engine setup
app.set(
  "views",
  path.join(path.dirname(fileURLToPath(import.meta.url)), "views")
);
app.set("view engine", "ejs");

// middleware

app.use(methodOverride("_method"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  express.static(
    path.join(path.dirname(fileURLToPath(import.meta.url)), "public")
  )
);
//auth0 router intiialization
app.use(auth(config));
// session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "lax",
    },
  })
);
app.use(passUserToView);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

//custom middleware

// router middleware
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/monster", monsterRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", {
    title: `🎊 ${err.status || 500} Error`,
  });
});

export { app };
