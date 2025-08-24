import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: Object.values((err as any).errors).map((e: any) => e.message),
    });
    return;
  }

  if (err.name === "CastError") {
    res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
    return;
  }

  if ((err as any).code === 11000) {
    res.status(409).json({
      success: false,
      message: "Duplicate entry",
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: err.message,
  });
};

export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms - ${req.ip}`
    );
  });

  next();
};
