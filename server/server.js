require("dotenv").config();
const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const next = require("next");
const app = next({ dev });
const handle = app.getRequestHandler();
const { dbConnect } = require("./config/databaseConfig");
const path = require("path");
const server = express();

server.use(express.urlencoded({ limit: "30mb", extended: true }));
server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
server.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "'unsafe-eval'"],
      "img-src": ["'self'", "https: data:"],
    },
  })
);
server.use("/assets", express.static(path.join(__dirname, "public/assets")));
dbConnect();

server.get("/api/warmup", (req, res) => {
  console.log("Warmup received");
});
server.use("/api/auth", require("./routes/authRoutes"));
server.use("/api/users", require("./routes/userRoutes"));
server.use("/api/posts", require("./routes/postsRoutes"));

app.prepare().then(() => {
  server.all("*", (req, res) => {
    return handle(req, res);
  });
});

server.listen(PORT, () => {
  console.log(`Server at port ${PORT} is running`);
});
