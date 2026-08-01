import type { Branch, Repository } from "@pullwise/shared";

export const mockRepositories: Repository[] = [
  {
    id: 1,
    name: "commerce-web",
    fullName: "kyulee/commerce-web",
    description: "고객용 커머스 프론트엔드",
    private: true,
    language: "TypeScript",
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "design-system",
    fullName: "kyulee/design-system",
    description: "팀 공용 UI 컴포넌트",
    private: false,
    language: "TypeScript",
    updatedAt: new Date().toISOString(),
  },
];

export const mockBranches: Branch[] = [
  { name: "main", sha: "9e381af", protected: true },
  { name: "feat/checkout-redesign", sha: "2c4a1e8" },
  { name: "fix/cart-quantity", sha: "8b129cd" },
];
