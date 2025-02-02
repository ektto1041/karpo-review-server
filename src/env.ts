import dotenv from "dotenv";

dotenv.config();

const env = {
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  REPO_OWNER: process.env.REPO_OWNER,
  REPO_NAME: process.env.REPO_NAME,
};

export default env;
