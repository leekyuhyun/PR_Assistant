import type { Branch, Repository } from "@pullwise/shared";
import { env } from "../../../config/env";
import { apiRequest } from "../../../shared/api/client";

export async function fetchRepositories(): Promise<Repository[]> {
  if (env.useMocks) {
    const { mockRepositories } = await import(
      "../../../mocks/repository.mock"
    );
    return mockRepositories;
  }
  return apiRequest<Repository[]>("/api/repositories");
}

export async function fetchBranches(fullName: string): Promise<Branch[]> {
  if (env.useMocks) {
    const { mockBranches } = await import("../../../mocks/repository.mock");
    return mockBranches;
  }
  return apiRequest<Branch[]>(`/api/repositories/${fullName}/branches`);
}
