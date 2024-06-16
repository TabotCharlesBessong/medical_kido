import express, { Request, Response, Express, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import DbInitialize from "./database/init";
import userRouter from "./router/user.router";
import doctorRouter from "./router/doctor.router";
import postRouter from "./router/post.router";

//create an app
const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((err: TypeError, req: Request, res: Response, next: NextFunction) => {
  try {
    if (err) {
      return res
        .status(500)
        .json({ status: false, message: (err as TypeError).message });
    }
  } catch (e) {}
});

app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/posts", postRouter);

app.get("/", (req: Request, res: Response) => {
  res.send(`Welcome to ${process.env.APPNAME}`);
});

const PORT = process.env.PORT || 5000;

const Boostrap = async function () {
  try {
    await DbInitialize();
    app.listen(PORT, () => {
      console.log("Connection has been established successfully.");
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

Boostrap();
