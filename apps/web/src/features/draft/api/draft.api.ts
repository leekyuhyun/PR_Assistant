import type {
  GenerateDraftRequest,
  PullRequestDraft,
} from "@pullwise/shared";
import { env } from "../../../config/env";
import { apiRequest } from "../../../shared/api/client";

export async function createDraft(
  input: GenerateDraftRequest,
): Promise<PullRequestDraft> {
  if (env.useMocks) {
    const { mockDraft } = await import("../../../mocks/draft.mock");
    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockDraft;
  }
  return apiRequest<PullRequestDraft>("/api/drafts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
