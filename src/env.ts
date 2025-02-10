import dotenv from "dotenv";

dotenv.config();

const env = {
  GH_TOKEN: process.env.GH_TOKEN,
  REPO_OWNER: process.env.REPO_OWNER,
  REPO_NAME_FE: process.env.REPO_NAME_FE,
  REPO_NAME_BE: process.env.REPO_NAME_BE,
};

export default env;
