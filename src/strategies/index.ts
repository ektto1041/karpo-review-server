import { generateReviewTopicsGPT } from "./gpt";

type GenerateReviewTopicsStrategy = (
  patchContents: string
) => Promise<string | null>;

export const generateReviewTopics: GenerateReviewTopicsStrategy =
  generateReviewTopicsGPT;
