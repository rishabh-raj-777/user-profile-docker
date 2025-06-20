const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect("mongodb://mongo:27017/signup", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Mongoose model
const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: String,
  country: String,
  profilePic: String,
}));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));

// Ensure uploads directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Routes
app.post("/signup", async (req, res) => {
  const { name, email, country } = req.body;
  try {
    const user = await User.create({ name, email, country });
    res.redirect(`/profile/${user._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Signup failed.");
  }
});

app.post("/upload/:id", upload.single("profilePic"), async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      profilePic: req.file.path,
    });
    res.redirect(`/profile/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Upload failed.");
  }
});

app.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User not found");
    res.send(`
      <h2>Welcome, ${user.name}</h2>
      <p>Email: ${user.email}</p>
      <p>Country: ${user.country}</p>
      ${user.profilePic
        ? `<img src="/${user.profilePic}" width="150" height="150"/><br/>`
        : `<p>No profile picture uploaded yet.</p>`}
      <form action="/upload/${user._id}" method="POST" enctype="multipart/form-data">
        <input type="file" name="profilePic" required />
        <button type="submit">Upload Profile Picture</button>
      </form>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("Profile error.");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
//Testing commit