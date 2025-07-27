const express = require("express");
const cors = require("cors");
const appRoutes = require("./src/routes/appRoutes");
const dotenv = require("dotenv");
dotenv.config({ path: "./src/setup/config.env" });

const app = express();
const port = process.env.PORT || 4000;

const frontendUrl = process.env.FRONTEND_URL;
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:4000'
];

if (frontendUrl) {
    allowedOrigins.push(frontendUrl);
}

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`Not allowed by CORS for origin: ${origin}`));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 204
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", appRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`);
});