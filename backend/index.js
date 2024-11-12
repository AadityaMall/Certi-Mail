const express = require("express");
const cors = require("cors");
const appRoutes = require("./src/routes/appRoutes");
const dotenv = require("dotenv");
dotenv.config({ path: "./src/setup/config.env" });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 4000;

app.use(cors());

app.use("/api/v1", appRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
