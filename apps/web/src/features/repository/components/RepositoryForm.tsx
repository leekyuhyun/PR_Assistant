import type { Branch, Repository } from "@pullwise/shared";
import {
  ArrowRight,
  ChevronDown,
  CircleDot,
  Github,
  GitPullRequest,
  LoaderCircle,
  Sparkles,
} from "lucide-react";
import { SelectField } from "./SelectField";

type Props = {
  repositories: Repository[];
  branches: Branch[];
  repository: string;
  baseBranch: string;
  headBranch: string;
  activeRepository?: Repository;
  loading: boolean;
  analyzing: boolean;
  error: string;
  onRepositoryChange: (value: string) => void;
  onBaseChange: (value: string) => void;
  onHeadChange: (value: string) => void;
  onAnalyze: () => void;
};

export function RepositoryForm(props: Props) {
  const branchNames = props.branches.map((branch) => branch.name);
  const invalid =
    !props.repository ||
    !props.baseBranch ||
    !props.headBranch ||
    props.baseBranch === props.headBranch;

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <span className="overline">STEP 2 OF 4</span>
          <h2>어떤 변경을 문서화할까요?</h2>
          <p>PR 문서를 작성할 저장소와 비교할 두 브랜치를 선택하세요.</p>
        </div>
        <CircleDot size={24} />
      </div>
      <div className="form-grid">
        <label className="field repo-field">
          <span>Repository</span>
          <div className="select-wrap repo-select">
            <Github size={18} />
            <select
              value={props.repository}
              onChange={(event) =>
                props.onRepositoryChange(event.target.value)
              }
            >
              {props.repositories.map((item) => (
                <option key={item.id} value={item.fullName}>
                  {item.fullName}
                </option>
              ))}
            </select>
            <ChevronDown size={16} />
          </div>
          <small>
            {props.activeRepository?.description || "저장소를 선택해 주세요"} ·{" "}
            {props.activeRepository?.private ? "Private" : "Public"}
          </small>
        </label>
        <div className="branch-grid">
          <SelectField
            label="Base branch"
            value={props.baseBranch}
            options={branchNames}
            onChange={props.onBaseChange}
          />
          <div className="arrow">
            <ArrowRight size={18} />
          </div>
          <SelectField
            label="Compare branch"
            value={props.headBranch}
            options={branchNames}
            onChange={props.onHeadChange}
          />
        </div>
      </div>
      <div className="commit-card">
        <div className="commit-icon">
          <GitPullRequest size={19} />
        </div>
        <div>
          <b>선택한 브랜치의 변경 사항을 분석합니다</b>
          <p>
            {props.baseBranch || "base"} → {props.headBranch || "compare"}
          </p>
        </div>
      </div>
      {props.error && <p role="alert">{props.error}</p>}
      <button
        className="analyze"
        disabled={props.loading || props.analyzing || invalid}
        onClick={props.onAnalyze}
      >
        {props.analyzing ? (
          <>
            <LoaderCircle className="spin" size={18} /> 변경 사항을 읽는 중...
          </>
        ) : (
          <>
            <Sparkles size={18} /> AI로 PR 문서 만들기
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </div>
  );
}
