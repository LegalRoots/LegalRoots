const express = require("express");
const path = require("path");
const userRouter = require("./routes/userRouter");
const globalErrorHandler = require("./controllers/errorHandler");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const AppError = require("./utils/appError");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const postsRouter = require("./routes/postsRouter");
const notificationsRouter = require("./routes/notificationsRouter");
app.use(cors());
app.use(bodyParser.json());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/JusticeRoots/users", userRouter);
app.use("/JusticeRoots/notifications", notificationsRouter);
app.use("/JusticeRoots/posts", postsRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
