---
modified_at: 2026-10-19
reason: SSoT 보일러플레이트에 문서 검사·파생 인덱스·적용 및 정본 경계 규칙을 반영했다
---

# Project AI Memory

이 파일은 프로젝트 전역 AI 작업 규칙의 Single Source of Truth다.

## Read Order

작업 전에 다음 문서를 순서대로 확인한다.

1. [`docs/README.md`](docs/README.md)
2. [`docs/governance/ssot.md`](docs/governance/ssot.md)
3. [`docs/governance/workflow.md`](docs/governance/workflow.md)
4. [`docs/product/overview.md`](docs/product/overview.md)
5. 작업 대상과 연결된 `CAP-*`, `PRD-*`, `DES-*`, `DDR-*`, `ADR-*`, `API-*` 문서
6. 작업 대상 구현 코드와 테스트

## Product Rules

- 제품 전체 방향은 `docs/product/overview.md`에서 정의한다.
- 대단위 기능 경계는 `docs/product/capabilities/`의 `CAP-*`에서 정의한다.
- 상세 요구사항과 해야 할 일은 `docs/product/prd/`의 PRD에서만 정의한다.
- PRD는 하나 이상의 `CAP-*`를 참조한다.
- 디자인, 아키텍처, API 문서는 요구사항을 복제하지 않고 PRD ID를 참조한다.
- 구현 코드와 테스트는 같은 저장소에서 관리하고 연결 PRD의 의도와 완료 기준을 충족해야 한다.
- 외부 도구의 상태와 설명은 저장소 문서를 대체하지 않는다.
- 기존 결정과 충돌하는 변경은 관련 PRD와 ADR 또는 DDR을 먼저 갱신한다.
- 승인되지 않은 아이디어를 현재 스펙처럼 서술하지 않는다.

## Change Rules

- 문서를 수정하면 `modified_at`과 `reason`을 갱신하고 `Change Log`에 이력을 추가한다.
- `Hold`, `Cancel`, `Done` 전환에는 이유 또는 완료 근거를 남긴다.
- 시점별 기록이 필요한 결정은 기존 문서를 덮어쓰지 않고 새 ADR 또는 DDR로 남긴다.
- 구현을 변경하면 연결 PRD, ADR, API 계약, 테스트에 함께 반영할 내용이 있는지 확인한다.
- 구현 파일이 추가되면 해당 디렉터리에 별도 지침이 필요한지 판단한다.
- CAP·PRD·ADR·DDR·API 원문을 바꾼 뒤 `node scripts/ssot-docs.mjs --write`로 인덱스를 재생성하고 `node scripts/ssot-docs.mjs`로 확인한다. 생성 구역을 직접 편집하지 않는다.
- 상태 전환은 Change Log에 날짜·주체·대상·이전→이후 상태·근거를 기록한다. 계획·구현 기록·검증 보고서는 연결 PRD의 근거이며 별도 작업 상태 정본이 아니다.
- 새 프로젝트 적용 시 [적용 가이드](docs/governance/adoption.md)에 따라 통합 브랜치·구현 경로·검증 명령을 실제 프로젝트에 맞춘다. 템플릿의 예시를 현재 제품으로 서술하지 않는다.

## Scoped Memory

하위 디렉터리에 별도 AI 규칙이 필요할 때만 `CLAUDE.md`와 `AGENTS.md`를 한 쌍으로 둔다.

- 하위 `CLAUDE.md`는 해당 범위의 추가 규칙만 기록한다.
- 하위 `AGENTS.md`는 같은 디렉터리의 `CLAUDE.md`를 참조한다.
- 공통 규칙은 이 파일에만 기록하고 하위 파일에 복제하지 않는다.

## Change Log

| 날짜 | 변경자 | 변경 이유 |
| --- | --- | --- |
| 2026-10-19 | Codex | SSoT 보일러플레이트에 문서 검사·파생 인덱스·적용 및 정본 경계 규칙을 반영했다 |
