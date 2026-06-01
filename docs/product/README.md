# Product

제품 전체 방향, 대단위 기능, 구현 가능한 변화, 실행 항목을 서로 다른 계층으로 관리한다.

## Hierarchy

```text
overview.md
└── capabilities/CAP-*.md
    └── prd/PRD-*.md
        └── WORK-*
```

| 계층 | 기준 위치 | 역할 |
| --- | --- | --- |
| Product Overview | [`overview.md`](overview.md) | 제품 전체 방향, 사용자, 가치, 범위 |
| Capability | [`capabilities/`](capabilities/README.md) | 대단위 기능 영역과 안정적인 경계 |
| PRD | [`prd/`](prd/README.md) | 구현 가능한 변화의 상세 요구사항, 일정, 완료 기준 |
| Work Item | 각 `PRD-*`의 `Work Items` | 구체적인 실행 항목 |

## Rules

- 하나의 PRD는 검토 가능한 하나의 제품 변화 단위를 설명한다.
- 큰 기능 영역은 `CAP-*`로 정의하고 여러 PRD로 분리한다.
- PRD는 하나 이상의 `CAP-*`를 참조하고, 관련 PRD는 `depends_on` 또는 `related_prds`로 연결한다.
- 모든 요구사항은 `REQ-*` ID를 가진다.
- 모든 실행 항목은 PRD 내부 `Work Items`에 기록한다.
- 디자인, DDR, ADR, API 문서는 요구사항을 복제하지 않고 PRD를 참조한다.
- 구현 코드와 테스트는 같은 저장소에 두고 PRD의 `implementation_refs`와 검증 근거에서 연결한다.

## Create A PRD

[`prd/PRD-000-template.md`](prd/PRD-000-template.md)를 복제하고 다음 순번과 짧은 slug를 사용한다.

## Create A Capability

[`capabilities/CAP-000-template.md`](capabilities/CAP-000-template.md)를 복제하고 다음 순번과 짧은 slug를 사용한다.
