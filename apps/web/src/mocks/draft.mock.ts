import type { PullRequestDraft } from "@pullwise/shared";

export const mockDraft: PullRequestDraft = {
  title: "feat: 결제 플로우를 3단계 체크아웃으로 개선",
  summary:
    "결제 이탈률을 줄이기 위해 배송지, 결제 수단, 주문 확인 단계를 분리했습니다.",
  filesChanged: 12,
  additions: 428,
  deletions: 96,
  commits: 5,
  markdown: `## 변경 사항

- 기존 단일 페이지 체크아웃을 3단계 플로우로 개편했습니다.
- 단계별 입력 상태를 유지하는 \`CheckoutProvider\`를 추가했습니다.
- 모바일 주문 요약 UI와 결제 오류 피드백을 개선했습니다.

## 변경 배경

긴 결제 양식을 한 번에 작성하면서 발생하는 이탈을 줄이고 현재 진행 단계를 명확하게 보여주기 위한 변경입니다.

## 테스트

- [x] 배송지 입력 및 유효성 검증
- [x] 카드 및 간편결제 수단 전환
- [x] 모바일·데스크톱 반응형 UI
- [ ] 스테이징 환경 E2E 확인

## 리뷰 포인트

1. \`CheckoutProvider\`의 상태 범위가 적절한지 확인해 주세요.
2. 결제 재시도 시 중복 주문 방지 로직을 중점적으로 확인해 주세요.`,
};
