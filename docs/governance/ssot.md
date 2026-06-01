# Single Source Of Truth

SSoT는 모든 내용을 한 파일에 넣거나 문서와 구현을 다른 저장소로 분리한다는 뜻이 아니다. 하나의 제품 저장소 안에서 정보 종류마다 권위 있는 원본을 하나만 지정하고, 다른 기록은 ID와 링크로 연결한다는 뜻이다.

## Authority Matrix

| 정보 | 권위 있는 원본 | 다른 위치의 역할 |
| --- | --- | --- |
| 제품 전체 방향, 핵심 가치, 사용자, 제품 범위 | `docs/product/overview.md` | 상세 기능과 작업을 기록하지 않음 |
| 대단위 기능 영역과 안정적인 경계 | `docs/product/capabilities/CAP-*.md` | 상세 요구사항과 일정을 기록하지 않음 |
| 구현 가능한 변화의 상세 요구사항과 완료 기준 | `docs/product/prd/PRD-*.md` | 연결 `CAP-*`를 참조 |
| 제품 작업 상태, 일정, 우선순위 | 해당 `PRD-*`의 `Work Items` | Linear 등은 미러 |
| 승인된 디자인 시스템 릴리스 | `docs/design/system/README.md` | Claude Design 작업 공간은 편집 원본 |
| 진행 중인 시각 디자인 | Claude Design 프로젝트 | `projects.yaml`은 URL과 상태를 추적 |
| 승인된 디자인 기준선 | `docs/design/claude-design/exports/`와 `projects.yaml` | PRD는 `DES-*` 버전을 참조 |
| 디자인 결정 이유 | `docs/design/decisions/DDR-*.md` | PRD는 DDR ID를 참조 |
| 현재 엔지니어링 구조 요약 | `docs/architecture/current.md` | 세부 결정은 ADR로 연결 |
| 아키텍처 결정 이유 | `docs/architecture/adr/ADR-*.md` | 현재 구조 문서는 ADR ID를 참조 |
| API 계약과 버전 | `docs/architecture/api/API-*.md` | PRD와 ADR은 API ID를 참조 |
| 실제 실행 동작 | 구현 코드와 테스트 | PRD는 의도와 완료 기준을 정의 |
| 빌드, 배포, 런타임 설정 | 저장소 내부 설정과 인프라 정의 | 아키텍처 문서는 구조와 결정 이유를 설명 |
| AI 공통 규칙 | 루트 `CLAUDE.md` | `AGENTS.md`는 참조만 제공 |

## Co-Located Repository

- 문서, 코드, 테스트, 설정, 인프라 정의를 같은 Git 저장소에서 관리한다.
- `docs/`는 제품 의도와 결정 기록의 기준 위치이며 구현과 별도 생명주기를 갖지 않는다.
- 구현 경로는 기술 구조가 정해질 때 추가하고 관련 PRD와 ADR에서 참조한다.
- 제품 변경은 가능한 한 PRD, 필요한 결정 문서, 코드, 테스트를 하나의 변경 단위로 갱신한다.
- PRD와 구현이 어긋나면 의도 변경인지 구현 결함인지 먼저 판단하고, 권위 있는 원본을 함께 바로잡는다.

## Product Hierarchy

```text
Product Overview
└── CAP-* Capability
    └── PRD-* Product Change
        └── WORK-* Execution Item
```

- `overview.md`는 제품 전체 방향과 공통 맥락을 설명한다.
- `CAP-*`는 사용자에게 제공하는 대단위 능력과 경계를 설명한다.
- `PRD-*`는 구현 가능한 변화의 상세 요구사항, 완료 기준, 일정, 우선순위를 관리한다.
- `WORK-*`는 PRD 안에서 실행할 구체적인 작업을 관리한다.
- 상위 문서는 하위 내용을 복제하지 않고 ID와 링크로 연결한다.

## Relationship Ownership

| 관계 | 권위 있는 원본 | 인덱스의 역할 |
| --- | --- | --- |
| Capability의 상위 Capability | 하위 `CAP-*`의 `parent_capability` | capability map은 탐색용 요약 |
| PRD가 구체화하는 Capability | `PRD-*`의 `capability_refs` | capability와 PRD 인덱스는 탐색용 요약 |
| PRD 간 의존성 | `PRD-*`의 `depends_on` | 인덱스에는 필요한 경우 요약 |

인덱스와 상위 문서의 목록은 탐색을 돕는 파생 뷰다. 관계가 어긋나면 위 표의 권위 있는 원본을 기준으로 정정한다.

## External Tools

### Linear

Linear를 도입해도 제품 스펙의 원본은 PRD다. Linear 이슈에는 PRD 링크와 ID를 넣고, PRD에는 `external_refs.linear`를 기록한다.

- 먼저 PRD를 변경하고 변경 이유를 기록한다.
- 그다음 Linear의 상태, 담당자, 일정, 우선순위를 동기화한다.
- 불일치가 발견되면 PRD를 기준으로 정정한다.
- Linear에서 새 아이디어가 생기면 PRD로 승격하기 전까지 제품 스펙으로 취급하지 않는다.

### Claude Design

Claude Design은 작업 중인 시각 디자인의 편집 원본이다. 저장소는 제품에서 사용할 승인본과 연결 정보를 보존한다.

- 작업 프로젝트 URL과 연결 PRD를 `docs/design/claude-design/projects.yaml`에 기록한다.
- 승인 시점에 버전을 올리고 내보내기본 또는 핸드오프 번들을 저장한다.
- PRD는 URL 대신 `DES-*`와 승인 버전을 참조한다.
- 자동 연동이 확정되지 않은 기능은 운영 규칙으로 가정하지 않는다.

## Duplication Rules

- PRD 요구사항을 디자인 또는 아키텍처 문서에 복사하지 않는다.
- PRD의 상세 요구사항과 작업 상태를 `overview.md` 또는 `CAP-*`에 복사하지 않는다.
- 현재 상태를 ADR이나 DDR 본문에 반복해서 관리하지 않는다.
- 외부 도구의 설명을 저장소 문서와 동시에 독립적으로 수정하지 않는다.
- 요약이 필요하면 원본 ID와 링크를 함께 표시한다.

## Versioning Rules

- 문서와 구현 변경은 같은 Git 이력으로 추적한다.
- 의미가 바뀐 결정은 ADR 또는 DDR을 새로 추가하고 이전 문서를 `Superseded`로 표시한다.
- 디자인 승인본과 API 계약은 명시적 버전을 가진다.
- 과거 버전은 삭제하지 않고 현재 인덱스에서 활성 버전을 가리킨다.
