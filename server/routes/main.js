const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// description: router function to _GET home

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
      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
  }
});

// description: router function to _GET individual post

router.get("/post/:id", async (req, res) => {
  try {
    let slug = req.params.id;
    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs",
    };

    res.render("post", { locals, data, currentRoute: `/post/${slug}` });
  } catch (error) {
    console.log(error);
  }
});

// description: router function to _GET to about page

router.get("/about", (req, res) => {
  res.render("about", {
    currentRoute: "/about",
  });
});

// description: router function to _GET to contact page

router.get("/contact", (req, res) => {
  res.render("contact", {
    currentRoute: "/contact",
  });
});

// description: router function to _POST a search term

router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Simple blog created with node js",
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { content: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });
    res.render("search", {
      data,
      locals,
      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

// hack: function insertPostData() {
//   Post.insertMany([
//     {
//       title: "Building a Blog",
//       content: "This is the body text",
//     },
//     {
//       title: "Testing a Blog",
//       content: "This is the body text",
//     },
//     {
//       title: "Reading a Blog",
//       content: "This is the body text",
//     },
//     {
//       title: "Building a Site",
//       content: "This is the body text",
//     },
//     {
//       title: "Testing a Site",
//       content: "This is the body text",
//     },
//     {
//       title: "Developing a Site",
//       content: "This is the body text",
//     },
//   ]);
// }

// insertPostData();
