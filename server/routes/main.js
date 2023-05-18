const express = require("express");
const router = express.Router();

router.get("", (req, res) => {
  const locals = {
    title: "NodeJS Blog",
    description: "Simple blog created with node js",
  };

  res.render("index", { locals });
});

router.get("/about", (req, res) => {
  res.render("about");
});

module.exports = router;
