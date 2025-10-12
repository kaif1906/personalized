require("dotenv").config();
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

// Import Routers
const userRouter = require('./routers/UserRouter'); // Assuming UserRouter is in a 'routers' directory
const newsletterRouter = require('./routers/NewsletterRouter');
// You will also need to import connection.js or ensure it runs (e.g., const connection = require('./connection');)

const fileManager = new GoogleAIFileManager(process.env.API_KEY);

const app = express();
const port = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads"))); // serve images

// --- Multer setup ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// REMOVED: In-memory user data (const users = [...])

// --- Root route ---
app.get("/", (req, res) => {
  res.send("✅ Backend running successfully on port " + port);
});

// --- Router Mounts ---
// This line delegates all /user/* requests to UserRouter.js
app.use('/user', userRouter);

// Newsletter router mount
app.use('/newsletter', newsletterRouter); 

// REMOVED: Duplicated /user/add (SIGNUP) route
// REMOVED: Duplicated /user/authenticate (LOGIN) route

// --- FILE UPLOAD ROUTE ---
app.post("/uploadfile", upload.array("myfiles", 10), async (req, res) => {
  console.log("Processing upload request...");

  if (!req.files || req.files.length === 0)
    return res.status(400).json({ message: "No files uploaded." });

  try {
    const uploadPromises = req.files.map(async (file) => {
      const filePath = path.join(__dirname, "uploads", file.originalname);
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://mern-workshop.onrender.com"
          : `http://localhost:${port}`;

      const publicUrl = `${baseUrl}/${file.originalname}`;

      console.log(`Uploading: ${file.originalname}`);

      const uploaded = await fileManager.uploadFile(filePath, {
        mimeType: file.mimetype,
        displayName: file.originalname,
      });

      return {
        geminiFile: uploaded.file,
        publicUrl,
      };
    });

    const results = await Promise.all(uploadPromises);
    res.status(200).json(results);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      message: "File upload failed",
      error: err.message,
    });
  }
});

// --- Start server ---
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});