const express = require("express");
const jwt = require("jsonwebtoken");
const bp = require("body-parser");
const { body, validationResult } = require("express-validator");
const db = require("./db");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const JWT_SECRET = "ECommerce_@DSANDHU";
let cors = require('cors')

const fetchUser = function fetchUser(req, res, next) {
  if (req.body.token) {
    try {
      let result = jwt.verify(req.body.token, JWT_SECRET);
      req.user = result.user;
    } catch (error) {
      res.status(401).json({ error: "Unauthorized Login" });
    }
  }
  next();
};
const app = express();
app.use(cors())

app.use(bp.json());
let cart = [];
mongoose.connect("mongodb://localhost:27017/ecommerce");
const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
});
const cartSchema = new mongoose.Schema({
  username: String,
  order: String,
});
const orderSchema = new mongoose.Schema({
  username: String,
  order: String,
  address: String,
  mobile: String,
});

const User = mongoose.model("user", userSchema);
const Cart = mongoose.model("cart", cartSchema);
const Order = mongoose.model("order", orderSchema);

app.get("/", fetchUser, (req, res) => {
  res.send("Hello User");
});

app.get("/contact", (req, res) => {
  res.send("Contact Page");
});
app.get("/shop", (req, res) => {
  res.json({ shop: db });
});

app.get(
  "/shop/:id",
  (req, res) => {
    
    let id = parseInt(req.params.id) - 1;
    if (db[id]) {
      res.json(db[id]);
    } else {
      res.status(400).json({ error: "Invalid Order" });
    }
  }
);
app.get('/cart',(req,res)=>{
  res.send("Cart GET")
})
app.post("/cart", fetchUser, async (req, res) => {
  if (req.user) {
    let cart = await Cart.find({ username: req.user[0].username.toLowerCase() });
    if (cart.length === 0) {
      res.json({empty:"Empty Cart"});
    } else {
      res.json(cart);
    }
  } else {
    res.redirect("/login");
  }
});
app.post("/cart/:id",fetchUser, async (req, res) => {
  if (req.user) {
    let LoggedUser = req.user;

    if (req.params.id) {
      let result = await Cart.create({
        username: req.user[0].username.toLowerCase(),
        order: req.params.id,
      });
      if (result) {
        res.json({ alert: "Item Added to Cart" });
      } else {
        res.json({ alert: "Could Not process your request to proceed" });
      }
    } else {
      res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
});
app.get("/payment", fetchUser, (req, res) => {
  if (req.user) {
    res.redirect("/shop");
  } else {
    res.redirect("/login");
  }
});
app.post("/payment/:id", fetchUser, (req, res) => {
  // Work to be done of Payment a iTem


});
app.get("/signup", fetchUser, (req, res) => {
  if (req.user) {
    res.redirect("/cart");
  } else {
    res.json({requirement:"Signup GET"});
  }
});
app.get("/login", fetchUser, (req, res) => {
  if (req.user) {
    res.redirect("/cart");
  } else {
    res.json({requirement:"Login GET"});
  }
});

app.post("/signup", async (req, res) => {
  let temp_user = await User.find({
    $or: [{ email: req.body.email.toLowerCase() }, { username: req.body.username.toLowerCase() }],
  });
  if (temp_user.length === 0) {
    let user = await User.create({
      email: req.body.email.toLowerCase(),
      username: req.body.username.toLowerCase(),
      password: await bcrypt.hash(req.body.password, await bcrypt.genSalt(10)),
    });
    res.status(200).send(user);
  } else {
    res.status(200).json({ error: "User Already exists with same details" });
  }
});

app.post("/login", async (req, res) => {
  // Login Is n't WOring Fix THis
  let temp_user = await User.find({ username: req.body.username.toLowerCase() }).select(
    "-password"
  );
  if (temp_user.length === 0) {
    res.status(400).json({ error: "Invalid Crediantials" });
  } else {
    let new_user = await User.findOne({ username: req.body.username.toLowerCase() });

    let user = await bcrypt.compare(req.body.password, new_user.password);
    if (user) {
      let payload = {
        user: temp_user,
      };
      let token = await jwt.sign(payload, JWT_SECRET);
      res.json({token:token});
    } else {
      res.status(400).json({ error: "Invalid Crediantials" });
    }
  }
});

app.listen(80, () => {
  console.log("http://localhost");
});