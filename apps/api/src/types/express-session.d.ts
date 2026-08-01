import type { AuthUser } from "@pullwise/shared";

declare module "express-session" {
  interface SessionData {
    githubAccessToken: string;
    githubUser: AuthUser;
    oauthState: string;
  }
}
