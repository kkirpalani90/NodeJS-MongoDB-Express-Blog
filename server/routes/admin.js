const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLayout = "../views/layouts/admin";

const jwtSecret = process.env.JWT_SECRET;

// description: Middleware function to Check login

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized login attempt" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized login attempt" });
  }
};

// description: router function to _GET Admin login Page

router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin Dashboard",
      description: "Simple blog created with node js",
    };

    res.render("admin/index", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

// description: router function to _POST Check Admin login Information

router.post("/admin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

// description: router function to _GET Redirect to Admin Dashboard

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Admin Dashboard",
      description: "Simple blog created with node js",
    };

    const data = await Post.find();
    res.render("admin/dashboard", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

// description: router function to _GET create a new post

router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Create New Post",
      description: "Simple blog created with node js",
    };

    const data = await Post.find();
    res.render("admin/add-post", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

// description: router function to _POST create a new post

router.post("/add-post", authMiddleware, async (req, res) => {
  try {
    console.log(req.body);

    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
      });
    } catch (error) {}

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

// description: router function to _POST Submit Admin Registration Information

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ email, password: hashedPassword });
      res.status(201).json({ message: "User Created", user });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: "User already exists" });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
