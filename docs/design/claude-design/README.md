# Claude Design Integration

Claude Design을 시각 디자인의 편집 작업 공간으로 사용하고, 저장소에는 추적 가능한 승인 기준선을 남긴다.

Anthropic은 2026년 4월 17일 Claude Design 연구 프리뷰를 발표했다. 공식 소개에 따르면 코드베이스와 디자인 파일을 읽어 디자인 시스템을 구성하고, 폴더 또는 독립 HTML로 내보내며, Claude Code용 핸드오프 번들을 만들 수 있다. 공식 소개는 추가 통합 기능이 향후 제공될 예정이라고 설명하므로, 현재 운영 구조는 별도 API 자동화를 전제로 하지 않는다.

공식 출처: [Introducing Claude Design by Anthropic Labs](https://www.anthropic.com/news/claude-design-anthropic-labs)

## Registration

새 Claude Design 프로젝트를 만들 때 다음 절차를 따른다.

1. 연결할 `PRD-*`를 먼저 생성한다.
2. `DES-*` ID를 부여한다.
3. [`projects.yaml`](projects.yaml)에 프로젝트 URL, 상태, 디자인 시스템 버전, 연결 PRD를 기록한다.
4. Claude Design 프로젝트 설명에도 `DES-*`와 `PRD-*`를 기록한다.

## Approval

승인 시 다음 절차를 따른다.

1. `approved_version`을 증가시킨다.
2. 폴더 또는 HTML 내보내기본을 `exports/DES-NNN/vX.Y.Z/`에 보존한다.
3. Claude Code 핸드오프 번들을 사용하는 경우 `handoffs/DES-NNN/vX.Y.Z/`에 보존한다.
4. `projects.yaml`에 승인일, 변경 이유, 저장 경로를 기록한다.
5. 연결 PRD의 `design_refs`에 `DES-NNN@vX.Y.Z`를 기록한다.

## Directory Rules

- `exports/`는 승인 기준선만 보존한다.
- `handoffs/`는 승인된 구현 전달본만 보존한다.
- 진행 중 실험본은 Claude Design에서 관리하고 저장소에 모두 복제하지 않는다.
- 프로토타입 산출물은 제품 구현으로 취급하지 않는다.
