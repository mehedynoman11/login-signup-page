// const express = require("express");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const session = require('express-session');
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const passportLocalMongoose = require("passport-local-mongoose");
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const findOrCreate = require('mongoose-findorcreate');
// require('dotenv').config();
//
// const app = express();
// app.set("view engine", "ejs");
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));
//
// // Session configuration
// app.use(session({
//   secret: "Our little secret",
//   resave: false,
//   saveUninitialized: false
// }));
//
// // Passport initialization
// app.use(passport.initialize());
// app.use(passport.session());
//
// // MongoDB connection
// mongoose.connect("mongodb://localhost:27017/loginDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
//
// // User schema and model
// const userSchema = new mongoose.Schema({
//   email: String,
//   password: String,
//   googleId: String,
//   username: { type: String, unique: true } // Add unique: true
// });
//
// userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);
// const User = mongoose.model("User", userSchema);
//
// // Passport configuration
// passport.use(new LocalStrategy(User.authenticate()));
//
// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });
//
// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });
//
//
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: "http://localhost:1111/auth/google/logindb",
//   userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
// }, function(accessToken, refreshToken, profile, cb) {
//   User.findOrCreate({ username: profile.emails[0].value, googleId: profile.id })
//     .then(function(user) {
//       return cb(null, user);
//     })
//     .catch(function(err) {
//       return cb(err);
//     });
// }));
//
//
//
// // Routes
// app.get('/auth/google', passport.authenticate('google', { scope: ['profile',"email"] }));
//
// app.get('/auth/google/logindb', passport.authenticate('google', {
//   failureRedirect: '/login'
// }), function(req, res) {
//   res.redirect('/secrets'); // Redirect to the 'secrets' page on successful sign-in
// });
//
// app.get("/", function(req, res) {
//   res.render("home");
// });
//
// app.get("/logout", function (req, res) {
//   req.logout(function(err) {
//     if (err) {
//       console.error(err);
//     }
//     res.clearCookie("connect.sid");
//     res.redirect("/");
//   });
// });
//
// app.get("/register", function(req, res) {
//   res.render("register");
// });
//
// app.post("/register", function (req, res) {
//   const { username, password } = req.body;
//
//   User.register(new User({ username: username }), password, function (err, user) {
//     if (err) {
//       console.log(err);
//       res.redirect("/register");
//     } else {
//       passport.authenticate("local")(req, res, function () {
//         res.redirect("/secrets");
//       });
//     }
//   });
// });
//
// app.get("/secrets", function(req, res) {
//   if (req.isAuthenticated()) {
//     res.render("secrets");
//   } else {
//     res.redirect("/login");
//   }
// });
//
// app.get("/login", function(req, res) {
//   res.render("login");
// });
//
// app.post("/login", passport.authenticate("local", {
//   successRedirect: "/secrets",
//   failureRedirect: "/login",
// }));
//
// const server = app.listen(1111, function() {
//   const today = new Date();
//   const currentTime = today.toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });
//
//   console.log(`Server is running at port 1111. Current time is ${currentTime}.`);
// });


const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
require('dotenv').config();

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Session configuration
app.use(session({
  secret: "Our little secret",
  resave: false,
  saveUninitialized: false
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect("mongodb+srv://mehedynoman11:Nomann11123@cluster0.harqqmn.mongodb.net/loginDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema and model
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  username: { type: String, unique: true } // Add unique: true
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = mongoose.model("User", userSchema);

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:1111/auth/google/logindb",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
}, function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ username: profile.emails[0].value, googleId: profile.id }, function(err, user) {
    if (err) {
      return cb(err);
    }
    return cb(null, user);
  });
}));

// Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/logindb', passport.authenticate('google', {
  failureRedirect: '/login'
}), function(req, res) {
  res.redirect('/secrets'); // Redirect to the 'secrets' page on successful sign-in
});

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/logout", function (req, res) {
  req.logout(function(err) {
    if (err) {
      console.error(err);
    }
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  const { username, password } = req.body;

  User.register(new User({ username: username }), password, function (err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
      });
    }
  });
});

app.get("/secrets", function(req, res) {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/secrets",
  failureRedirect: "/login",
}));

const server = app.listen(1111, function() {
  const today = new Date();
  const currentTime = today.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  console.log(`Server is running at port 1111. Current time is ${currentTime}.`);
});
