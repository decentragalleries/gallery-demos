import express from "express";
import path, { dirname } from "path";
// import https from 'https'
// import fs from 'fs'

const app = express();

// const key = fs.readFileSync("keys/localhost-key.pem", "utf-8");
// const cert = fs.readFileSync("keys/localhost.pem", "utf-8");

app.use("/", express.static(dirname("./") + "/docs"));

app.get("/", function (req, res) {
  res.sendFile(path.join(dirname("./") + "/docs/index.html"));
});

// https.createServer({ key, cert }, app).listen(3000);
app.listen(3000);

console.log("Running at Port 3000");
