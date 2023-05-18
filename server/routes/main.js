const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// description: router function to get home

router.get("", async (req, res) => {
  try {
    const locals = {
      title: "NodeJS Blog",
      description: "Simple blog created with node js",
    };

    let maxArticles = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(maxArticles * page - maxArticles)
      .limit(maxArticles)
      .exec();

    const count = await Post.count();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / maxArticles);

    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (error) {
    console.log(error);
  }
});

// description: router function to get to about page

router.get("/about", (req, res) => {
  res.render("about");
});

module.exports = router;

// hack: function insertPostData() {
//   Post.insertMany([
//     {
//       title: "Building a Blog",
//       body: "This is the body text",
//     },
//     {
//       title: "Testing a Blog",
//       body: "This is the body text",
//     },
//     {
//       title: "Reading a Blog",
//       body: "This is the body text",
//     },
//     {
//       title: "Building a Site",
//       body: "This is the body text",
//     },
//     {
//       title: "Testing a Site",
//       body: "This is the body text",
//     },
//     {
//       title: "Developing a Site",
//       body: "This is the body text",
//     },
//   ]);
// }

// insertPostData();
