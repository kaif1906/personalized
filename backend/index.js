require("dotenv").config();
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const fileManager = new GoogleAIFileManager(process.env.API_KEY);

const app = express();
const port = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads"))); // serve images

// --- Multer setup ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// --- In-memory user data (replace with database later) ---
const users = [
  { email: "siddiquekaif38@gmail.com", password: "123456", name: "Kaif Sheikh" },
];

// --- Root route ---
app.get("/", (req, res) => {
  res.send("✅ Backend running successfully on port " + port);
});

// --- SIGNUP ROUTE ---
app.post("/user/add", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists." });
  }

  users.push({ name, email, password });
  console.log("✅ New user registered:", { name, email });

  res.status(201).json({ message: "Registration successful!" });
});

// --- LOGIN ROUTE ---
app.post("/user/authenticate", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required." });

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user)
    return res.status(401).json({ message: "Invalid email or password." });

  // Dummy token
  const token = "fake-jwt-token-" + new Date().getTime();

  res.status(200).json({
    message: "Login successful",
    token,
    user: { name: user.name, email: user.email },
  });
});

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
