const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./config/db');
const jwt = require("jsonwebtoken");
const User = require("./model/User");
const Note = require("./model/Note");
const bcrypt = require("bcrypt");
const authenticationToken = require("./utilities/authenticationToken");
require("dotenv").config();
const cors = require('cors');
const PORT = 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin:"*"
}))

app.get("/", (req, res) => {
    res.send("Hello, world!");
})


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
