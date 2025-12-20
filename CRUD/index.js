import e from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import User from "./models/user.js";
import "dotenv/config";

const app = e();
const port = 8080;

app.use(bodyParser.json());

app.listen(port, () => {
  console.log("Listening at 8080");
});

app.get("/", (req, res) => {
  res.send("Welcome to Basic CRUD Application");
});

mongoose
  .connect(process.env.MONGO_DB_URI || "")
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

app.get("/users", (req, res) => {
  const users = getAllUsers();
  users.then((value) => {
    console.log(value);
    res.json(value);
  });
});

app.post("/adduser", (req, res) => {
  console.log("adding user");
  addUser(req, res);
});

app.get("/removeall", (req, res) => {
  removeAllUsers();
  res.json("Removed all users");
});

app.post("/update", (req, res) => {
  updateUser(req, res);
});

app.get("/removeuser", (req, res) => {
  removeUser(req, res);
});

async function getAllUsers() {
  const totalUsers = await User.find();
  return totalUsers;
}

async function removeAllUsers() {
  const user = await User.deleteMany();
}

async function removeUser(req, res) {
  const { username } = req.headers;
  const userDoc = await User.findOneAndDelete({ userName: username });
  if (userDoc) {
    res.json(`Deleted the user ${username}`);
    return;
  } else {
    res.status(400).json({
      message: `User ${username} not found`,
    });
    return;
  }
}

async function updateUser(req, res) {
  const { userName, fullName, email } = req.body;

  if (userName) {
    const userDoc = await User.findOne({ userName: userName.toLowerCase() });
    if (userDoc) {
      if (fullName) {
        userDoc.fullName = fullName;
      }
      if (email) {
        userDoc.email = email;
      }
      await userDoc.save();
      res.json(`Updated Data: ${userDoc.toJSON()}`);
      return;
    } else {
      res.status(400).json({
        message: `User ${userName} not found`,
      });
      return;
    }
  }
}

async function addUser(req, res) {
  const { userName, fullName, email } = req.body;

  if (userName) {
    const userExists = await User.findOne({ userName: userName.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        message: `User with username - ${userName} Already Exists`,
      });
    } else {
      await User.create({
        userName: userName.toLowerCase(),
        fullName: fullName.toLowerCase(),
        email: email,
      });
      return res.json(`User with username - ${userName} created`);
    }
  }
}
