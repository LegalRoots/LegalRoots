const express = require("express");
const path = require("path");

const globalErrorHandler = require("./controllers/errorHandler");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const AppError = require("./utils/appError");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const postsRouter = require("./routes/postsRouter");
const lawyersRouter = require("./routes/lawyersRouter");
const casesRouter = require("./routes/casesRouter");
const notificationsRouter = require("./routes/notificationsRouter");
const userRouter = require("./routes/userRouter");

const adminRouter = require("./routes/administrative/administrativeRouter");
const casesRouterAydi = require("./routes/administrative/casesRouter");
const courtsRouter = require("./routes/administrative/courtsRouter");
const witnessRouter = require("./routes/administrative/witnessRouter");
const evidenceRouter = require("./routes/administrative/evidenceRouter");
const chartsRouter = require("./routes/administrative/chartsRouter");
const jobsRouter = require("./routes/administrative/jobsRouter");
const assignedCasesRouter = require("./routes/administrative/assignedCasesRouter");
const conversationsRouter = require("./routes/conversationsRouter");

const courtBranchRouter = require("./routes/administrative/courtBranchRouter");

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
app.use("/JusticeRoots/conversations", conversationsRouter);

app.use("/JusticeRoots/lawyers", lawyersRouter);
app.use("/JusticeRoots/notifications", notificationsRouter);
app.use("/JusticeRoots/posts", postsRouter);
app.use("/JusticeRoots/cases", casesRouter);
app.use("/admin", adminRouter);
app.use("/admin", casesRouterAydi);
app.use("/admin", courtsRouter);
app.use("/admin", witnessRouter);
app.use("/admin", evidenceRouter);
app.use("/admin", courtBranchRouter);
app.use("/admin", jobsRouter);
app.use("/admin", assignedCasesRouter);

app.use("/chart", chartsRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
