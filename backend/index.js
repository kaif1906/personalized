require("dotenv").config();
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const express = require("express");
const multer = require("multer");
const cors = require('cors');

// Note: The GoogleGenerativeAI client is not needed here as the primary task is file management,
// but it can be easily added back for content generation using the uploaded file IDs.

// Initialize the File Manager using the API key from environment variables
// It's assumed the API key is available in process.env.API_KEY
const fileManager = new GoogleAIFileManager(process.env.API_KEY);

// --- Multer Configuration ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure this directory exists or the server will crash
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        // Use originalname, but should ensure unique filenames in a production app
        cb(null, file.originalname);
    },
});

// Configure multer to use the disk storage
const myStorage = multer({ storage: storage });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// Serve static files from the uploads directory
app.use(express.static('./uploads'));

app.get('/', (req, res) => {
    res.send('Server is running and ready for file uploads.');
});

// --- New Multi-File Upload Endpoint ---
// Using .array('myfiles', 10) to accept multiple files (up to 10) under the field name 'myfiles'.
app.post("/uploadfile", myStorage.array("myfiles", 10), async (req, res) => {
    console.log("Processing upload request...");
    console.log(req.files);

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded. Ensure you are using the field name 'myfiles'." });
    }

    // 1. Map all local file uploads to an array of promises for Google AI File Manager upload
    const uploadPromises = req.files.map((file) => {
        const filePath = `./uploads/${file.originalname}`;
        // The public URL must be dynamically constructed based on where the server is hosted.
        // Assuming 'https://mern-workshop.onrender.com/' for the base URL as per original code.
        const publicUrl = 'https://mern-workshop.onrender.com/' + file.originalname;

        console.log(`Attempting to upload: ${file.originalname}`);

        return fileManager.uploadFile(
            filePath,
            {
                mimeType: file.mimetype,
                displayName: file.originalname,
            },
        ).then((uploadResult) => {
            // Log successful upload to the server console
            console.log(`Successfully uploaded to Google AI: ${uploadResult.file.displayName}`);

            // Return a result object combining the Gemini response and the public server URL
            return {
                geminiFile: uploadResult.file,
                publicUrl: publicUrl,
                localPath: filePath
            };
        });
    });

    try {
        // 2. Wait for all promises to resolve (all files uploaded to Gemini)
        const results = await Promise.all(uploadPromises);
        console.log(results);
        // 3. Respond with an array of all file results
        console.log(`Successfully processed ${results.length} files.`);
        return res.status(200).json(results);

    } catch (err) {
        // 4. Handle any errors during the file manager uploads
        console.error("An error occurred during Google AI file upload:", err);
        // You might want to consider deleting files already uploaded to Gemini if an error occurs
        return res.status(500).json({ message: "Error uploading one or more files to the Google AI File Manager.", error: err.message });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
