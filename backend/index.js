const express = require("express");
const cors = require("cors");
const appRoutes = require("./src/routes/appRoutes");
const dotenv = require("dotenv");
dotenv.config({ path: "./src/setup/config.env" });

const app = express();
const port = process.env.PORT || 4000;

// --- CORS Configuration ---
// It's best practice to be specific about your CORS policy
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204
};

// --- Middleware Setup ---
// 1. Enable CORS with specific options 
// 1. Handle preflight requests across all routes
app.options('*', cors(corsOptions));

// 2. Enable CORS for all other requests
app.use(cors(corsOptions));

// 3. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Your API routes
app.use("/api/v1", appRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});