export type Repository = {
  id: number;
  name: string;
  fullName: string;
  description: string;
  private: boolean;
  language: string;
  updatedAt: string;
};

export type Branch = {
  name: string;
  sha: string;
  protected?: boolean;
};

export type GenerateDraftRequest = {
  repository: string;
  baseBranch: string;
  headBranch: string;
  template?: string;
};

export type PullRequestDraft = {
  title: string;
  markdown: string;
  summary: string;
  filesChanged: number;
  additions: number;
  deletions: number;
  commits: number;
};

export type AuthUser = {
  id: number;
  login: string;
  name: string;
  avatarUrl: string;
  profileUrl: string;
};

export type AuthSession = {
  authenticated: boolean;
  user: AuthUser | null;
};
