import express from "express";
import cors from "cors";
import { errorMiddleware } from "@packages/error-handler/error-middleware";
import cookieParser from "cookie-parser";
import router from "./routes/auth.router";
import  SwaggerUi from "swagger-ui-express";
const swaggerDocument = require("./swagger-output.json");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send({ message: "Hello First API" });
});

app.use("/api-docs", SwaggerUi.serve, SwaggerUi.setup(swaggerDocument));
app.get("/docs-json", (req, res) => {
  res.json(swaggerDocument);
});

// Routes
app.use("/api", router);

app.use(errorMiddleware);

const port = process.env.PORT || 6001;
const server = app.listen(port, () => {
  console.log(`Auth Service is running at http://localhost:${port}/api`);
  console.log(`Swagger Docs is available at http://localhost:${port}/docs`);
});

server.on("error", (err) => {
  console.log("Server Error", err);
});
