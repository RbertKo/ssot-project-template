# Design

디자인 영역은 작업 중인 편집 원본과 제품에 사용할 승인 기준선을 구분한다.

## Authority

| 정보 | 기준 위치 |
| --- | --- |
| 작업 중인 시각 디자인 | Claude Design 프로젝트 |
| Claude Design 프로젝트 URL과 연결 PRD | `claude-design/projects.yaml` |
| 제품에 사용할 승인 버전 | `claude-design/projects.yaml`과 `claude-design/exports/` |
| 승인된 디자인 시스템 릴리스 | `system/README.md` |
| 디자인 결정 이유 | `decisions/DDR-*.md` |

## Design Lifecycle

1. PRD를 만든다.
2. Claude Design 프로젝트를 만들고 `DES-*` ID를 부여한다.
3. `claude-design/projects.yaml`에 URL, 연결 PRD, 현재 상태를 기록한다.
4. 승인 시 버전을 올리고 내보내기본 또는 핸드오프 번들을 보존한다.
5. PRD에서 `DES-*` 승인 버전을 참조한다.

작업 중인 화면 설명을 PRD에 복제하지 않는다. PRD에는 요구사항과 완료 기준을 남기고, 시각적 해석은 승인된 `DES-*` 버전으로 연결한다.

디자인 프로젝트 상태는 PRD와 같은 `ToDo`, `InProgress`, `Hold`, `Done`, `Cancel` 집합을 사용한다. `Done`은 승인 버전과 승인 기준선이 등록된 상태를 의미한다.

새 디자인 결정은 [`decisions/README.md`](decisions/README.md)에서 다음 순번을 확인한 뒤 기록한다.
