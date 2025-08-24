import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import { connectDatabase } from "./config/database";
import { errorHandler, notFound, requestLogger } from "./middleware";
import postRoutes from "./routes/post.route";
dotenv.config();

class App {
  public app: Application;
  private port: string | number;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(
      helmet({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
          },
        },
      })
    );

    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      })
    );

    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    if (process.env.NODE_ENV !== "test") {
      this.app.use(requestLogger);
    }
   
  }

  private initializeRoutes(): void {

    this.app.use("/api/posts", postRoutes);

  }

  private initializeErrorHandling(): void {
    this.app.use(notFound);

    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      await connectDatabase();

      this.app.listen(this.port, () => {
        console.log(`Server is running on port ${this.port}`);
        console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  }

  public getApp(): Application {
    return this.app;
  }
}

export default App;
