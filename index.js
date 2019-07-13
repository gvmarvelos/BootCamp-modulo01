const express = require("express");

const server = express();

server.use(express.json());

const users = ["Jose", "Simone", "Luan", "Lucas"];

server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}; `);

  next();

  console.timeEnd("Request");
});

function checkUserNameExist(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required!" });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: "User dos not exists!" });
  }

  req.user = user;

  return next();
}

server.get("/users", checkUserInArray, (req, res) => {
  return res.json(req.user);
});

server.get("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  return res.json(users[index]);
});

server.post("/users", checkUserNameExist, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put(
  "/users/:index",
  checkUserInArray,
  checkUserNameExist,
  (req, res) => {
    const { index } = req.params;
    const { name } = req.body;

    users[index] = name;

    return res.json(users);
  }
);

server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.json(users);
});
server.listen(3000);
