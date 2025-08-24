import App from "./app";

process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error.message);
  console.error(error.stack);
  process.exit(1);
});

process.on("unhandledRejection", (reason: unknown) => {
  console.error("Unhandled Promise Rejection:", reason);
  process.exit(1);
});

const app = new App();
app.start();
