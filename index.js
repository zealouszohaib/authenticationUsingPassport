const express = require("express");
const router = require("./lib/router");
const morgan = require("morgan");
const passport = require("passport");
const LocalStretegy = require("passport-local");
const cookieSession = require("cookie-session");
const DB = require("./lib/db");
const bcrypt = require("bcrypt");

const app = express();

const port = 3000;

let _ = {};

_.start = () => {
  try {
    app.listen(port);
    console.log(`Express Server running on the port ${port}`);
  } catch (error) {
    throw new Error(error);
  }
};



app.use(
  cookieSession({
    name: "app-auth",
    keys: ["secret-key", "secret-old"],
    maxAge: 60 * 60 * 24,
  })
);

app.use(express.json());
app.use(morgan("dev"));

app.use(passport.initialize());

app.use(passport.session());

passport.serializeUser((user, done) => {
  console.log(`4- Serialize user: ${JSON.stringify(user)}`);
  return done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log(`Deserializing User: ${id}`);

  const user = DB.findOne(id);

  if (user) return done(null, { id: user.id, email: user.email });
  else return done(new Error("No User with id is found"));
});

passport.use(
  "local",
  new LocalStretegy(
    { passReqToCallback: true },
    
    async (req, username, password, done) => {
      console.log(`2- locale stretegy ${JSON.stringify(username)}`);

      let user = DB.findByEmail(username);

      if (!user) return done(null, false);

      const result = await new Promise((resolve, reject) => {

        bcrypt.compare(password, user.security.passwordHash, (err, res) => {
          if (err) reject(err);
          resolve(res);

        });

      });

      if (result) done(null, user);
      else done("passs]word or username is incorrect", null);

    }
  )
);

app.use("/api/v1", router);

_.start();
