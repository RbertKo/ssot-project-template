---
modified_at: 2026-10-19
reason: SSoT 보일러플레이트에 문서 검사·파생 인덱스·적용 및 정본 경계 규칙을 반영했다
---

# Capability Map

표는 원문 메타데이터의 파생 뷰다. 원문을 수정한 뒤 저장소 루트에서 `node scripts/ssot-docs.mjs --write`로 갱신한다. 생성 구역을 직접 편집하지 않는다.

제품의 대단위 기능 영역을 관리한다. Capability는 사용자에게 제공하는 안정적인 능력과 경계를 설명한다. 상세 요구사항, 일정, 우선순위, 실행 상태는 연결된 `PRD-*`에서만 관리한다.

## Lifecycle

| 상태 | 의미 |
| --- | --- |
| `Proposed` | 제품 범위에 포함할지 검토 중 |
| `Active` | 제품이 현재 제공하거나 제공하기로 결정한 기능 영역 |
| `Retired` | 더 이상 제품 범위에 포함하지 않음 |

Capability의 구현 진행률을 별도 숫자나 상태로 관리하지 않는다. 진행 상황은 연결된 PRD의 상태를 기준으로 판단한다. `연결 PRD` 열은 각 PRD의 `capability_refs`에서 파생한 탐색용 요약이다.

## Capability Index

<!-- ssot-index:start -->
| ID | 제목 | Lifecycle | 상위 Capability | 연결 PRD | 문서 |
| --- | --- | --- | --- | --- | --- |
<!-- ssot-index:end -->

## Relationships

필요하면 Mermaid 다이어그램으로 capability 간 관계를 기록한다.

```mermaid
flowchart LR
  Product[Product] --> Capability[CAP-NNN Example]
```

## Create A Capability

[`CAP-000-template.md`](CAP-000-template.md)를 복제하고 다음 순번과 짧은 slug를 사용한다.

## Change Log

| 날짜 | 변경자 | 변경 이유 |
| --- | --- | --- |
| 2026-10-19 | Codex | SSoT 보일러플레이트에 문서 검사·파생 인덱스·적용 및 정본 경계 규칙을 반영했다 |
