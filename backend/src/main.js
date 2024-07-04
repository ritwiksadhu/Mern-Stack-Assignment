import express from "express";
import dotenv from "dotenv";
import databaseConnect from "./config/database_config.js";
import routes from "./api/v1/routes/api_routes.js";
import logger, { logInfo } from "./config/logger.js"; // Adjust the import based on your logger.js export
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

const app = express();
app.set("trust proxy", true);

app.use(helmet());

app.use(cors());

app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1", routes);

app.use(morgan("combined", { stream: logger.stream }));

databaseConnect();

const port = process.env.PORT || 8080;
app.listen(port, () => {
  logger.info(`Server is running on PORT: ${port}`);
});

export default app;
