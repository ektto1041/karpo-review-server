import OpenAI from "openai";

const openAI = new OpenAI();

export const generateReviewTopicsGPT = async (patchContents: string) => {
  try {
    const prompt = `
다음은 GitHub PR에서 변경된 코드입니다. 이 변경 사항을 바탕으로 코드 리뷰 주제 3가지를 제안해주세요.

변경된 코드:
\`\`\`
${patchContents}
\`\`\`

형식 예시:
1. **코드 가독성 개선** - 변수 네이밍과 함수 구조 개선 방안
2. **성능 최적화** - 반복문을 줄이는 방법
3. **보안 취약점 분석** - 사용자 입력 검증 필요 여부
`;

    const response = await openAI.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    // @ts-ignore
    console.error("❌ ChatGPT API 요청 실패:", error.message);
    return "AI 리뷰 생성 실패.";
  }
};
