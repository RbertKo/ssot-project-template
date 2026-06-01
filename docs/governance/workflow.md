# Workflow

제품 작업은 PRD를 중심으로 흐른다. 디자인과 아키텍처 문서는 PRD를 구체화하거나 결정 이유를 기록하고, 구현 코드와 테스트는 같은 저장소에서 완료 기준을 실현하고 검증한다. 어느 영역도 별도 요구사항 백로그가 되지 않는다.

## PRD Status

| 상태 | 의미 | 전환 시 필수 기록 |
| --- | --- | --- |
| `ToDo` | 정의됐지만 아직 진행하지 않음 | 우선순위와 완료 기준 |
| `InProgress` | 현재 진행 중 | 담당자와 다음 확인 지점 |
| `Hold` | 의도적으로 중단 | 중단 이유와 재검토 조건 |
| `Done` | 완료 기준을 충족함 | 검증 근거 |
| `Cancel` | 더 이상 진행하지 않음 | 취소 이유 |

PRD 자체와 PRD 내부 `Work Items`는 같은 상태 집합을 사용한다. PRD 상태는 내부 작업과 완료 기준을 검토한 뒤 수동으로 갱신한다.

## Priority

Linear의 단순한 우선순위 모델을 따라 다음 값만 사용한다.

| 우선순위 | 의미 |
| --- | --- |
| `Urgent` | 즉시 처리하지 않으면 제품 또는 일정에 직접적인 손상이 발생함 |
| `High` | 현재 계획 구간에서 우선 처리함 |
| `Medium` | 일반적인 기본값 |
| `Low` | 여유가 있을 때 처리함 |

더 세밀한 구분이 필요하면 우선순위를 늘리지 않고 상태, 일정, 의존성으로 표현한다.

## Required Metadata

모든 PRD는 다음 필드를 가진다.

| 필드 | 형식 | 설명 |
| --- | --- | --- |
| `id` | `PRD-NNN` | 변경되지 않는 식별자 |
| `status` | PRD 상태 | 현재 상태 |
| `priority` | 우선순위 | 처리 순서 |
| `owner` | 이름 또는 `Unassigned` | 책임자 |
| `created_at` | `YYYY-MM-DD` | 최초 작성일 |
| `modified_at` | `YYYY-MM-DD` | 마지막 의미 변경일 |
| `due_date` | `YYYY-MM-DD` 또는 `null` | 완료 목표일 |
| `reason` | 한 문장 | 마지막 변경 이유 |
| `external_refs` | 키와 URL 또는 ID | 외부 도구 연결 |

## Decision Record Status

ADR과 DDR은 다음 상태 집합을 사용한다.

| 상태 | 의미 |
| --- | --- |
| `Proposed` | 검토 중인 제안 |
| `Accepted` | 현재 유효한 결정 |
| `Superseded` | 새 결정으로 대체됨 |
| `Rejected` | 검토 후 채택하지 않음 |

## API Contract Status

API 계약은 다음 상태 집합을 사용한다.

| 상태 | 의미 |
| --- | --- |
| `Draft` | 검토 중인 계약 |
| `Active` | 현재 유효한 계약 |
| `Deprecated` | 대체 버전으로 이동해야 하는 계약 |
| `Retired` | 더 이상 사용하지 않는 계약 |

## Change Procedure

1. PRD의 요구사항, 작업 상태, 일정, 우선순위를 먼저 갱신한다.
2. `modified_at`과 `reason`을 갱신한다.
3. PRD의 `Change Log`에 수정 이유를 추가한다.
4. 필요한 디자인, DDR, ADR, API 문서를 추가하거나 연결한다.
5. 구현 코드와 테스트를 변경하고 PRD에 구현 경로와 검증 근거를 연결한다.
6. 외부 도구를 사용하는 경우 PRD 변경을 기준으로 동기화한다.

## Review Gates

| 시점 | 확인 사항 |
| --- | --- |
| `ToDo` 등록 | 문제, 범위, 완료 기준, 우선순위가 명확한가 |
| `InProgress` 전환 | 담당자, 의존성, 필요한 디자인과 결정 문서, 예상 구현 경로가 연결됐는가 |
| 디자인 승인 | `DES-*` 승인 버전과 내보내기본이 등록됐는가 |
| 구조 변경 | 관련 ADR과 API 버전 영향이 기록됐는가 |
| `Done` 전환 | 완료 기준별 구현 경로와 테스트 등 검증 근거가 기록됐는가 |
| `Hold` 또는 `Cancel` 전환 | 이유와 후속 조건이 기록됐는가 |

## Linear Reference

이 상태 모델은 Linear의 이슈 워크플로와 단순한 우선순위 모델을 참고한다.

- [Linear issue status](https://linear.app/docs/configuring-workflows)
- [Linear priority](https://linear.app/docs/priority)
- [Linear due dates](https://linear.app/docs/due-dates)
