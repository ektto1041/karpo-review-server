import express from "express";
import { processPullRequest } from "./github-process";
import env from "./env";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  req.host;
  console.log("# Someone is testing");
  res.send("🌞 KarpoReviewServer is alive!");
});

app.post("/webhook", (req, res) => {
  const event = req.headers["x-github-event"];
  if (event !== "pull_request") {
    res.status(200).send("Not a PR event.");
    return;
  }

  const { action, pull_request } = req.body;
  const prNumber: string = pull_request.number;
  const headBranch: string = pull_request.head.ref;
  const baseBranch: string = pull_request.base.ref;
  const repoName: string = pull_request.head.repo.name;

  console.log(`# REPO: ${repoName}`);

  if (![env.REPO_NAME_FE, env.REPO_NAME_BE].includes(repoName)) {
    res.status(200).send("Webhook received, Not allowed repositories.");
    return;
  }

  console.log(`# PR #${prNumber} - Action: ${action}`);
  console.log(`# PR #${prNumber} - From: ${headBranch} / To: ${baseBranch}`);

  // PR이 생성, 업데이트, 다시 열린 경우에만 처리
  if (!["opened", "synchronize", "reopened"].includes(action)) {
    res.status(200).send("Webhook received, Not allowed action.");
    return;
  }

  if (
    !(
      baseBranch.includes("dev") &&
      (headBranch.includes("feature") || headBranch.includes("hotfix"))
    )
  ) {
    res.status(200).send("Webhook received, Invalid branch");
    return;
  }

  processPullRequest(repoName, prNumber);
  res.status(200).send("Webhook received, Success.");
});

app.listen(80, () => {
  console.log("😎 KarpoReviewServer is running on port 80");
});
