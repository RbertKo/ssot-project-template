# Project Operating System

이 디렉터리는 제품 문서와 구현 코드를 함께 관리하는 단일 제품 저장소다.

제품 스펙, 일정, 디자인 승인본, 아키텍처 결정, AI 작업 규칙, 구현 코드는 같은 Git 이력 안에서 함께 진화한다. 각 정보는 하나의 권위 있는 원본만 가지며, 다른 문서와 외부 도구는 원본을 복제하지 않고 ID와 링크로 참조한다.

`docs/`는 코드와 분리된 별도 프로젝트가 아니다. 제품 의도와 결정 기록을 찾기 위한 저장소 내부의 기준 위치다. 구현 디렉터리는 기술 선택이 확정될 때 루트에 추가하고 관련 PRD와 ADR에서 경로를 연결한다.

## Start Here

1. [`docs/README.md`](docs/README.md)에서 전체 구조와 문서별 책임을 확인한다.
2. [`docs/product/overview.md`](docs/product/overview.md)에서 제품 전체 방향을 확인한다.
3. [`docs/product/capabilities/README.md`](docs/product/capabilities/README.md)에서 대단위 기능 지도를 확인한다.
4. [`docs/governance/ssot.md`](docs/governance/ssot.md)에서 정보별 원본 위치를 확인한다.
5. [`docs/governance/workflow.md`](docs/governance/workflow.md)에서 상태, 우선순위, 변경 규칙을 확인한다.
6. 새 제품 작업은 [`docs/product/prd/PRD-000-template.md`](docs/product/prd/PRD-000-template.md)를 복제해 시작한다.

## Operating Loop

1. 제품 방향이 바뀌면 `overview.md`를 갱신한다.
2. 대단위 기능 경계가 바뀌면 `CAP-*`를 추가하거나 갱신한다.
3. 구현 가능한 제품 변화는 연결 capability를 가진 PRD로 정의한다.
4. 디자인과 아키텍처 기록은 PRD ID를 참조해 추가한다.
5. Claude Design 작업 결과는 디자인 레지스트리에 연결하고 승인 시점의 내보내기본을 보존한다.
6. 구현 코드와 테스트를 추가하고 연결 PRD에 구현 경로와 검증 근거를 기록한다.
7. 변경 시 문서 상단 메타데이터와 문서 하단 변경 이력을 함께 갱신한다.
8. Linear 같은 외부 도구를 사용하면 저장소 문서를 기준으로 동기화하고 외부 ID를 PRD에 기록한다.

## Repository Prerequisite

이 디렉터리를 Git 저장소로 관리한다. 문서, 코드, 테스트, 설정, 인프라 정의의 의미 변경은 같은 저장소의 커밋으로 남겨 시점별 이력을 보존한다.

## Rule Of Thumb

- 요구사항을 찾을 때는 PRD를 본다.
- 제품 전체 방향을 찾을 때는 `docs/product/overview.md`를 본다.
- 대단위 기능 경계를 찾을 때는 `CAP-*`를 본다.
- 실제 동작을 확인할 때는 구현 코드와 테스트를 본다.
- 왜 그렇게 결정했는지 찾을 때는 ADR 또는 DDR을 본다.
- 지금 유효한 승인본을 찾을 때는 각 영역의 인덱스를 본다.
- AI 도구가 따라야 할 규칙을 찾을 때는 [`CLAUDE.md`](CLAUDE.md)를 본다.
