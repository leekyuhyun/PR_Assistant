import type { AuthUser } from "@pullwise/shared";
import { Github, LogOut } from "lucide-react";
import { env } from "../../../config/env";

type Props = {
  user: AuthUser | null;
  loading: boolean;
  onLogout: () => void;
};

export function AppHeader({ user, loading, onLogout }: Props) {
  return (
    <header className="topbar">
      <a className="brand" href="/" aria-label="PR-Genie 홈">
        <span className="brand-mark">
          <img src="/favicon.png" alt="" />
        </span>
        PR-Genie
      </a>
      <div className="top-actions">
        <span className="status-dot">
          <i /> API ready
        </span>
        {user ? (
          <>
            <a
              className="avatar"
              href={user.profileUrl}
              target="_blank"
              rel="noreferrer"
            >
              <img src={user.avatarUrl} alt="" />
              <span className="avatar-copy">
                {user.name} <small>@{user.login}</small>
              </span>
            </a>
            <button
              className="copy"
              type="button"
              onClick={onLogout}
              aria-label="로그아웃"
            >
              <LogOut size={15} />
            </button>
          </>
        ) : (
          <a
            className="github-button"
            href={`${env.apiUrl}/api/auth/github`}
            aria-disabled={loading}
          >
            <Github size={17} />
            {loading ? "로그인 확인 중..." : "GitHub로 시작하기"}
          </a>
        )}
      </div>
    </header>
  );
}
