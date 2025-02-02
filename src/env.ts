import dotenv from "dotenv";

dotenv.config();

const env = {
  GH_TOKEN: process.env.GH_TOKEN,
  REPO_OWNER: process.env.REPO_OWNER,
  REPO_NAME: process.env.REPO_NAME,
};

export default env;
