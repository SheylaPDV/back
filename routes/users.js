var express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");

var router = express.Router();

router.post("/", async (req, res, next) => {
  // Encripta contraseña
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    username: req.body.username,
    password: password,
  });
  try {
    const savedUser = await user.save();
    res.json({
      data: savedUser,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const users = await User.findOne({ _id: id });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const users = await User.list();
    res.json({ result: users });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", (req, res, next) => {
  const { id } = Number(req.params);
  User.findOneAndDelete(id)
    .then(() => res.status(204).end())
    .catch((error) => next(error));
});

router.put("/", async (req, res) => {
  let body = req.body;
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);
  console.log("bodyy", body);
  User.updateOne(
    { _id: body._id },
    {
      $set: req.body,
      password,
    },
    function (err, info) {
      if (err) {
        res.json({
          result: false,
          msg: "Could not modify client",
          err,
        });
      } else {
        res.json({
          result: true,
          info: info,
        });
      }
    }
  );
});

module.exports = router;
