const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userController = require("./controllers/UserController");
const foodTypeController = require("./controllers/FoodTypeController");

app.use(cors());

app.delete("/api/foodType/remove/:id", (req, res) => foodTypeController.remove(req, res));
app.put("/api/foodType/update", (req, res) => foodTypeController.update(req, res));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/api/user/signIn", (req, res) => userController.signin(req, res));
app.post("/api/foodType/create", (req, res) => foodTypeController.create(req, res));
app.post("/api/user/create", async (req, res) => {
  try {
    const { name, username, password, level, status } = req.body;
    const user = await prisma.user.create({
      data: {
        name,
        username,
        password,
        level,
        status,
      },
    });
    res.send({ message: "User created successfully"});
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});



app.get("/api/foodType/list", async (req, res) => foodTypeController.list(req, res));
app.get("/api/user/list", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        level: true,
        username: true,
        status: true,
      },
    });
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});






app.listen(3000, () => {
  console.log("API server URL: http://localhost:3000");
});

