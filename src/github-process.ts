import axios, { AxiosError } from "axios";
import env from "./env";
import { generateReviewTopics } from "./strategies";

export async function processPullRequest(repoName: string, prNumber: string) {
  console.log(
    `🚀 Fetching changed files for PR #${prNumber} in Repo ${repoName}...`
  );

  try {
    const url = `https://api.github.com/repos/${env.REPO_OWNER}/${repoName}/pulls/${prNumber}/files`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${env.GH_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    const files = response.data;
    let patchContents = "";

    for (const file of files) {
      if (file.patch) {
        patchContents += `File: ${file.filename}\n${file.patch}\n\n`;
      }
    }

    if (!patchContents) {
      console.log("😅 변경된 코드 없음.");
      return;
    }

    const reviewTopics = await generateReviewTopics(patchContents);
    const commentBody = `### AI 코드 리뷰 주제 추천\n\n${reviewTopics}`;

    await postComment(repoName, prNumber, commentBody);
  } catch (e) {
    const error = e as AxiosError;

    console.error(
      `❌ PR #${prNumber} 처리 실패:`,
      error.response?.data || error.message
    );
  }
}

// PR에 댓글 작성 함수
async function postComment(
  repoName: string,
  prNumber: string,
  message: string
) {
  try {
    const url = `https://api.github.com/repos/${env.REPO_OWNER}/${repoName}/issues/${prNumber}/comments`;
    await axios.post(
      url,
      { body: message },
      {
        headers: {
          Authorization: `Bearer ${env.GH_TOKEN}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    console.log(`✅ PR #${prNumber}에 댓글 추가 성공!`);
  } catch (e) {
    const error = e as AxiosError;

    console.error(
      `❌ PR #${prNumber} 댓글 추가 실패:`,
      error.response?.data || error.message
    );
  }
}
