import type { AuthUser } from "@pullwise/shared";
import { env } from "../config/env.js";

type GitHubUserResponse = {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
};

export function getGitHubAuthorizationUrl(state: string): string | null {
  if (!env.githubClientId) return null;
  const params = new URLSearchParams({
    client_id: env.githubClientId,
    redirect_uri: env.githubCallbackUrl,
    scope: "read:user repo",
    state,
  });
  return `https://github.com/login/oauth/authorize?${params}`;
}

export async function exchangeGitHubCode(code: string): Promise<string> {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: env.githubClientId,
      client_secret: env.githubClientSecret,
      code,
      redirect_uri: env.githubCallbackUrl,
    }),
  });
  const result = (await response.json()) as {
    access_token?: string;
    error_description?: string;
  };
  if (!result.access_token) {
    throw new Error(
      result.error_description || "GitHub OAuth 토큰 교환에 실패했습니다.",
    );
  }
  return result.access_token;
}

export async function getGitHubUser(accessToken: string): Promise<AuthUser> {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!response.ok) {
    throw new Error(`GitHub 사용자 조회에 실패했습니다. (${response.status})`);
  }
  const user = (await response.json()) as GitHubUserResponse;
  return {
    id: user.id,
    login: user.login,
    name: user.name || user.login,
    avatarUrl: user.avatar_url,
    profileUrl: user.html_url,
  };
}
