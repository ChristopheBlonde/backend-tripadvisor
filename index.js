const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
require("dotenv").config();
const mailgun = require("mailgun-js");
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

const app = express();
app.use(formidable());
app.use(cors());

app.post("/contact", async (req, res) => {
  try {
    const { firstname, lastname, email, subject, message } = req.fields;

    const data = {
      from: `${firstname} ${lastname} <${email} >`,
      to: "chblonde@wanadoo.fr",
      subject: `${subject}`,
      text: `${message}`,
    };
    mg.messages().send(data, (error, body) => {
      console.log(body);
      if (!error) {
        res.status(200).json({ message: "Votre message a bien était envoyé" });
      } else {
        res.status(400).json(error);
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server Started");
});
