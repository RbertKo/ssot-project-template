# Product

제품 요구사항과 해야 할 일은 `prd/`에서만 관리한다.

## Rules

- 하나의 PRD는 검토 가능한 하나의 제품 변화 단위를 설명한다.
- 큰 범위는 여러 PRD로 분리하고 `depends_on` 또는 `related_prds`로 연결한다.
- 모든 요구사항은 `REQ-*` ID를 가진다.
- 모든 실행 항목은 PRD 내부 `Work Items`에 기록한다.
- 디자인, DDR, ADR, API 문서는 요구사항을 복제하지 않고 PRD를 참조한다.
- 구현 코드와 테스트는 같은 저장소에 두고 PRD의 `implementation_refs`와 검증 근거에서 연결한다.

## Create A PRD

[`prd/PRD-000-template.md`](prd/PRD-000-template.md)를 복제하고 다음 순번과 짧은 slug를 사용한다.
