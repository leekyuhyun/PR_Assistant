import { GoogleGenAI } from "@google/genai";
import type { GenerateDraftRequest, PullRequestDraft } from "@pullwise/shared";
import { env } from "../config/env.js";
import { mockDraft } from "../mocks/draft.mock.js";

export async function generateDraft(
  input: GenerateDraftRequest,
): Promise<PullRequestDraft> {
  if (env.useMockData) return mockDraft;
  if (!env.geminiApiKey) {
    throw new Error("GEMINI_API_KEY가 설정되지 않았습니다.");
  }

  const ai = new GoogleGenAI({ apiKey: env.geminiApiKey });
  const response = await ai.models.generateContent({
    model: env.geminiModel,
    contents: `다음 브랜치 비교 결과를 바탕으로 한국어 PR 문서 초안을 작성하세요.
저장소: ${input.repository}
기준 브랜치: ${input.baseBranch}
작업 브랜치: ${input.headBranch}
템플릿: ${input.template || "변경 사항, 변경 배경, 테스트, 리뷰 포인트"}

첫 줄은 PR 제목, 이후에는 Markdown 본문만 출력하세요.`,
  });

  const text = response.text?.trim();
  if (!text) throw new Error("Gemini가 빈 응답을 반환했습니다.");
  const [firstLine, ...body] = text.split("\n");

  return {
    title: firstLine?.replace(/^#\s*/, "") || "PR 문서 초안",
    markdown: body.join("\n").trim(),
    summary: "선택한 브랜치의 변경 사항을 바탕으로 작성된 초안입니다.",
    filesChanged: 0,
    additions: 0,
    deletions: 0,
    commits: 0,
  };
}
