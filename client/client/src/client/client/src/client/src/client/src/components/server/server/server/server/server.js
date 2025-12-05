const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const upload = require("./upload");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// DB Connect
mongoose.connect(process.env.MONGO_URI);
const conn = mongoose.connection;

let gfs;
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads"
  });
  console.log("MongoDB connected");
});

// Upload API
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ msg: "File uploaded", file: req.file });
});

// List all files
app.get("/files", (req, res) => {
  gfs.find().toArray((err, files) => {
    if (!files.length) return res.json([]);
    res.json(files);
  });
});

// Download route
app.get("/files/:filename", (req, res) => {
  gfs.openDownloadStreamByName(req.params.filename).pipe(res);
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server running on port", port));
