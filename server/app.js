const express = require("express");
const path = require("path");
const associations = require("./db/db");
const userRouter = require("./routes/userRouter");
const globalErrorHandler = require("./controllers/errorHandler");
const morgan = require("morgan");
const app = express();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json({ limit: "10kb" }));
app.use("/JusticeRoots/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
