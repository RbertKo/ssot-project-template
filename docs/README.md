# Documentation Map

`docs/`는 제품 운영 문서의 기준 위치다. 코드와 분리된 별도 저장소가 아니며, 구현 코드와 같은 Git 저장소 안에서 함께 관리한다. 각 정보는 아래 표에서 지정한 한 곳에서만 정의한다.

## Repository Structure

```text
project/
├── docs/                     # 제품 의도, 결정, 계약, AI 메모리 운영 규칙
├── CLAUDE.md                 # AI 공통 규칙 원본
├── AGENTS.md                 # CLAUDE.md 호환 진입점
└── <implementation paths>/   # 코드, 테스트, 설정, 인프라 정의
```

구현 디렉터리 이름은 기술 구조가 확정될 때 ADR로 결정한다. 예를 들어 `apps/`, `packages/`, `services/`, `infra/`를 사용할 수 있지만, 필요가 확인되기 전에 빈 구조를 고정하지 않는다.

## Documentation Structure

```text
docs/
├── governance/              # SSoT 규칙과 운영 워크플로
├── product/
│   └── prd/                 # 제품 스펙과 해야 할 일의 원본
├── design/
│   ├── claude-design/       # Claude Design 링크, 승인본, 핸드오프
│   ├── system/              # 승인된 디자인 시스템 릴리스
│   └── decisions/           # 디자인 결정 기록
├── architecture/
│   ├── adr/                 # 아키텍처 결정 기록
│   ├── api/                 # API 계약과 버전 기록
│   ├── frontend/            # 현재 FE 구조 요약
│   ├── backend/             # 현재 BE 구조 요약
│   └── infrastructure/      # 현재 Infra 구조 요약
└── ai/                      # AI 메모리 운영 규칙과 템플릿
```

## Document Responsibilities

| 질문 | 기준 문서 |
| --- | --- |
| 무엇을 왜 만들어야 하는가? | `docs/product/prd/PRD-*.md` |
| 해야 할 일의 상태와 우선순위는 무엇인가? | 연결된 `PRD-*`의 `Work Items` |
| 지금 승인된 디자인 시스템은 무엇인가? | `docs/design/system/README.md` |
| Claude Design의 어떤 결과를 사용해야 하는가? | `docs/design/claude-design/projects.yaml` |
| 디자인을 왜 그렇게 결정했는가? | `docs/design/decisions/DDR-*.md` |
| 현재 엔지니어링 구조는 무엇인가? | `docs/architecture/current.md` |
| 구조를 왜 그렇게 결정했는가? | `docs/architecture/adr/ADR-*.md` |
| 특정 API 계약의 유효 버전은 무엇인가? | `docs/architecture/api/API-*.md` |
| 실제 제품 동작은 무엇인가? | 구현 코드와 테스트 |
| AI 도구는 어떤 규칙을 따라야 하는가? | 루트 `CLAUDE.md` |

## Naming

| 영역 | 형식 | 예시 |
| --- | --- | --- |
| PRD | `PRD-NNN-slug.md` | `PRD-001-onboarding.md` |
| PRD 내부 요구사항 | `REQ-NNN` | `REQ-001` |
| PRD 내부 작업 | `WORK-NNN` | `WORK-001` |
| 디자인 산출물 | `DES-NNN` | `DES-001` |
| 디자인 결정 | `DDR-NNN-slug.md` | `DDR-001-navigation.md` |
| 아키텍처 결정 | `ADR-NNN-slug.md` | `ADR-001-service-boundary.md` |
| API 계약 | `API-NNN-slug.md` | `API-001-user-profile.md` |

번호는 영역별로 증가시킨다. 이름을 변경해도 ID는 재사용하지 않는다.

## First Documents

- 제품 작업: [`product/prd/PRD-000-template.md`](product/prd/PRD-000-template.md)
- 디자인 결정: [`design/decisions/DDR-000-template.md`](design/decisions/DDR-000-template.md)
- 아키텍처 결정: [`architecture/adr/ADR-000-template.md`](architecture/adr/ADR-000-template.md)
- API 계약: [`architecture/api/API-000-template.md`](architecture/api/API-000-template.md)
