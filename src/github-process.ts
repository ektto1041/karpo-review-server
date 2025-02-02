import axios, { AxiosError } from "axios";
import env from "./env";

export async function processPullRequest(prNumber: string) {
  console.log(`🚀 Fetching changed files for PR #${prNumber}...`);

  try {
    const url = `https://api.github.com/repos/${env.REPO_OWNER}/${env.REPO_NAME}/pulls/${prNumber}/files`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${env.GH_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    const files = response.data;
    let commentBody = "🤖 PR에서 변경된 파일들의 첫 문장:\n\n";

    for (const file of files) {
      if (file.patch) {
        commentBody += file.patch;
      }
    }

    await postComment(prNumber, commentBody);
  } catch (e) {
    const error = e as AxiosError;

    console.error(
      `❌ PR #${prNumber} 처리 실패:`,
      error.response?.data || error.message
    );
  }
}

// PR에 댓글 작성 함수
async function postComment(prNumber: string, message: string) {
  try {
    const url = `https://api.github.com/repos/${env.REPO_OWNER}/${env.REPO_NAME}/issues/${prNumber}/comments`;
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
