import express from "express";
import env from "./env";

const app = express();

app.get("/", (req, res) => {
  console.log("🌞 Someone is testing");
  res.send("🌞 KarpoReviewServer is alive!");
});

app.listen(80, () => {
  console.log("😎 KarpoReviewServer is running on port 80");
});
