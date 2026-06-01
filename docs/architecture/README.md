# Architecture

아키텍처 영역은 같은 저장소 안에 있는 구현 코드의 현재 구조, 결정 이유, API 계약을 분리해 관리한다.

## Authority

| 정보 | 기준 위치 |
| --- | --- |
| 현재 전체 구조 요약 | [`current.md`](current.md) |
| 구조 변경 이유 | `adr/ADR-*.md` |
| API 계약과 버전 | `api/API-*.md` |
| 영역별 현재 구조 | `frontend/`, `backend/`, `infrastructure/` |

## Rules

- 제품 요구사항은 PRD에만 기록한다.
- 구조가 바뀌면 먼저 ADR을 추가하고 `current.md`를 갱신한다.
- ADR은 과거 판단을 보존한다. 새 결정이 이전 결정을 대체하면 새 ADR에서 `supersedes`를 기록한다.
- API 계약은 명시적 버전을 갖고 관련 PRD와 ADR을 참조한다.
- 현재 구조 문서는 실제 구현 경로를 연결하고, 구현을 대신 설명하는 복제 문서가 되지 않는다.
