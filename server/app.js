const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

app.use("/", express.static(path.join(__dirname, "..", "client")));

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.post("/mailing", (req, res) => {
  console.log(req.body);

  let transporter = nodemailer.createTransport({
    service: "outlook",
    auth: {
      //user: process.env.transporterEmail,
      //pass: process.env.transporterPassword,
      user: "mamou.rania@outlook.fr",
      pass: "raniaainar2"
    },
  });

  const mailOptions = {
    //from: process.env.transporterEmail,
    from: "mamou.rania@outlook.fr",
    to: "mamou.rania@proton.me",
    subject: `${req.body.name}   ${req.body.email}`,
    text: req.body.message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send(JSON.stringify({ error: error }));
    } else {
      res.status(200).send(JSON.stringify({ answer: info }));
    }
  });
});

module.exports = app;
