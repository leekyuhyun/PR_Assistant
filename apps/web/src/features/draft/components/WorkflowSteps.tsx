import { Check, LockKeyhole } from "lucide-react";

export function WorkflowSteps({
  connected,
  draftReady,
}: {
  connected: boolean;
  draftReady: boolean;
}) {
  return (
    <aside className="steps">
      <div className="step done">
        <span><Check size={14} /></span>
        <div><b>GitHub 연결</b><small>{connected ? "계정 연결됨" : "데모 모드"}</small></div>
      </div>
      <div className="step active">
        <span>2</span>
        <div><b>변경 사항 선택</b><small>저장소와 브랜치를 골라주세요</small></div>
      </div>
      <div className={`step ${draftReady ? "done" : ""}`}>
        <span>{draftReady ? <Check size={14} /> : "3"}</span>
        <div><b>AI 분석</b><small>커밋과 diff를 이해합니다</small></div>
      </div>
      <div className="step">
        <span>4</span>
        <div><b>검토 및 내보내기</b><small>초안을 다듬고 복사하세요</small></div>
      </div>
      <div className="privacy">
        <LockKeyhole size={16} />
        <div><b>코드는 안전하게</b><p>분석을 위해서만 처리되며 저장하지 않습니다.</p></div>
      </div>
    </aside>
  );
}
