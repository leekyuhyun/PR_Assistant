import type { Branch, Repository } from "@pullwise/shared";
import { env } from "../config/env.js";
import { mockBranches, mockRepositories } from "../mocks/github.mock.js";

type GitHubRepository = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  language: string | null;
  updated_at: string;
};

type GitHubBranch = {
  name: string;
  protected: boolean;
  commit: { sha: string };
};

async function githubRequest<T>(path: string, accessToken?: string): Promise<T> {
  if (!accessToken) {
    throw new Error("GitHub access token이 필요합니다.");
  }

  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API 요청 실패 (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export async function getRepositories(accessToken?: string): Promise<Repository[]> {
  if (env.useMockData) return mockRepositories;
  const result = await githubRequest<GitHubRepository[]>(
    "/user/repos?sort=updated&per_page=100",
    accessToken,
  );
  return result.map((repo) => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || "",
    private: repo.private,
    language: repo.language || "Unknown",
    updatedAt: repo.updated_at,
  }));
}

export async function getBranches(
  owner: string,
  repository: string,
  accessToken?: string,
): Promise<Branch[]> {
  if (env.useMockData) return mockBranches;
  const result = await githubRequest<GitHubBranch[]>(
    `/repos/${owner}/${repository}/branches?per_page=100`,
    accessToken,
  );
  return result.map((branch) => ({
    name: branch.name,
    sha: branch.commit.sha,
    protected: branch.protected,
  }));
}
