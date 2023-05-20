const express = require("express");
const router = express.Router();
const expressHandler = require("express-async-handler");
const upload = require("../../controllers/uploadImage");
const path = require("path");

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

// description: router function to _GET edit a post

router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post ",
      description: "Simple blog created with node js",
    };
    const data = await Post.findOne({ _id: req.params.id });

    res.render("admin/edit-post", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

// description: router function to _PUT edit a post

// router.put("/edit-post/:id", authMiddleware,  upload.single("imagePath"), async (req, res) => {
//   try {
//     await Post.findByIdAndUpdate(req.params.id, {
//       title: req.body.title,
//       content: req.body.content,
//       imageName: req.file.filename, // Use the file name provided by multer
//       imagePath: req.file.path, // Use the file path provided by multer
//       imageExtension: fileExtension, // Add the file extension to the Post object
//       updatedAt: Date.now(),
//     });

//     // console.log("New title: " + req.body.title);

//     res.redirect(`/edit-post/${req.params.id}`);
//   } catch (error) {
//     console.log(error);
//   }
// });

router.put(
  "/edit-post/:id",
  authMiddleware,
  upload.single("imagePath"),
  async (req, res) => {
    try {
      const existingPost = await Post.findById(req.params.id); // Retrieve the existing post

      let imageName = existingPost.imageName; // Retain the existing imageName
      let imagePath = existingPost.imagePath; // Retain the existing imagePath
      let imageExtension = existingPost.imageExtension; // Retain the existing imageExtension

      if (req.file) {
        // If a new file was uploaded, update the imageName, imagePath, and imageExtension
        imageName = req.file.filename;
        imagePath = req.file.path;
        imageExtension = path.extname(req.file.originalname);
      }

      await Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        content: req.body.content,
        imageName,
        imagePath,
        imageExtension,
        updatedAt: Date.now(),
      });

      res.redirect(`/edit-post/${req.params.id}`);
    } catch (error) {
      console.log(error);
    }
  }
);

// description: router function to _POST create a new post

// router.post(
//   "/add-post",
//   authMiddleware,
//   upload.single("image"),
//   async (req, res) => {
//     try {
//       // console.log(req.body);

//       try {
//         if (!req.file) {
//           return res.status(500).json({ error: "Please upload file" });
//         }

//         const imageFile = Post({
//           // imageName: req.file.imageName,
//           imagePath: req.file.imagePath,
//         });

//         await imageFile.save();

//         const newPost = new Post({
//           title: req.body.title,
//           content: req.body.content,
//           // imageName: req.file.imageName,
//           imagePath: req.file.imagePath,
//         });

//         await Post.create(newPost);
//         res.status(200).json(newPost);
//         // res.redirect("/dashboard");
//       } catch (error) {
//         console.log(error);
//       }

//     } catch (error) {
//       console.log(error);
//     }
//   }
// );

router.post("/add-post", upload.single("imagePath"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(500).json({ error: "Please upload a file" });
    }
    const fileExtension = path.extname(req.file.originalname); // Get the file extension
    // Use the req.file object to access information about the uploaded file
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      imageName: req.file.filename, // Use the file name provided by multer
      imagePath: req.file.path, // Use the file path provided by multer
      imageExtension: fileExtension, // Add the file extension to the Post object
    });

    // Save the new post to the database
    await newPost.save();

    // res.status(200).json(newPost);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the post" });
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

// description: router function to _DELETE remove a post

router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

// description: router function to _GET logout of the site

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  // res.json({ message: "Logout Successful" });
  res.redirect("/");
});

module.exports = router;
