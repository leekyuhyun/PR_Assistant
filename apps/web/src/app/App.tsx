import { useState } from "react";
import type { PullRequestDraft } from "@pullwise/shared";
import { Github, LoaderCircle, Sparkles } from "lucide-react";
import { env } from "../config/env";
import { AppHeader } from "../features/auth/components/AppHeader";
import { useAuthSession } from "../features/auth/hooks/useAuthSession";
import { createDraft } from "../features/draft/api/draft.api";
import { DraftResult } from "../features/draft/components/DraftResult";
import { WorkflowSteps } from "../features/draft/components/WorkflowSteps";
import { RepositoryForm } from "../features/repository/components/RepositoryForm";
import { useRepositorySelection } from "../features/repository/hooks/useRepositorySelection";

export default function App() {
  const auth = useAuthSession();
  const selection = useRepositorySelection(auth.authenticated);
  const [draft, setDraft] = useState<PullRequestDraft | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [draftError, setDraftError] = useState("");

  async function analyze() {
    setAnalyzing(true);
    setDraftError("");
    try {
      setDraft(
        await createDraft({
          repository: selection.repository,
          baseBranch: selection.baseBranch,
          headBranch: selection.headBranch,
        }),
      );
    } catch (error) {
      setDraftError(
        error instanceof Error ? error.message : "초안을 생성하지 못했습니다.",
      );
    } finally {
      setAnalyzing(false);
    }
  }

  async function logout() {
    await auth.logout();
    setDraft(null);
  }

  return (
    <div className="app">
      <AppHeader user={auth.user} loading={auth.loading} onLogout={logout} />
      <main>
        <section className="hero">
          <div className="eyebrow">
            <Sparkles size={14} /> Pull Request Assistant
          </div>
          <h1>
            코드는 이미 완성됐어요.
            <br />
            <em>설명은 저희가 쓸게요.</em>
          </h1>
          <p>
            브랜치의 변경 사항을 읽고, 팀의 템플릿에 꼭 맞는
            <br className="desktop" /> 명확한 PR 문서를 몇 초 안에 만듭니다.
          </p>
        </section>
        {auth.loading ? (
          <section className="result">
            <div className="result-head">
              <div>
                <span className="overline">SESSION</span>
                <h2>
                  <LoaderCircle className="spin" size={18} /> 로그인 상태 확인
                  중
                </h2>
              </div>
            </div>
          </section>
        ) : auth.authenticated ? (
          <section className="workspace">
            <WorkflowSteps connected draftReady={Boolean(draft)} />
            <RepositoryForm
              {...selection}
              analyzing={analyzing}
              error={draftError || selection.error}
              onRepositoryChange={selection.setRepository}
              onBaseChange={selection.setBaseBranch}
              onHeadChange={selection.setHeadBranch}
              onAnalyze={analyze}
            />
          </section>
        ) : (
          <section className="result">
            <div className="result-head">
              <div>
                <span className="overline">GET STARTED</span>
                <h2>GitHub 계정을 먼저 연결해 주세요</h2>
                <p>연결 후 접근 가능한 저장소와 브랜치를 불러올 수 있습니다.</p>
              </div>
              <a
                className="github-button"
                href={`${env.apiUrl}/api/auth/github`}
              >
                <Github size={17} /> GitHub로 시작하기
              </a>
            </div>
          </section>
        )}
        {draft && (
          <DraftResult
            draft={draft}
            onChange={setDraft}
            onRegenerate={analyze}
          />
        )}
      </main>
      <footer>
        <span>PR-Genie</span>
        <p>Better context. Better reviews. Better software.</p>
        <small>Powered by Gemini</small>
      </footer>
    </div>
  );
}
