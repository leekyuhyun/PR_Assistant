# PR-Genie

GitHub의 변경 사항과 PR 템플릿을 Gemini로 분석해 초안을 작성하는 PR 어시스턴트입니다.

## 구성

- `apps/web`: React + Vite + Tailwind CSS
- `apps/api`: Express + TypeScript
- `packages/shared`: 프론트/백엔드 공용 타입

### 폴더 구조

프론트엔드는 `features` 아래에서 인증, 저장소 선택, PR 초안 기능을 각각 관리합니다. 공통 API 클라이언트는 `shared`, 실행 환경 설정은 `config`, 개발용 데이터는 `mocks`에 분리되어 있습니다.

백엔드는 요청 경로를 선언하는 `routes`, 입력과 응답을 처리하는 `controllers`, GitHub·Gemini 연동을 담당하는 `services`로 나뉩니다. 개발용 데이터는 `mocks`에서만 관리합니다.

## 시작하기

Node.js 20 이상과 pnpm 9 이상이 필요합니다.

```bash
pnpm install
cp .env.example .env
pnpm dev
```

- Web: http://localhost:5173
- API: http://localhost:4000
- Health check: http://localhost:4000/api/health

로컬 개발에서 목업 화면이 필요한 경우에만 `USE_MOCK_DATA=true`, `VITE_USE_MOCKS=true`로 설정합니다. 실제 API를 확인할 때는 두 값을 `false`로 바꾸고 GitHub/Gemini 환경 변수를 설정합니다. 루트 `.env`는 프론트엔드와 백엔드가 함께 읽으며, 값을 변경한 뒤에는 개발 서버를 다시 시작해야 합니다.

## GitHub OAuth 설정

GitHub OAuth App을 만든 뒤 아래 값을 설정합니다.

- Homepage URL: `http://localhost:5173`
- Authorization callback URL: `http://localhost:4000/api/auth/github/callback`
- 권장 scope: `read:user user:email repo` (공개 저장소만 지원할 경우 `repo` 제외 가능)

운영 환경에서는 `APP_URL`, `API_URL`, `GITHUB_CALLBACK_URL`을 실제 Render 주소로 변경합니다.

로그인에 성공하면 GitHub access token과 사용자 프로필은 서버 세션에 저장되고 브라우저에는 `HttpOnly` 세션 쿠키만 전달됩니다. 현재 기본 세션 저장소는 로컬 개발용 메모리 저장소이므로 서버가 재시작되면 로그인이 해제됩니다. 운영 환경에서는 Redis와 같은 외부 세션 저장소로 교체해야 합니다.

## Gemini

`GEMINI_API_KEY`를 설정하면 API 서버가 변경 파일 목록, 커밋, diff, PR 템플릿을 Gemini에 전달해 Markdown 초안을 생성합니다. 키가 없으면 안전한 샘플 초안을 반환합니다.

## Render 배포

루트의 `render.yaml` Blueprint를 이용합니다. Web은 Static Site, API는 Web Service로 분리되며 같은 저장소에서 배포됩니다. Render 대시보드에서 GitHub/Gemini 비밀값과 운영 URL을 설정해야 합니다.

## 다음 구현 순서

1. GitHub OAuth 토큰을 서버 세션/DB에 암호화 저장
2. GitHub API로 사용자 저장소, 브랜치, compare diff, PR 템플릿 조회
3. Gemini structured output 및 토큰 제한/대용량 diff 요약 전략 추가
4. 초안 수정 이력과 Markdown 내보내기 기능 추가
